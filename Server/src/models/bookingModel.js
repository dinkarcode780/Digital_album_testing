import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required for booking"],
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Studio Admin ID is required"],
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    clientPhone: {
      type: String,
      required: [true, "Client phone number is required"],
      trim: true,
    },
    clientEmail: {
      type: String,
      trim: true,
      default: "",
    },
    eventCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventCategory",
      required: function () {
        return !this.eventType;
      },
    },
    eventType: {
      type: String,
      trim: true,
    },
    shootDate: {
      type: Date,
      required: [true, "Shoot date is required"],
    },
    shootEndDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      default: "Studio Client Location",
    },
    notes: {
      type: String,
      default: "",
    },
    paymentOption: {
      type: String,
      enum: ["pay_now", "pay_later"],
      default: "pay_later",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Advance Paid", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      default: "Pay Later at Shoot",
    },
    transactionId: {
      type: String,
      default: "",
    },
    transactions: [
      {
        transactionId: { type: String, default: "" },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, default: "Razorpay Online" },
        paymentStatus: { type: String, default: "Completed" },
        razorpayOrderId: { type: String, default: "" },
        razorpayPaymentId: { type: String, default: "" },
        razorpaySignature: { type: String, default: "" },
        paymentDate: { type: Date, default: Date.now },
        notes: { type: String, default: "Payment" },
      },
    ],
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },
    razorpaySignature: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
