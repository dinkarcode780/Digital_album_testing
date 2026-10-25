import crypto from "crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import Booking from "../../models/bookingModel.js";
import Event from "../../models/eventModel.js";
import EventCategory from "../../models/eventCateogoryModel.js";
import userModel from "../../models/userModel.js";
import Service from "../../models/servicesModel.js";
import asyncHandler from "../../utils/asyncHandler.js";

// Razorpay SDK Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==========================================
// 1. GET RAZORPAY PUBLIC CONFIG
// ==========================================
export const getBookingRazorpayConfig = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// ==========================================
// 2. CREATE RAZORPAY ORDER FOR BOOKING
// ==========================================
export const createBookingRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, bookingId, clientName } = req.body;

  const parsedAmount = Number(amount);
  if (!parsedAmount || parsedAmount <= 0 || parsedAmount > 10000000) {
    return res.status(400).json({
      success: false,
      message: "A valid advance payment amount is required (max ₹1,00,00,000)",
    });
  }

  const options = {
    amount: Math.round(parsedAmount * 100), // in paise
    currency: "INR",
    receipt: `bk_${crypto.randomBytes(12).toString("hex")}`,
    notes: {
      clientName: clientName || "Client",
      bookingId: bookingId || "",
      purpose: "Photoshoot Advance Booking",
    },
  };

  try {
    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to initiate Razorpay order",
    });
  }
});

// ==========================================
// 3. VERIFY RAZORPAY PAYMENT & CONFIRM BOOKING
// ==========================================
// ==========================================
// 3. VERIFY RAZORPAY PAYMENT & CONFIRM BOOKING
// ==========================================
export const verifyBookingRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    bookingId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    notes,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Missing required Razorpay payment credentials for verification",
    });
  }

  // Verify HMAC signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const sigBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(razorpay_signature);
  if (sigBuffer.length !== receivedBuffer.length || !crypto.timingSafeEquals(sigBuffer, receivedBuffer)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Razorpay payment signature. Payment verification failed.",
    });
  }

  // Update Booking in DB if bookingId provided
  let booking = null;
  if (bookingId) {
    booking = await Booking.findById(bookingId);

    if (booking) {
      const isOwner = booking.userId.toString() === req.user._id.toString();
      const isStudioAdmin = booking.adminId && booking.adminId.toString() === req.user._id.toString();
      const isSuperAdmin = req.user.userType === "SuperAdmin";
      if (!isOwner && !isStudioAdmin && !isSuperAdmin) {
        return res.status(403).json({ success: false, message: "Not authorized to modify this booking" });
      }
    }

    if (booking) {
      const paymentVal = Number(amount) || booking.advanceAmount || 0;

      // Add to transaction log
      booking.transactions.push({
        transactionId: razorpay_payment_id,
        amount: paymentVal,
        paymentMethod: "Razorpay Online",
        paymentStatus: "Completed",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentDate: new Date(),
        notes: notes || (booking.paidAmount > 0 ? "Balance Payment via Razorpay" : "Advance Booking Payment via Razorpay"),
      });

      // Recalculate total paid amount
      const totalPaidSum = booking.transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
      booking.paidAmount = totalPaidSum > 0 ? totalPaidSum : (booking.paidAmount + paymentVal);

      if (booking.totalAmount > 0 && booking.paidAmount >= booking.totalAmount) {
        booking.paymentStatus = "Paid";
      } else if (booking.paidAmount > 0) {
        booking.paymentStatus = "Advance Paid";
      }

      booking.status = booking.status === "Pending" ? "Confirmed" : booking.status;
      booking.paymentMethod = "Razorpay Online";
      booking.razorpayOrderId = razorpay_order_id;
      booking.razorpayPaymentId = razorpay_payment_id;
      booking.razorpaySignature = razorpay_signature;
      booking.transactionId = razorpay_payment_id;
      await booking.save();
    }
  }

  // Also update Event table if synchronized
  try {
    if (booking) {
      await Event.updateMany(
        { userId: booking.userId, adminId: booking.adminId, eventDate: booking.shootDate },
        {
          paymentStatus: booking.paymentStatus,
          status: "Upcoming",
          paymentMethod: "Razorpay Online",
          transactionId: razorpay_payment_id,
        }
      );
    }
  } catch (err) {
  }

  res.status(200).json({
    success: true,
    message: "🎉 Razorpay payment verified and transaction recorded successfully!",
    data: booking || {
      bookingId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: booking?.paymentStatus || "Advance Paid",
      status: booking?.status || "Confirmed",
    },
  });
});

// ==========================================
// 4. CREATE NEW BOOKING (User must be logged in)
// ==========================================
export const createBooking = asyncHandler(async (req, res) => {
  const {
    adminId,
    serviceId,
    clientName,
    clientPhone,
    clientEmail,
    eventCategory: eventCategoryId,
    shootDate,
    shootEndDate,
    location,
    notes,
    paymentOption,
    paymentStatus,
    advanceAmount,
    totalAmount,
    paymentMethod,
    transactionId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = req.body;

  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in before booking a photoshoot.",
    });
  }

  if (!adminId || !clientName || !clientPhone || !shootDate || !eventCategoryId) {
    return res.status(400).json({
      success: false,
      message: "Studio, Client Name, Contact Phone, Shoot Date, and Event Category are required.",
    });
  }

  if (!mongoose.isValidObjectId(eventCategoryId)) {
    return res.status(400).json({
      success: false,
      message: "Please select a valid event category.",
    });
  }

  const eventCategory = await EventCategory.findOne({
    _id: eventCategoryId,
    isActive: true,
  });

  if (!eventCategory) {
    return res.status(400).json({
      success: false,
      message: "Selected event category is unavailable.",
    });
  }

  const finalPaymentOption = paymentOption === "pay_now" ? "pay_now" : "pay_later";
  const finalPaymentStatus =
    paymentStatus || (finalPaymentOption === "pay_now" ? "Advance Paid" : "Pending");
  const finalPaymentMethod =
    paymentMethod || (finalPaymentOption === "pay_now" ? "Razorpay Online" : "Pay Later at Shoot");
  const finalAdvance = finalPaymentOption === "pay_now" ? Number(advanceAmount) || 1000 : 0;
  const initialStatus = finalPaymentStatus === "Advance Paid" ? "Confirmed" : "Pending";
  const parsedTotal = Number(totalAmount) || 0;
  const initialPaid = finalPaymentStatus === "Advance Paid" ? finalAdvance : 0;

  // Initial Transaction Log
  const initialTransactions = [];
  if (initialPaid > 0) {
    initialTransactions.push({
      transactionId: transactionId || razorpayPaymentId || `TXN-${Date.now()}`,
      amount: initialPaid,
      paymentMethod: finalPaymentMethod,
      paymentStatus: "Completed",
      razorpayOrderId: razorpayOrderId || "",
      razorpayPaymentId: razorpayPaymentId || "",
      razorpaySignature: razorpaySignature || "",
      paymentDate: new Date(),
      notes: "Advance Booking Online Payment",
    });
  }

  // 1. Create Booking record
  const booking = await Booking.create({
    userId,
    adminId,
    serviceId: serviceId || null,
    clientName,
    clientPhone,
    clientEmail: clientEmail || req.user.email || "",
    eventCategory: eventCategory._id,
    shootDate: new Date(shootDate),
    shootEndDate: shootEndDate ? new Date(shootEndDate) : null,
    location: location || "Studio Client Location",
    notes: notes || "",
    paymentOption: finalPaymentOption,
    paymentStatus: finalPaymentStatus,
    advanceAmount: finalAdvance,
    paidAmount: initialPaid,
    totalAmount: parsedTotal,
    paymentMethod: finalPaymentMethod,
    transactionId: transactionId || razorpayPaymentId || "",
    razorpayOrderId: razorpayOrderId || "",
    razorpayPaymentId: razorpayPaymentId || "",
    razorpaySignature: razorpaySignature || "",
    status: initialStatus,
    transactions: initialTransactions,
    isActive: true,
  });

  // Auto-assign/associate client user to selected studio admin
  if (userId && adminId) {
    try {
      await userModel.findByIdAndUpdate(userId, { ownerAdminId: adminId });
    } catch (assignErr) {
    }
  }

  // 2. Also register in Event model for studio calendar synchronization
  try {
    await Event.create({
      userId,
      adminId,
      brideName: clientName,
      groomName: eventCategory.name,
      clientPhone,
      clientEmail: clientEmail || req.user.email || "",
      location: location || "Studio Client Location",
      eventDate: new Date(shootDate),
      eventEndDate: shootEndDate ? new Date(shootEndDate) : null,
      notes: notes || "",
      paymentOption: finalPaymentOption,
      paymentStatus: finalPaymentStatus,
      advanceAmount: finalAdvance,
      totalAmount: parsedTotal,
      paymentMethod: finalPaymentMethod,
      transactionId: transactionId || razorpayPaymentId || "",
      status: "Upcoming",
      isActive: true,
    });
  } catch (syncErr) {
  }

  const populatedBooking = await Booking.findById(booking._id)
    .populate("adminId", "name email phoneNumber address profileImage")
    .populate("serviceId", "title price description features")
    .populate("eventCategory", "name");

  res.status(201).json({
    success: true,
    message:
      finalPaymentOption === "pay_now"
        ? `Booking confirmed with ₹${finalAdvance} advance payment! Studio will contact you soon.`
        : "Booking request submitted successfully! Pay on shoot date.",
    data: populatedBooking,
  });
});

// ==========================================
// 4.1 ADD MANUAL OR BALANCE PAYMENT TO BOOKING
// ==========================================
export const addBookingPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount, paymentMethod, notes, transactionId } = req.body;

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  const isOwner = booking.userId.toString() === req.user._id.toString();
  const isStudioAdmin = booking.adminId && booking.adminId.toString() === req.user._id.toString();
  const isSuperAdmin = req.user.userType === "SuperAdmin";
  if (!isOwner && !isStudioAdmin && !isSuperAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized to modify this booking" });
  }

  const payAmt = Number(amount);
  if (!payAmt || payAmt <= 0) {
    return res.status(400).json({ success: false, message: "A valid payment amount is required" });
  }

  const newTxn = {
    transactionId: transactionId || `TXN-${Date.now().toString(36).toUpperCase()}`,
    amount: payAmt,
    paymentMethod: paymentMethod || "Online Payment",
    paymentStatus: "Completed",
    paymentDate: new Date(),
    notes: notes || "Booking Payment",
  };

  booking.transactions.push(newTxn);

  const totalPaidSum = booking.transactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
  booking.paidAmount = totalPaidSum;

  if (booking.totalAmount > 0 && booking.paidAmount >= booking.totalAmount) {
    booking.paymentStatus = "Paid";
  } else if (booking.paidAmount > 0) {
    booking.paymentStatus = "Advance Paid";
  }

  await booking.save();

  const populatedBooking = await Booking.findById(booking._id)
    .populate("adminId", "name email phoneNumber address profileImage")
    .populate("serviceId", "title price description features")
    .populate("eventCategory", "name");

  res.status(200).json({
    success: true,
    message: `Payment of ₹${payAmt} recorded successfully!`,
    data: populatedBooking,
  });
});

// ==========================================
// 5. GET USER'S BOOKINGS (Client Profile)
// ==========================================
export const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const bookings = await Booking.find({ userId, isActive: true })
    .populate("adminId", "name email phoneNumber address profileImage")
    .populate("serviceId", "title price description features")
    .populate("eventCategory", "name")
    .sort({ createdAt: -1 });

  const formattedBookings = bookings.map((b) => {
    const obj = b.toObject();
    const servicePrice = obj.serviceId?.price || 25000;
    if (!obj.totalAmount || obj.totalAmount <= 0) {
      obj.totalAmount = servicePrice;
    }
    const transactionsPaid = (obj.transactions || []).reduce(
      (sum, t) => sum + (Number(t.amount) || 0),
      0
    );
    obj.paidAmount = transactionsPaid > 0 ? transactionsPaid : (obj.paidAmount || obj.advanceAmount || 0);
    return obj;
  });

  res.status(200).json({
    success: true,
    count: formattedBookings.length,
    data: formattedBookings,
  });
});

// ==========================================
// 6. GET STUDIO'S BOOKINGS (Admin Dashboard)
// ==========================================
export const getStudioBookings = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const userType = req.user?.userType;

  let query = { isActive: true };

  if (userType === "SuperAdmin") {
    // SuperAdmin can view all bookings across all studios
    query = { isActive: true };
  } else if (userType === "Admin") {
    // Studio Admin gets bookings for their adminId, or unassigned bookings
    query = {
      isActive: true,
      $or: [
        { adminId: userId },
        { adminId: { $exists: false } },
        { adminId: null },
      ],
    };
  }

  // Fetch bookings with populated details
  let bookings = await Booking.find(query)
    .populate("userId", "name email phoneNumber profileImage")
    .populate("adminId", "name email phoneNumber address profileImage")
    .populate("serviceId", "title price description features")
    .populate("eventCategory", "name")
    .sort({ createdAt: -1 });

  const formattedBookings = bookings.map((b) => {
    const obj = b.toObject();
    const servicePrice = obj.serviceId?.price || 25000;
    if (!obj.totalAmount || obj.totalAmount <= 0) {
      obj.totalAmount = servicePrice;
    }
    const transactionsPaid = (obj.transactions || []).reduce(
      (sum, t) => sum + (Number(t.amount) || 0),
      0
    );
    obj.paidAmount = transactionsPaid > 0 ? transactionsPaid : (obj.paidAmount || obj.advanceAmount || 0);
    return obj;
  });

  res.status(200).json({
    success: true,
    count: formattedBookings.length,
    data: formattedBookings,
  });
});

// ==========================================
// 7. GET SINGLE BOOKING BY ID
// ==========================================
export const getBookingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id)
    .populate("adminId", "name email phoneNumber address profileImage")
    .populate("userId", "name email phoneNumber profileImage")
    .populate("serviceId", "title price description features")
    .populate("eventCategory", "name");

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking record not found",
    });
  }

  const isOwner = booking.userId && booking.userId._id.toString() === req.user._id.toString();
  const isStudioAdmin = booking.adminId && booking.adminId._id.toString() === req.user._id.toString();
  const isSuperAdmin = req.user.userType === "SuperAdmin";
  if (!isOwner && !isStudioAdmin && !isSuperAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized to view this booking" });
  }

  const obj = booking.toObject();
  const servicePrice = obj.serviceId?.price || 25000;
  if (!obj.totalAmount || obj.totalAmount <= 0) {
    obj.totalAmount = servicePrice;
  }
  const transactionsPaid = (obj.transactions || []).reduce(
    (sum, t) => sum + (Number(t.amount) || 0),
    0
  );
  obj.paidAmount = transactionsPaid > 0 ? transactionsPaid : (obj.paidAmount || obj.advanceAmount || 0);

  res.status(200).json({
    success: true,
    data: obj,
  });
});

// ==========================================
// 8. UPDATE BOOKING STATUS (Admin or User)
// ==========================================
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus, notes } = req.body;

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  const isStudioAdmin = booking.adminId && booking.adminId.toString() === req.user._id.toString();
  const isSuperAdmin = req.user.userType === "SuperAdmin";
  if (!isStudioAdmin && !isSuperAdmin) {
    return res.status(403).json({ success: false, message: "Only the studio admin can update booking status" });
  }

  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;
  if (notes) booking.notes = notes;

  await booking.save();
  await booking.populate("eventCategory", "name");

  res.status(200).json({
    success: true,
    message: "Booking status updated successfully",
    data: booking,
  });
});

// ==========================================
// 9. CANCEL BOOKING
// ==========================================
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: "Booking not found",
    });
  }

  const isOwner = booking.userId.toString() === req.user._id.toString();
  const isStudioAdmin = booking.adminId && booking.adminId.toString() === req.user._id.toString();
  const isSuperAdmin = req.user.userType === "SuperAdmin";
  if (!isOwner && !isStudioAdmin && !isSuperAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
  }

  booking.status = "Cancelled";
  await booking.save();
  await booking.populate("eventCategory", "name");

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
});
