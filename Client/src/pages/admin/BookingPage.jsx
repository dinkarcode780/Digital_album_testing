import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getStudioBookings,
  getUserBookings,
  updateBookingStatus,
} from "../../app/booking/bookingThunk";

import {
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaSpinner,
  FaSync,
  FaCheckDouble,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTag,
} from "react-icons/fa";

const BookingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { studioBookings, bookings: userBookings, loading } = useSelector(
    (state) => state.booking
  );
  const { user } = useSelector((state) => state.auth);
  const { admin } = useSelector((state) => state.admin);

  const currentUser = admin || user;
  const isUserRole = currentUser?.userType === "User";

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch bookings on mount
  useEffect(() => {
    if (isUserRole) {
      dispatch(getUserBookings());
    } else {
      dispatch(getStudioBookings());
    }
  }, [dispatch, isUserRole]);

  // Combine or fallback bookings from Redux state
  const rawBookings =
    studioBookings && studioBookings.length > 0
      ? studioBookings
      : userBookings && userBookings.length > 0
      ? userBookings
      : [];

  const handleRefresh = () => {
    dispatch(getStudioBookings());
    if (isUserRole) {
      dispatch(getUserBookings());
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    setActionLoadingId(bookingId);
    try {
      const result = await dispatch(
        updateBookingStatus({
          bookingId,
          data: { status: newStatus },
        })
      );

      if (updateBookingStatus.fulfilled.match(result)) {
        toast.success(`Booking status changed to ${newStatus}`);
        handleRefresh();
      } else {
        toast.error(result.payload?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter & Search Logic
  const filteredBookings = (rawBookings || []).filter((b) => {
    const matchesFilter =
      activeFilter === "All" ||
      b.status?.toLowerCase() === activeFilter.toLowerCase();

    const clientName = b.clientName || b.userId?.name || "";
    const clientPhone = b.clientPhone || b.userId?.phoneNumber || "";
    const eventType = b.eventCategory?.name || b.eventType || "";
    const location = b.location || "";
    const bookingIdStr = b._id || "";

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      clientName.toLowerCase().includes(searchLower) ||
      clientPhone.toLowerCase().includes(searchLower) ||
      eventType.toLowerCase().includes(searchLower) ||
      location.toLowerCase().includes(searchLower) ||
      bookingIdStr.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-8 p-2 md:p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Booking Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isUserRole
              ? "View and manage your photoshoot requests."
              : "Manage all customer photoshoot requests and updates."}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
            title="Refresh bookings"
          >
            <FaSync className={`text-xs ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <div className="relative flex-1 md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone, event..."
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 outline-none text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
          (filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeFilter === filter
                  ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter}
            </button>
          )
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && (rawBookings || []).length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <FaSpinner className="animate-spin text-3xl text-purple-600 mb-3" />
            <p className="text-sm font-medium text-gray-500">
              Loading bookings...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mb-3 text-2xl">
              <FaCalendarAlt />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              No Bookings Found
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              {searchTerm || activeFilter !== "All"
                ? "No booking matching your search/filter parameters."
                : "No booking requests have been recorded yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Shoot Date</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-700">
                {filteredBookings.map((booking) => {
                  const clientName =
                    booking.clientName || booking.userId?.name || "Client";
                  const clientPhone =
                    booking.clientPhone ||
                    booking.userId?.phoneNumber ||
                    "N/A";
                  const shootDateStr = booking.shootDate
                    ? new Date(booking.shootDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A";

                  const displayId =
                    booking.transactionId ||
                    `BK-${booking._id?.substring(0, 6).toUpperCase()}`;

                  const isProcessing = actionLoadingId === booking._id;

                  return (
                    <tr
                      key={booking._id}
                      className="hover:bg-purple-50/30 transition-colors"
                    >
                      {/* Booking ID */}
                      <td className="p-4">
                        <span className="font-bold text-purple-700 font-mono text-xs bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                          {displayId}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-4 font-semibold text-gray-800">
                        {clientName}
                      </td>

                      {/* Phone */}
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <FaPhoneAlt className="text-xs text-purple-500" />
                          {clientPhone}
                        </div>
                      </td>

                      {/* Event */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-800">
                          <FaTag className="text-xs text-purple-500" />
                          {booking.eventCategory?.name || booking.eventType || "Event"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <FaCalendarAlt className="text-purple-600 text-xs" />
                          {shootDateStr}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="p-4 text-gray-600 max-w-[160px] truncate">
                        <div className="flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs text-purple-500 shrink-0" />
                          <span className="truncate">{booking.location || "N/A"}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status || "Pending"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* View Details */}
                          <button
                            onClick={() =>
                              navigate(
                                isUserRole
                                  ? `/booking-details/${booking._id}`
                                  : `/admin/bookings/${booking._id}`
                              )
                            }
                            className="p-2.5 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition shadow-sm"
                            title="View Details"
                          >
                            <FaEye />
                          </button>

                          {!isUserRole && (
                            <>
                              {/* Confirm */}
                              {booking.status !== "Confirmed" &&
                                booking.status !== "Completed" && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(booking._id, "Confirmed")
                                    }
                                    disabled={isProcessing}
                                    className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition shadow-sm disabled:opacity-50"
                                    title="Confirm Booking"
                                  >
                                    {isProcessing ? (
                                      <FaSpinner className="animate-spin text-xs" />
                                    ) : (
                                      <FaCheckCircle />
                                    )}
                                  </button>
                                )}

                              {/* Complete */}
                              {booking.status === "Confirmed" && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking._id, "Completed")
                                  }
                                  disabled={isProcessing}
                                  className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition shadow-sm disabled:opacity-50"
                                  title="Mark as Completed"
                                >
                                  {isProcessing ? (
                                    <FaSpinner className="animate-spin text-xs" />
                                  ) : (
                                    <FaCheckDouble />
                                  )}
                                </button>
                              )}

                              {/* Cancel */}
                              {booking.status !== "Cancelled" &&
                                booking.status !== "Completed" && (
                                  <button
                                    onClick={() =>
                                      handleStatusChange(booking._id, "Cancelled")
                                    }
                                    disabled={isProcessing}
                                    className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition shadow-sm disabled:opacity-50"
                                    title="Cancel Booking"
                                  >
                                    {isProcessing ? (
                                      <FaSpinner className="animate-spin text-xs" />
                                    ) : (
                                      <FaTimesCircle />
                                    )}
                                  </button>
                                )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;