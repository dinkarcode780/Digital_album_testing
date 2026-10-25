import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaRupeeSign,
  FaRegStickyNote,
  FaCamera,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaPlus,
  FaList,
  FaInfoCircle,
  FaCreditCard,
  FaChevronRight,
  FaStore,
  FaSearch,
  FaFilter,
} from "react-icons/fa";
import {
  getUserBookings,
  createBooking,
  cancelBooking,
  createBookingRazorpayOrder,
  verifyBookingRazorpayPayment,
} from "../../app/booking/bookingThunk";
import { getEventCategoryByFilter } from "../../app/category/categoryThunk";
import { resetBookingState } from "../../app/booking/bookingSlice";
import axiosInstance from "../../config/axios";
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

const Booking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { bookings = [], loading, paymentLoading, success, error, message } = useSelector(
    (state) => state.booking
  );
  const { user } = useSelector((state) => state.auth);
  const { eventCategories = [], loading: categoriesLoading } = useSelector(
    (state) => state.eventCategory
  );

  // Active Tab: "my_bookings" or "new_booking"
  const defaultTab = searchParams.get("action") === "new" ? "new_booking" : "my_bookings";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Studios list for booking form dropdown
  const [studios, setStudios] = useState([]);
  const [studiosLoading, setStudiosLoading] = useState(false);

  // Quick Pay Remaining Balance Modal state
  const [payModalBooking, setPayModalBooking] = useState(null);
  const [payCustomAmount, setPayCustomAmount] = useState("");

  // Booking Form State
  const [formData, setFormData] = useState({
    adminId: "",
    serviceId: "",
    clientName: user?.name || "",
    clientPhone: user?.phoneNumber || "",
    clientEmail: user?.email || "",
    eventCategory: "",
    shootDate: "",
    shootEndDate: "",
    location: "",
    notes: "",
    totalAmount: "25000",
    advanceAmount: "2000",
    paymentOption: "pay_later", // "pay_now" or "pay_later"
  });

  // Pre-fill user details when auth updates
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        clientName: prev.clientName || user.name || "",
        clientPhone: prev.clientPhone || user.phoneNumber || "",
        clientEmail: prev.clientEmail || user.email || "",
      }));
    }
  }, [user]);

  // Fetch user bookings on mount
  useEffect(() => {
    dispatch(getUserBookings());
    dispatch(getEventCategoryByFilter({ page: 1, limit: 100, isActive: true }));
    fetchStudios();
  }, [dispatch]);

  useEffect(() => {
    if (!formData.eventCategory && eventCategories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        eventCategory: eventCategories[0]._id,
      }));
    }
  }, [eventCategories, formData.eventCategory]);

  // Handle toast notifications & reset state
  useEffect(() => {
    if (success && message) {
      toast.success(message);
      dispatch(resetBookingState());
      dispatch(getUserBookings());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBookingState());
    }
  }, [success, error, message, dispatch]);

  // Fetch registered studios list safely
  const fetchStudios = async () => {
    try {
      setStudiosLoading(true);
      const res = await axiosInstance.get("/public/studios");
      const list = Array.isArray(res.data?.data?.studios)
        ? res.data.data.studios
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];
      setStudios(list);
      if (list.length > 0 && !formData.adminId) {
        setFormData((prev) => ({ ...prev, adminId: list[0].adminId || list[0]._id }));
      }
    } catch (err) {
      console.warn("Studios list fetch note:", err.message);
      setStudios([]);
    } finally {
      setStudiosLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit New Booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!formData.adminId) {
      toast.error("Please select a photo studio");
      return;
    }
    if (!formData.clientName || !formData.clientPhone) {
      toast.error("Please enter Client Name and Phone number");
      return;
    }
    if (!formData.shootDate) {
      toast.error("Please select the Shoot Date");
      return;
    }
    if (!formData.eventCategory) {
      toast.error("Please select an event category");
      return;
    }

    // 1. Pay Now via Razorpay Flow
    if (formData.paymentOption === "pay_now") {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      const advanceAmt = Number(formData.advanceAmount) || 1000;

      try {
        const orderRes = await dispatch(
          createBookingRazorpayOrder({
            amount: advanceAmt,
            clientName: formData.clientName,
          })
        ).unwrap();

        if (!orderRes?.orderId) {
          toast.error("Could not create Razorpay order.");
          return;
        }

        const options = {
          key: orderRes.keyId,
          amount: orderRes.amount,
          currency: orderRes.currency || "INR",
          name: "Digital Album Studio",
          description: `Advance Payment for ${
            eventCategories.find((category) => category._id === formData.eventCategory)?.name || "Photoshoot"
          }`,
          order_id: orderRes.orderId,
          handler: async function (razorResponse) {
            const bookingPayload = {
              ...formData,
              paymentStatus: "Advance Paid",
              paymentMethod: "Razorpay Online",
              razorpayOrderId: razorResponse.razorpay_order_id,
              razorpayPaymentId: razorResponse.razorpay_payment_id,
              razorpaySignature: razorResponse.razorpay_signature,
              transactionId: razorResponse.razorpay_payment_id,
            };

            const createdBooking = await dispatch(createBooking(bookingPayload)).unwrap();
            toast.success("🎉 Payment verified and booking created successfully!");
            setActiveTab("my_bookings");
            if (createdBooking?.data?._id) {
              navigate(`/booking-details/${createdBooking.data._id}`);
            }
          },
          prefill: {
            name: formData.clientName,
            email: formData.clientEmail,
            contact: formData.clientPhone,
          },
          theme: { color: "#7c3aed" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        toast.error(err.message || "Failed to initiate payment");
      }
    } else {
      // 2. Pay Later Flow
      try {
        const res = await dispatch(createBooking(formData)).unwrap();
        toast.success("🎉 Booking request submitted! Studio will contact you soon.");
        setActiveTab("my_bookings");
        if (res?.data?._id) {
          navigate(`/booking-details/${res.data._id}`);
        }
      } catch (err) {
        toast.error(err.message || "Booking creation failed");
      }
    }
  };

  // Quick Pay Balance via Razorpay
  const handlePayBalanceOnline = async (bookingItem) => {
    const totalPkg = bookingItem.totalAmount && bookingItem.totalAmount > 0 ? bookingItem.totalAmount : (bookingItem.serviceId?.price || 25000);
    const paidVal = bookingItem.paidAmount || bookingItem.advanceAmount || 0;
    const remaining = Math.max(0, totalPkg - paidVal);
    const payAmt = payCustomAmount ? Number(payCustomAmount) : remaining;

    if (payAmt <= 0) {
      toast.error("No balance pending for this booking");
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
          amount: payAmt,
          bookingId: bookingItem._id,
          clientName: bookingItem.clientName,
        })
      ).unwrap();

      const options = {
        key: orderRes.keyId,
        amount: orderRes.amount,
        currency: orderRes.currency || "INR",
        name: "Digital Album Studio",
        description: `Balance Payment for Booking #${bookingItem._id?.substring(18).toUpperCase()}`,
        order_id: orderRes.orderId,
        handler: async function (razorResponse) {
          await dispatch(
            verifyBookingRazorpayPayment({
              bookingId: bookingItem._id,
              amount: payAmt,
              razorpay_order_id: razorResponse.razorpay_order_id,
              razorpay_payment_id: razorResponse.razorpay_payment_id,
              razorpay_signature: razorResponse.razorpay_signature,
              notes: "Balance Online Payment via Razorpay",
            })
          ).unwrap();

          toast.success(`🎉 Balance payment of ₹${payAmt.toLocaleString("en-IN")} successful!`);
          setPayModalBooking(null);
          setPayCustomAmount("");
          dispatch(getUserBookings());
        },
        prefill: {
          name: bookingItem.clientName,
          email: bookingItem.clientEmail,
          contact: bookingItem.clientPhone,
        },
        theme: { color: "#7c3aed" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message || "Payment initiation failed");
    }
  };

  // Cancel Booking handler
  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelBooking(bookingId));
    }
  };

  // Safe bookings array
  const safeBookingsList = Array.isArray(bookings) ? bookings : [];

  // Calculate Summary Stats
  const totalBookingsCount = safeBookingsList.length;
  const activeBookingsCount = safeBookingsList.filter((b) => ["Pending", "Confirmed", "In Progress"].includes(b.status)).length;
  const totalPaidSum = safeBookingsList.reduce((sum, b) => sum + (b.paidAmount || b.advanceAmount || 0), 0);
  const totalPendingSum = safeBookingsList.reduce((sum, b) => {
    if (b.status === "Cancelled") return sum;
    const totalPkg = b.totalAmount && b.totalAmount > 0 ? b.totalAmount : (b.serviceId?.price || 25000);
    const paid = b.paidAmount || b.advanceAmount || 0;
    const remaining = Math.max(0, totalPkg - paid);
    return sum + remaining;
  }, 0);

  // Filter Bookings List
  const filteredBookings = safeBookingsList.filter((b) => {
    const matchesStatus = filterStatus === "All" || b.status === filterStatus;
    const matchesSearch =
      (b.eventCategory?.name || b.eventType || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.adminId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b._id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white py-12 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs px-3 py-1 rounded-full font-medium mb-3">
              <FaCamera className="text-purple-400" /> Professional Photoshoot Management
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">
              Event <span className="text-purple-400">Bookings</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-2 max-w-xl">
              Book photography sessions, track booking status, view detailed transaction history & pay remaining balances seamlessly.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("my_bookings")}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-md ${
                activeTab === "my_bookings"
                  ? "bg-purple-600 text-white ring-2 ring-purple-400"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
              }`}
            >
              <FaList /> My Bookings ({totalBookingsCount})
            </button>
            <button
              onClick={() => setActiveTab("new_booking")}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-md ${
                activeTab === "new_booking"
                  ? "bg-purple-600 text-white ring-2 ring-purple-400"
                  : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
              }`}
            >
              <FaPlus /> Book New Shoot
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-6">
        {/* ======================================================== */}
        {/* TAB 1: MY BOOKINGS LIST */}
        {/* ======================================================== */}
        {activeTab === "my_bookings" && (
          <div className="space-y-8">
            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
                <div className="flex items-baseline justify-between mt-2">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-800">{totalBookingsCount}</h3>
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-600"><FaCalendarAlt /></span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Shoots</p>
                <div className="flex items-baseline justify-between mt-2">
                  <h3 className="text-2xl md:text-3xl font-black text-amber-600">{activeBookingsCount}</h3>
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><FaClock /></span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount Paid</p>
                <div className="flex items-baseline justify-between mt-2">
                  <h3 className="text-2xl md:text-3xl font-black text-emerald-600">
                    ₹{totalPaidSum.toLocaleString("en-IN")}
                  </h3>
                  <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><FaRupeeSign /></span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Balance</p>
                <div className="flex items-baseline justify-between mt-2">
                  <h3 className="text-2xl md:text-3xl font-black text-rose-600">
                    ₹{totalPendingSum.toLocaleString("en-IN")}
                  </h3>
                  <span className="p-2 rounded-xl bg-rose-50 text-rose-600"><FaCreditCard /></span>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      filterStatus === st
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search event or studio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto" />
                <p className="text-slate-500 text-sm mt-3 font-medium">Fetching your photoshoot bookings...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredBookings.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
                <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-4">
                  <FaCalendarAlt />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No Bookings Found</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto">
                  {searchQuery || filterStatus !== "All"
                    ? "No photoshoot bookings match your filter criteria."
                    : "You haven't booked any photoshoot events yet. Book your first event with our top studios!"}
                </p>
                <button
                  onClick={() => setActiveTab("new_booking")}
                  className="mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20 inline-flex items-center gap-2"
                >
                  <FaPlus /> Book Photoshoot Now
                </button>
              </div>
            )}

            {/* Bookings List Cards */}
            {!loading && filteredBookings.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBookings.map((b) => {
                  const totalPkg = b.totalAmount && b.totalAmount > 0 ? b.totalAmount : (b.serviceId?.price || 25000);
                  const paid = b.paidAmount || b.advanceAmount || 0;
                  const remaining = Math.max(0, totalPkg - paid);
                  const isFullyPaid = b.paymentStatus === "Paid" || remaining === 0;

                  return (
                    <div
                      key={b._id}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                    >
                      {/* Top Header Card */}
                      <div className="p-6">
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                            #{b._id ? b._id.substring(18).toUpperCase() : "BK"}
                          </span>
                          <div className="flex flex-wrap gap-1 justify-end">
                            {/* Status Badge */}
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                                b.status === "Confirmed"
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : b.status === "Completed"
                                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                                  : b.status === "Cancelled"
                                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                                  : "bg-amber-100 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {b.status}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                          {b.eventCategory?.name || b.eventType || "Event"}
                        </h3>

                        {/* Studio Info */}
                        <div className="mt-3 space-y-2 text-sm text-slate-600">
                          <div className="flex items-center gap-2">
                            <FaStore className="text-purple-600 text-xs shrink-0" />
                            <span className="font-semibold text-slate-800">
                              {b.adminId?.name || "Studio Partner"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-purple-600 text-xs shrink-0" />
                            <span>
                              {b.shootDate
                                ? new Date(b.shootDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-purple-600 text-xs shrink-0" />
                            <span className="truncate">{b.location || "Client Location"}</span>
                          </div>
                        </div>

                        {/* Payment Breakdown Box */}
                        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Total Package:</span>
                            <span className="font-bold text-slate-800">₹{totalPkg.toLocaleString("en-IN")}</span>
                          </div>

                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Paid Amount:</span>
                            <span className="font-bold text-emerald-600">₹{paid.toLocaleString("en-IN")}</span>
                          </div>

                          <div className="flex justify-between text-xs font-semibold pt-1 border-t border-slate-200">
                            <span>Remaining Balance:</span>
                            <span className={remaining > 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                              {remaining > 0 ? `₹${remaining.toLocaleString("en-IN")}` : "Fully Paid ✓"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer Actions */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => navigate(`/booking-details/${b._id}`)}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <FaInfoCircle /> Details & History
                        </button>

                        {remaining > 0 && b.status !== "Cancelled" && (
                          <button
                            onClick={() => {
                              setPayModalBooking(b);
                              setPayCustomAmount(remaining.toString());
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center gap-1 shadow-sm"
                          >
                            <FaCreditCard /> Pay Balance
                          </button>
                        )}

                        {b.status === "Pending" && (
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-all text-xs font-semibold"
                            title="Cancel Booking"
                          >
                            <FaTimesCircle className="text-base" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BOOK NEW SHOOT FORM */}
        {/* ======================================================== */}
        {activeTab === "new_booking" && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-10 max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                New Photoshoot
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2">Book Your Event Photography</h2>
              <p className="text-slate-500 text-sm mt-1">
                Select your preferred studio, enter event details, and reserve your photoshoot date.
              </p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {/* Studio Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">
                  Select Studio <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="adminId"
                    value={formData.adminId || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    required
                  >
                    {studiosLoading ? (
                      <option value="">Loading available studios...</option>
                    ) : Array.isArray(studios) && studios.length > 0 ? (
                      studios.map((s) => (
                        <option key={s._id} value={s.adminId || s._id}>
                          {s.studioName || s.name || "Studio Partner"} ({s.address || s.city || "Studio Location"})
                        </option>
                      ))
                    ) : (
                      <option value="">No studios available</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Event Type & Location */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Event / Shoot Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="eventCategory"
                    value={formData.eventCategory}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    required
                  >
                    <option value="">
                      {categoriesLoading ? "Loading event categories..." : "Select event category"}
                    </option>
                    {eventCategories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {!categoriesLoading && eventCategories.length === 0 && (
                    <p className="mt-1 text-xs text-rose-600">
                      No active event categories are available. Please contact the studio.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Shoot Location / Venue <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. City Palace, Udaipur or Home Venue"
                    value={formData.location || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Shoot Dates */}
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">
                    Shoot Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="shootDate"
                    value={formData.shootDate || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Shoot End Date (Optional)</label>
                  <input
                    type="date"
                    name="shootEndDate"
                    value={formData.shootEndDate || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Client Info */}
              <div className="grid md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Your Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail || ""}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Pricing & Budget */}
              <div className="grid md:grid-cols-2 gap-5 p-5 bg-purple-50/50 rounded-2xl border border-purple-100">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    Estimated Package Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    placeholder="25000"
                    value={formData.totalAmount || "25000"}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                {formData.paymentOption === "pay_now" && (
                  <div>
                    <label className="block text-sm font-bold text-slate-800 mb-1">Advance Payment Amount (₹)</label>
                    <input
                      type="number"
                      name="advanceAmount"
                      placeholder="2000"
                      value={formData.advanceAmount || "2000"}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm font-bold text-emerald-600 outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}
              </div>

              {/* Payment Option Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3">Payment Option</label>
                <div className="grid md:grid-cols-2 gap-4">
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      formData.paymentOption === "pay_now"
                        ? "border-purple-600 bg-purple-50/40 shadow-md"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      value="pay_now"
                      checked={formData.paymentOption === "pay_now"}
                      onChange={handleInputChange}
                      className="mt-1 accent-purple-600"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Pay Advance Now (Online Razorpay)</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Pay ₹{formData.advanceAmount || "2,000"} advance online via Razorpay for instant booking confirmation.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      formData.paymentOption === "pay_later"
                        ? "border-purple-600 bg-purple-50/40 shadow-md"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentOption"
                      value="pay_later"
                      checked={formData.paymentOption === "pay_later"}
                      onChange={handleInputChange}
                      className="mt-1 accent-purple-600"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Pay Later at Shoot</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Submit booking request now with ₹0 advance. Studio will confirm and collect payment later.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Special Requests / Notes</label>
                <textarea
                  name="notes"
                  rows="3"
                  placeholder="Mention any specific requirements, timing preferences, or theme notes..."
                  value={formData.notes || ""}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading || paymentLoading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-purple-600/20 text-base transition-all flex items-center justify-center gap-2"
                >
                  {loading || paymentLoading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Processing Booking...
                    </>
                  ) : formData.paymentOption === "pay_now" ? (
                    <>
                      <FaCreditCard /> Proceed to Pay ₹{formData.advanceAmount || "2,000"} & Confirm
                    </>
                  ) : (
                    <>
                      <FaCheckCircle /> Submit Booking Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* PAY BALANCE ONLINE MODAL */}
      {/* ======================================================== */}
      {payModalBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FaCreditCard className="text-emerald-600" /> Pay Remaining Balance
              </h3>
              <button
                onClick={() => setPayModalBooking(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="py-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Event:</span>
                  <span className="font-bold text-slate-800">
                    {payModalBooking.eventCategory?.name || payModalBooking.eventType || "Event"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Package:</span>
                  <span className="font-bold">
                    ₹
                    {(
                      payModalBooking.totalAmount && payModalBooking.totalAmount > 0
                        ? payModalBooking.totalAmount
                        : payModalBooking.serviceId?.price || 25000
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Already Paid:</span>
                  <span className="font-bold text-emerald-600">
                    ₹{(payModalBooking.paidAmount || payModalBooking.advanceAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <span className="text-slate-800">Remaining Due:</span>
                  <span className="text-rose-600">
                    ₹
                    {Math.max(
                      0,
                      (payModalBooking.totalAmount && payModalBooking.totalAmount > 0
                        ? payModalBooking.totalAmount
                        : payModalBooking.serviceId?.price || 25000) -
                        (payModalBooking.paidAmount || payModalBooking.advanceAmount || 0)
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Enter Payment Amount (₹)</label>
                <input
                  type="number"
                  value={payCustomAmount}
                  onChange={(e) => setPayCustomAmount(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter amount"
                />
              </div>

              <button
                onClick={() => handlePayBalanceOnline(payModalBooking)}
                disabled={paymentLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 text-sm transition-all flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Processing Payment...
                  </>
                ) : (
                  <>
                    <FaCreditCard /> Pay ₹{Number(payCustomAmount || 0).toLocaleString("en-IN")} Now via Razorpay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;