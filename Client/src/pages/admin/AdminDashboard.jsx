import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  FaUsers,
  FaCalendarCheck,
  FaImages,
  FaRupeeSign,
  FaClock,
  FaCheckCircle,
  FaCamera,
  FaArrowRight,
  FaPhotoVideo,
  FaUserFriends,
  FaSpinner,
  FaCheckDouble,
} from "react-icons/fa";

import { getUserByFilter } from "../../app/auth/authThunk";
import { getMediaByFilter } from "../../app/media/mediaThunk";
import { getStudioBookings } from "../../app/booking/bookingThunk";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admin } = useSelector((state) => state.admin);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAlbums: 0,
    totalImages: 0,
    totalVideos: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [showAlbumDetails, setShowAlbumDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      setLoading(true);
      try {
        const usersResult = await dispatch(
          getUserByFilter({
            page: 1,
            limit: "All",
          })
        ).unwrap();

        const albumsResult = await dispatch(
          getMediaByFilter({
            page: 1,
            limit: "All",
          })
        ).unwrap();

        const imagesResult = await dispatch(
          getMediaByFilter({
            page: 1,
            limit: "All",
            mediaType: "Image",
          })
        ).unwrap();

        const videosResult = await dispatch(
          getMediaByFilter({
            page: 1,
            limit: "All",
            mediaType: "Video",
          })
        ).unwrap();

        let bookingsList = [];
        try {
          const bookingsResult = await dispatch(getStudioBookings()).unwrap();
          bookingsList = bookingsResult?.data || bookingsResult || [];
        } catch (bErr) {
          console.warn("Bookings fetch warning:", bErr);
        }

        const pending = bookingsList.filter(
          (b) => b.status?.toLowerCase() === "pending"
        ).length;
        const confirmed = bookingsList.filter(
          (b) => b.status?.toLowerCase() === "confirmed"
        ).length;
        const completed = bookingsList.filter(
          (b) => b.status?.toLowerCase() === "completed"
        ).length;

        const revenue = bookingsList.reduce(
          (sum, b) =>
            sum + (Number(b.paidAmount) || Number(b.advanceAmount) || 0),
          0
        );

        setStats({
          totalUsers: usersResult.totalUsers || 0,
          totalAlbums: albumsResult.totalRecords || 0,
          totalImages: imagesResult.totalRecords || 0,
          totalVideos: videosResult.totalRecords || 0,
          totalBookings: bookingsList.length,
          pendingBookings: pending,
          confirmedBookings: confirmed,
          completedBookings: completed,
          totalRevenue: revenue,
        });

        setRecentBookings(bookingsList.slice(0, 5));
      } catch (error) {
        console.error("Dashboard stats fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCounts();
  }, [dispatch]);

  const formatRevenue = (amount) => {
    if (!amount || amount === 0) return "₹0";
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const cardData = [
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers,
      icon: <FaUsers />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      accent: "from-blue-500 to-cyan-500",
      path: "/admin/users",
      description: "Registered clients",
    },
    {
      title: "Bookings",
      value: loading ? "..." : stats.totalBookings,
      icon: <FaCalendarCheck />,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      accent: "from-emerald-500 to-teal-500",
      path: "/admin/bookings",
      description: "Total reservations",
    },
    {
      title: "Albums",
      value: loading ? "..." : stats.totalAlbums,
      icon: <FaImages />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      accent: "from-purple-500 to-fuchsia-500",
      path: "/admin/albums",
      hasDropdown: true,
      description: "Created albums",
    },
    {
      title: "Revenue",
      value: loading ? "..." : formatRevenue(stats.totalRevenue),
      icon: <FaRupeeSign />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      accent: "from-amber-400 to-orange-500",
      description: "Total collected revenue",
    },
  ];

  const pendingPercent =
    stats.totalBookings > 0
      ? Math.round((stats.pendingBookings / stats.totalBookings) * 100)
      : 0;
  const confirmedPercent =
    stats.totalBookings > 0
      ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100)
      : 0;

  return (
    <div className="dashboard-page relative space-y-8 pb-8">
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="dashboard-pulse absolute -left-32 top-20 h-80 w-80 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="dashboard-pulse absolute right-0 top-80 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />
      </div>

      {/* HERO SECTION */}
      <section className="dashboard-item dashboard-shimmer relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#7c3aed] px-6 py-8 text-white shadow-[0_20px_60px_rgba(109,40,217,0.25)] sm:px-8 lg:px-10">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[35px] border-white/10" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
              <FaCamera />
              Album Studio Admin Panel
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Welcome To {admin?.name || "Admin"} 👋
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100 sm:text-base">
              Manage your clients, bookings, events and memories live from your admin dashboard.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/admin/users")}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-purple-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <FaUserFriends />
                Manage Users
                <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate("/admin/bookings")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
              >
                <FaCalendarCheck />
                Manage Bookings
              </button>
            </div>
          </div>

          <div className="dashboard-float hidden h-36 w-36 items-center justify-center rounded-[35px] border border-white/20 bg-white/10 text-7xl shadow-2xl backdrop-blur-md lg:flex">
            📸
          </div>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((item, index) => (
          <div
            key={item.title}
            onClick={() => item.path && navigate(item.path)}
            style={{ animationDelay: `${index * 100}ms` }}
            className={`dashboard-item dashboard-card group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${
              item.path ? "cursor-pointer hover:bg-gray-50/50" : ""
            }`}
          >
            <div
              className={`absolute left-0 right-0 top-0 h-1 bg-gradient-to-r ${item.accent}`}
            />

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  {item.title}
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-800">
                  {item.value}
                </h2>

                <p className="mt-2 text-xs text-gray-400">
                  {item.description}
                </p>
              </div>

              <div
                className={`dashboard-icon flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm ${item.iconBg} ${item.iconColor}`}
              >
                {item.icon}
              </div>
            </div>

            {item.hasDropdown && (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAlbumDetails((prev) => !prev);
                  }}
                  className="flex w-full items-center justify-between rounded-xl bg-purple-50 px-4 py-3 text-sm font-bold text-purple-600 transition hover:bg-purple-100"
                >
                  <span>
                    {showAlbumDetails
                      ? "Hide details"
                      : "View album details"}
                  </span>
                  <FaArrowRight
                    className={`transition-transform duration-300 ${
                      showAlbumDetails ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {showAlbumDetails && (
                  <div className="mt-3 space-y-3 rounded-2xl border border-purple-100 bg-purple-50/70 p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-gray-600">
                        <FaImages className="text-purple-500" />
                        Images
                      </span>
                      <strong className="text-gray-800">
                        {stats.totalImages}
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-gray-600">
                        <FaPhotoVideo className="text-pink-500" />
                        Videos
                      </span>
                      <strong className="text-gray-800">
                        {stats.totalVideos}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="grid gap-8 lg:grid-cols-3">
        {/* RECENT BOOKINGS */}
        <div className="dashboard-item overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <FaCalendarCheck />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">
                  Recent Bookings
                </h2>
                <p className="text-xs text-gray-400">
                  Latest photoshoot requests
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/bookings")}
              className="group flex items-center gap-2 self-start rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-bold text-purple-600 transition-all duration-300 hover:bg-purple-600 hover:text-white"
            >
              View All
              <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <FaSpinner className="animate-spin text-2xl text-purple-600" />
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm font-medium">
                No recent bookings recorded yet.
              </div>
            ) : (
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                      Booking ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                      Event
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => {
                    const clientName =
                      booking.clientName || booking.userId?.name || "Client";
                    const bookingId =
                      booking.transactionId ||
                      `BK-${booking._id?.substring(0, 6).toUpperCase()}`;
                    const shootDateStr = booking.shootDate
                      ? new Date(booking.shootDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "N/A";

                    return (
                      <tr
                        key={booking._id}
                        className="dashboard-row border-b border-gray-50 hover:bg-purple-50/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-purple-50 px-2.5 py-1.5 text-xs font-mono font-bold text-purple-700">
                            {bookingId}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-xs font-bold text-white uppercase">
                              {clientName.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-800">
                              {clientName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                          {booking.eventCategory?.name || booking.eventType || "Event"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {shootDateStr}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ${
                              booking.status === "Confirmed"
                                ? "bg-emerald-100 text-emerald-700"
                                : booking.status === "Completed"
                                ? "bg-blue-100 text-blue-700"
                                : booking.status === "Cancelled"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {booking.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT SIDE WIDGETS */}
        <div className="space-y-6">
          {/* Today's Events / Recent Shoots */}
          <div className="dashboard-item rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                <FaCamera />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">
                  Upcoming Events
                </h2>
                <p className="text-xs text-gray-400">Scheduled shoots</p>
              </div>
            </div>

            <div className="space-y-3">
              {recentBookings.length === 0 ? (
                <div className="text-xs text-gray-400 italic py-2">
                  No upcoming events scheduled.
                </div>
              ) : (
                recentBookings.slice(0, 4).map((b, index) => (
                  <div
                    key={b._id || index}
                    className="dashboard-event flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/70 p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <FaCamera />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-700">
                        {b.eventCategory?.name || b.eventType || "Photoshoot"} - {b.location || "Studio"}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        Client: {b.clientName || "User"}
                      </p>
                    </div>
                    <FaArrowRight className="text-xs text-gray-300" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* BOOKING STATUS SUMMARY */}
          <div className="dashboard-item rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <FaCalendarCheck />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-gray-800">
                  Booking Status
                </h2>
                <p className="text-xs text-gray-400">Live booking status breakdown</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Pending */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FaClock className="text-yellow-500" />
                    Pending
                  </span>
                  <strong className="text-gray-800">
                    {stats.pendingBookings}
                  </strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    style={{ width: `${pendingPercent}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Confirmed */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FaCheckCircle className="text-emerald-500" />
                    Confirmed
                  </span>
                  <strong className="text-gray-800">
                    {stats.confirmedBookings}
                  </strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    style={{ width: `${confirmedPercent}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Completed */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                    <FaCheckDouble className="text-blue-500" />
                    Completed
                  </span>
                  <strong className="text-gray-800">
                    {stats.completedBookings}
                  </strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    style={{ width: `${stats.totalBookings > 0 ? Math.round((stats.completedBookings / stats.totalBookings) * 100) : 0}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Total Active Summary */}
            <div className="mt-6 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400">
                    Total Bookings
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-purple-700">
                    {stats.totalBookings}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                  <FaCalendarCheck />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;