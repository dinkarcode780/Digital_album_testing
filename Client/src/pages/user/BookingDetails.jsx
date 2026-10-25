import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaCamera,
  FaMoneyBillWave,
  FaCheckCircle,
  FaDownload,
  FaWhatsapp,
  FaSpinner,
  FaCreditCard,
  FaReceipt,
  FaClock,
  FaTimesCircle,
  FaStore,
  FaHistory,
  FaPrint,
  FaCopy,
} from "react-icons/fa";
import {
  getBookingById,
  createBookingRazorpayOrder,
  verifyBookingRazorpayPayment,
  addBookingPayment,
} from "../../app/booking/bookingThunk";
import toast from "react-hot-toast";

// Helper to load Razorpay SDK dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BookingDetails = () => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const bookingId = paramId || searchParams.get("id");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { booking, loading, paymentLoading, error } = useSelector((state) => state.booking);
  const { user } = useSelector((state) => state.auth);

  // Pay Remaining Balance Modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [payAmountInput, setPayAmountInput] = useState("");

  // Invoice Print Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const invoiceRef = useRef();

  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingById(bookingId));
    }
  }, [dispatch, bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-slate-200/80">
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto" />
          <p className="text-slate-600 font-semibold mt-4 text-base">Loading photoshoot details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-slate-200/80 max-w-md">
          <FaTimesCircle className="text-5xl text-rose-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800 mt-4">Booking Not Found</h2>
          <p className="text-slate-500 text-sm mt-2">
            The booking record you requested could not be located or may have been removed.
          </p>
          <Link
            to="/book"
            className="mt-6 inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-purple-700 transition-all shadow-lg shadow-purple-600/20"
          >
            <FaArrowLeft /> Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const eventCategoryName = booking.eventCategory?.name || booking.eventType || "Event";

  // Calculations for financial history
  const totalAmount = booking.totalAmount || 0;
  const paidAmount = booking.paidAmount || booking.advanceAmount || 0;
  const remainingBalance = Math.max(0, totalAmount - paidAmount);
  const isFullyPaid = booking.paymentStatus === "Paid" || remainingBalance === 0;

  // Formatted Transactions History Array
  let transactionsHistory = booking.transactions || [];
  if (transactionsHistory.length === 0 && paidAmount > 0) {
    transactionsHistory = [
      {
        transactionId: booking.transactionId || booking.razorpayPaymentId || "INIT-ADVANCE",
        amount: paidAmount,
        paymentMethod: booking.paymentMethod || "Razorpay Online",
        paymentStatus: "Completed",
        paymentDate: booking.createdAt,
        notes: "Advance Booking Payment",
      },
    ];
  }

  // Handle Online Balance Payment
  const handlePayBalance = async () => {
    const payVal = payAmountInput ? Number(payAmountInput) : remainingBalance;

    if (payVal <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    try {
      const orderRes = await dispatch(
        createBookingRazorpayOrder({
          amount: payVal,
          bookingId: booking._id,
          clientName: booking.clientName,
        })
      ).unwrap();

      const options = {
        key: orderRes.keyId,
        amount: orderRes.amount,
        currency: orderRes.currency || "INR",
        name: "Digital Album Studio",
        description: `Balance Payment for Booking #${booking._id?.substring(18).toUpperCase()}`,
        order_id: orderRes.orderId,
        handler: async function (razorResponse) {
          await dispatch(
            verifyBookingRazorpayPayment({
              bookingId: booking._id,
              amount: payVal,
              razorpay_order_id: razorResponse.razorpay_order_id,
              razorpay_payment_id: razorResponse.razorpay_payment_id,
              razorpay_signature: razorResponse.razorpay_signature,
              notes: "Balance Online Payment via Razorpay",
            })
          ).unwrap();

          toast.success(`🎉 Payment of ₹${payVal.toLocaleString("en-IN")} successful!`);
          setShowPayModal(false);
          dispatch(getBookingById(booking._id));
        },
        prefill: {
          name: booking.clientName,
          email: booking.clientEmail,
          contact: booking.clientPhone,
        },
        theme: { color: "#7c3aed" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || "Payment failed");
    }
  };

  // WhatsApp Contact Handler
  const openWhatsApp = () => {
    const studioPhone = booking.adminId?.phoneNumber || "919876543210";
    const msg = encodeURIComponent(
      `Hello Studio! I'm inquiring about my Photoshoot Booking #${booking._id?.substring(18).toUpperCase()} (${eventCategoryName
      }) scheduled for ${new Date(booking.shootDate).toLocaleDateString("en-IN")}.`
    );
    window.open(`https://wa.me/${studioPhone.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  // Print Invoice Handler
  const handlePrintInvoice = () => {
    window.print();
  };

  // Copy Transaction ID to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Transaction ID copied to clipboard!");
  };

  // Timeline Steps Status Logic
  const getStepStatus = (index) => {
    if (booking.status === "Cancelled") return false;
    if (booking.status === "Completed") return true;
    if (index === 0) return true; // Submitted
    if (index === 1) return paidAmount > 0 || booking.status === "Confirmed"; // Payment
    if (index === 2) return ["Confirmed", "In Progress"].includes(booking.status); // Scheduled
    if (index === 3) return booking.status === "In Progress"; // Shoot Progress
    if (index === 4) return booking.status === "Completed"; // Delivery
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Back Link */}
        <Link
          to="/book"
          className="inline-flex items-center gap-2 text-purple-700 font-semibold text-sm hover:underline mb-6 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200/80"
        >
          <FaArrowLeft /> Back to My Bookings
        </Link>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === "Confirmed"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : booking.status === "Completed"
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : booking.status === "Cancelled"
                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                >
                  {booking.status}
                </span>

                <span
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold ${isFullyPaid
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : paidAmount > 0
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                >
                  Payment: {booking.paymentStatus || (isFullyPaid ? "Paid" : "Pending")}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-4">{eventCategoryName}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
                <p>
                  Booking ID:{" "}
                  <span className="font-mono font-bold text-slate-800 ml-1">
                    #{booking._id ? booking._id.substring(18).toUpperCase() : "BK"}
                  </span>
                </p>
                <span>•</span>
                <p>
                  Booked On:{" "}
                  <span className="font-semibold text-slate-700">
                    {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              {!isFullyPaid && booking.status !== "Cancelled" && (
                <button
                  onClick={() => {
                    setPayAmountInput(remainingBalance.toString());
                    setShowPayModal(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-emerald-600/20"
                >
                  <FaCreditCard /> Pay Balance ₹{remainingBalance.toLocaleString("en-IN")}
                </button>
              )}

              <button
                onClick={() => setShowInvoiceModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-purple-600/20"
              >
                <FaReceipt /> View Invoice
              </button>

              <button
                onClick={openWhatsApp}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-emerald-500/20"
              >
                <FaWhatsapp className="text-lg" /> Contact Studio
              </button>
            </div>
          </div>
        </div>

        {/* FINANCIAL SUMMARY CARDS (Kitna Paid, Kitna Bacha) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Total Package Amount */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Package Amount</p>
              <h3 className="text-3xl font-black text-slate-900 mt-2">₹{totalAmount.toLocaleString("en-IN")}</h3>
              <p className="text-xs text-slate-500 mt-1">Full photoshoot charge</p>
            </div>
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
              <FaMoneyBillWave />
            </div>
          </div>

          {/* Paid / Advance Amount */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Paid Amount (जमा राशि)</p>
              <h3 className="text-3xl font-black text-emerald-600 mt-2">₹{paidAmount.toLocaleString("en-IN")}</h3>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                {isFullyPaid ? "100% Fully Settled" : `${Math.round((paidAmount / (totalAmount || 1)) * 100)}% Received`}
              </p>
            </div>
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
              <FaCheckCircle />
            </div>
          </div>

          {/* Remaining Balance */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining Due (बकाया राशि)</p>
              <h3 className={`text-3xl font-black mt-2 ${remainingBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                ₹{remainingBalance.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {remainingBalance > 0 ? "Pending to be paid" : "Zero Balance Due"}
              </p>
            </div>
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold ${remainingBalance > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                }`}
            >
              <FaCreditCard />
            </div>
          </div>
        </div>

        {/* Main Details & Transaction History Content */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column (2 cols): Info & Timeline */}
          <div className="lg:col-span-2 space-y-8">
            {/* FULL TRANSACTION HISTORY LOG TABLE */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-4 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <FaHistory className="text-purple-600 shrink-0" /> Transaction History (पूरी ट्रांजेक्शन हिस्ट्री)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete record of payments made towards this photoshoot booking
                  </p>
                </div>
                <span className="text-xs font-bold bg-purple-100 text-purple-700 px-3 py-1 rounded-full shrink-0">
                  {transactionsHistory.length} Payments
                </span>
              </div>

              {transactionsHistory.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200/60">
                  <p className="text-slate-500 text-sm font-medium">No transaction payments recorded yet.</p>
                </div>
              ) : (
                <>
                  {/* MOBILE VIEW (Card Layout for screens < md) */}
                  <div className="space-y-3 block md:hidden">
                    {transactionsHistory.map((t, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[11px] font-bold uppercase text-slate-400">Date & Time</span>
                            <p className="text-xs font-semibold text-slate-800">
                              {new Date(t.paymentDate || t.createdAt || Date.now()).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}{" "}
                              ·{" "}
                              {new Date(t.paymentDate || t.createdAt || Date.now()).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>

                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {t.paymentStatus || "Completed"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-lg">
                            <span className="truncate max-w-[140px]">
                              {t.transactionId || t.razorpayPaymentId || "TXN-PAYMENT"}
                            </span>
                            <button
                              onClick={() => copyToClipboard(t.transactionId || t.razorpayPaymentId)}
                              className="text-purple-600 hover:text-purple-800 shrink-0"
                              title="Copy Transaction ID"
                            >
                              <FaCopy />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 font-medium block">
                              {t.paymentMethod || "Online"}
                            </span>
                            <span className="text-base font-extrabold text-emerald-600">
                              ₹{(t.amount || 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {t.notes && (
                          <p className="text-[11px] text-slate-500 bg-white p-2 rounded-xl border border-slate-100">
                            Note: {t.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* TABLE VIEW WITH SMOOTH HORIZONTAL SCROLL (For screens >= md) */}
                  <div className="hidden md:block overflow-x-auto w-full max-w-full rounded-2xl border border-slate-200/80">
                    <table className="w-full min-w-[620px] text-left text-sm">
                      <thead>
                        <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                          <th className="py-3.5 px-4">Date & Time</th>
                          <th className="py-3.5 px-4">Transaction ID</th>
                          <th className="py-3.5 px-4">Payment Method</th>
                          <th className="py-3.5 px-4">Amount</th>
                          <th className="py-3.5 px-4 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {transactionsHistory.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 font-medium text-slate-700">
                              {new Date(t.paymentDate || t.createdAt || Date.now()).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                              <span className="block text-xs text-slate-400">
                                {new Date(t.paymentDate || t.createdAt || Date.now()).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg w-fit">
                                {t.transactionId || t.razorpayPaymentId || "TXN-PAYMENT"}
                                <button
                                  onClick={() => copyToClipboard(t.transactionId || t.razorpayPaymentId)}
                                  className="text-purple-400 hover:text-purple-700"
                                  title="Copy Transaction ID"
                                >
                                  <FaCopy />
                                </button>
                              </div>
                              <span className="block text-xs text-slate-400 mt-1">{t.notes || "Shoot Payment"}</span>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-700">
                              {t.paymentMethod || "Razorpay Online"}
                            </td>
                            <td className="py-4 px-4 font-bold text-emerald-600 text-base">
                              ₹{(t.amount || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                                {t.paymentStatus || "Completed"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* EVENT & VENUE DETAILS */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FaCamera className="text-purple-600" /> Event & Photoshoot Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl text-xl">
                    <FaCamera />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Event Type</p>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">{eventCategoryName}</h3>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl text-xl">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Shoot Date</p>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">
                      {booking.shootDate
                        ? new Date(booking.shootDate).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        : "N/A"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 md:col-span-2">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl text-xl">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Location / Venue</p>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">{booking.location || "Client Location"}</h3>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-sm text-slate-700">
                  <p className="font-bold text-amber-900 mb-1">Special Instructions & Notes:</p>
                  <p>{booking.notes}</p>
                </div>
              )}
            </div>

            {/* BOOKING TIMELINE TRACKER */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Booking Progress Timeline</h2>

              <div className="space-y-6">
                {[
                  { title: "Booking Request Submitted", desc: "Form details received by studio" },
                  { title: "Advance Payment Received", desc: "Advance payment verified" },
                  { title: "Photoshoot Scheduled", desc: "Date & team confirmed for shoot" },
                  { title: "Shoot In-Progress / Processing", desc: "Editing & album design phase" },
                  { title: "Album Delivery & Completion", desc: "Digital album & prints delivered" },
                ].map((step, index) => {
                  const isDone = getStepStatus(index);
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-0.5">
                        <FaCheckCircle className={`text-2xl ${isDone ? "text-emerald-500" : "text-slate-300"}`} />
                      </div>
                      <div>
                        <h3 className={`font-bold text-base ${isDone ? "text-slate-900" : "text-slate-400"}`}>
                          {step.title}
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (1 col): Customer & Studio Contact info */}
          <div className="space-y-8">
            {/* STUDIO PARTNER DETAILS */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <FaStore className="text-purple-600" /> Studio Partner Info
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
                  <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center font-black text-xl">
                    {booking.adminId?.name?.[0] || "S"}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{booking.adminId?.name || "Studio Partner"}</h3>
                    <p className="text-xs text-slate-500">Official Photography Studio</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm pt-2">
                  <div className="flex items-center gap-3 text-slate-600">
                    <FaPhoneAlt className="text-purple-600 shrink-0" />
                    <span className="font-semibold text-slate-800">
                      {booking.adminId?.phoneNumber || "+91 98765 43210"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <FaEnvelope className="text-purple-600 shrink-0" />
                    <span className="font-semibold text-slate-800 truncate">
                      {booking.adminId?.email || "studio@digitalalbum.com"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-600">
                    <FaMapMarkerAlt className="text-purple-600 shrink-0" />
                    <span className="font-semibold text-slate-800">
                      {booking.adminId?.address || "Studio Address"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={openWhatsApp}
                  className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  <FaWhatsapp className="text-lg" /> Chat on WhatsApp
                </button>
              </div>
            </div>

            {/* CUSTOMER INFORMATION */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <FaUser className="text-purple-600" /> Customer Details
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                    <FaUser />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Client Name</p>
                    <p className="font-bold text-slate-800 text-base">{booking.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Phone Number</p>
                    <p className="font-bold text-slate-800 text-base">{booking.clientPhone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                    <FaEnvelope />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Email Address</p>
                    <p className="font-bold text-slate-800 text-base truncate">{booking.clientEmail || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PAY BALANCE ONLINE MODAL */}
      {/* ======================================================== */}
      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-5 sm:p-6 border border-slate-100 my-auto max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaCreditCard className="text-emerald-600 shrink-0" /> Pay Remaining Balance
              </h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Event:</span>
                  <span className="font-bold text-slate-800">{eventCategoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Package Amount:</span>
                  <span className="font-bold">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Already Paid:</span>
                  <span className="font-bold text-emerald-600">₹{paidAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <span className="text-slate-800">Remaining Balance Due:</span>
                  <span className="text-rose-600">₹{remainingBalance.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enter Amount to Pay (₹)</label>
                <input
                  type="number"
                  value={payAmountInput}
                  onChange={(e) => setPayAmountInput(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter amount"
                />
              </div>

              <button
                onClick={handlePayBalance}
                disabled={paymentLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 text-sm transition-all flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <FaCreditCard /> Pay ₹{Number(payAmountInput || 0).toLocaleString("en-IN")} Now via Razorpay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* INVOICE VIEW MODAL */}
      {/* ======================================================== */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-4 sm:p-8 border border-slate-100 my-auto max-h-[92vh] flex flex-col">
            {/* Header (Always pinned visible at top) */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 shrink-0">
              <h3 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaReceipt className="text-purple-600 shrink-0" /> Photoshoot Invoice
              </h3>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePrintInvoice}
                  className="bg-purple-600 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 hover:bg-purple-700 transition-all shadow-sm"
                >
                  <FaPrint /> Print Receipt
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl font-bold px-1"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Printable Invoice Body (Smoothly scrollable inside modal) */}
            <div ref={invoiceRef} className="py-6 space-y-6 overflow-y-auto flex-1 pr-1">
              <div className="flex justify-between items-start border-b pb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-purple-900">DIGITAL ALBUM</h2>
                  <p className="text-xs text-slate-500 mt-1">Official Photoshoot Booking Receipt</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">Invoice Number</span>
                  <span className="font-mono font-bold text-purple-700 text-xs sm:text-sm">
                    #INV-{booking._id?.substring(18).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Client & Studio Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 text-xs">
                <div>
                  <p className="font-bold text-slate-400 uppercase text-[10px] sm:text-xs">Billed To (Customer):</p>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm mt-1">{booking.clientName}</p>
                  <p className="text-slate-600">{booking.clientPhone}</p>
                  <p className="text-slate-600 truncate max-w-[150px] sm:max-w-none">{booking.clientEmail}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-400 uppercase text-[10px] sm:text-xs">Studio Provider:</p>
                  <p className="font-bold text-slate-900 text-xs sm:text-sm mt-1">{booking.adminId?.name || "Digital Album Studio"}</p>
                  <p className="text-slate-600">{booking.adminId?.phoneNumber || "+91 9876543210"}</p>
                  <p className="text-slate-600">{booking.adminId?.address || "Studio Location"}</p>
                </div>
              </div>

              {/* Event Table */}
              <div className="border rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3">Shoot Date</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-3 font-bold text-slate-800">{eventCategoryName}</td>
                      <td className="p-3 text-slate-600">
                        {new Date(booking.shootDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">₹{totalAmount.toLocaleString("en-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation */}
              <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Total Package Price:</span>
                  <span className="font-bold text-slate-800">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Total Paid (Advance + Installments):</span>
                  <span>- ₹{paidAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-sm font-black text-slate-900">
                  <span>Balance Due:</span>
                  <span className={remainingBalance > 0 ? "text-rose-600" : "text-emerald-600"}>
                    ₹{remainingBalance.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="text-center pt-4 border-t text-[11px] text-slate-400">
                Thank you for choosing Digital Album. For support, email support@digitalalbum.com
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;