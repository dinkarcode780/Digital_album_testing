import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaHeart,
  FaImages,
  FaImage,
  FaVideo,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaLock,
  FaUnlock,
  FaDownload,
  FaSpinner,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCommentAlt,
  FaTimes,
  FaExternalLinkAlt,
  FaCheck,
  FaSyncAlt,
} from "react-icons/fa";
import Pagination from "../../components/common/Pagination";
import {
  getAllUserSelectedMedia,
  updateSelectionStatus,
  deleteUserSelectedMedia,
} from "../../app/slectedmedia/slectedmediaThunk";
import { getAllEventByFilter } from "../../app/event/eventThunk";
import { downloadDirectMedia } from "../../utils/downloadHelper";

const AdminFavorites = () => {
  const dispatch = useDispatch();

  const {
    adminSelections = [],
    pagination = {},
    loading,
  } = useSelector((state) => state.slectedmedia);

  const { events = [] } = useSelector((state) => state.event);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");
  const [lockFilter, setLockFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal states
  const [detailModalItem, setDetailModalItem] = useState(null);
  const [editModalItem, setEditModalItem] = useState(null);
  const [lightboxMedia, setLightboxMedia] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    status: "Pending",
    adminNotes: "",
    isLocked: false,
  });
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Selections & Events
  const fetchSelections = () => {
    const params = {
      page,
      limit,
    };
    if (statusFilter !== "All") params.status = statusFilter;
    if (eventFilter !== "All") params.eventId = eventFilter;

    dispatch(getAllUserSelectedMedia(params));
  };

  useEffect(() => {
    fetchSelections();
  }, [dispatch, page, limit, statusFilter, eventFilter]);

  useEffect(() => {
    dispatch(
      getAllEventByFilter({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  // Client-side search and lock filter
  const filteredSelections = useMemo(() => {
    return (adminSelections || []).filter((item) => {
      // Lock filter
      if (lockFilter === "Locked" && !item.isLocked) return false;
      if (lockFilter === "Unlocked" && item.isLocked) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const userName = item.userId?.name?.toLowerCase() || "";
        const userEmail = item.userId?.email?.toLowerCase() || "";
        const userPhone = String(item.userId?.phoneNumber || "");
        const bride = item.eventId?.brideName?.toLowerCase() || "";
        const groom = item.eventId?.groomName?.toLowerCase() || "";
        const loc = item.eventId?.location?.toLowerCase() || "";
        const subCat = item.eventId?.eventSubCategoryId?.name?.toLowerCase() || "";
        const notes = item.adminNotes?.toLowerCase() || "";

        return (
          userName.includes(q) ||
          userEmail.includes(q) ||
          userPhone.includes(q) ||
          bride.includes(q) ||
          groom.includes(q) ||
          loc.includes(q) ||
          subCat.includes(q) ||
          notes.includes(q)
        );
      }
      return true;
    });
  }, [adminSelections, lockFilter, search]);

  // Stats Calculations
  const stats = useMemo(() => {
    const list = adminSelections || [];
    const totalSelections = pagination.totalRecords || list.length;
    const pending = list.filter((s) => s.status === "Pending").length;
    const approved = list.filter((s) => s.status === "Approved").length;
    const totalPhotos = list.reduce(
      (sum, s) =>
        sum +
        (s.selectedMedia || []).filter(
          (m) => m.mediaId?.videosOrImageUrlType === "Image" || !m.mediaId?.videosOrImageUrlType
        ).length,
      0
    );
    const totalVideos = list.reduce(
      (sum, s) =>
        sum +
        (s.selectedMedia || []).filter(
          (m) => m.mediaId?.videosOrImageUrlType === "Video"
        ).length,
      0
    );

    return { totalSelections, pending, approved, totalPhotos, totalVideos };
  }, [adminSelections, pagination]);

  // Open Edit Modal
  const handleOpenEdit = (item) => {
    setEditModalItem(item);
    setEditForm({
      status: item.status || "Pending",
      adminNotes: item.adminNotes || "",
      isLocked: Boolean(item.isLocked),
    });
  };

  // Submit Status Update
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!editModalItem?._id) return;

    try {
      setUpdating(true);
      const res = await dispatch(
        updateSelectionStatus({
          selectionId: editModalItem._id,
          status: editForm.status,
          adminNotes: editForm.adminNotes,
          isLocked: editForm.isLocked,
        })
      ).unwrap();

      if (res.success) {
        toast.success("Selection status updated successfully!");
        setEditModalItem(null);
        // If details modal is open with same item, sync it
        if (detailModalItem?._id === editModalItem._id) {
          setDetailModalItem(res.data);
        }
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  // Delete Selection
  const handleDeleteSelection = async (selectionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user selection record? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(selectionId);
      const res = await dispatch(deleteUserSelectedMedia(selectionId)).unwrap();
      if (res.success) {
        toast.success("User selection deleted successfully!");
        if (detailModalItem?._id === selectionId) {
          setDetailModalItem(null);
        }
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete selection");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper for Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
            <FaCheckCircle className="text-xs" /> Approved
          </span>
        );
      case "Reviewed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <FaClock className="text-xs" /> Reviewed
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <FaTimesCircle className="text-xs" /> Rejected
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
            <FaClock className="text-xs" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen">
      {/* Page Title & Refresh */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="p-2.5 bg-red-100 text-red-500 rounded-xl">
              <FaHeart />
            </span>
            User Selected Media & Favorites
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage, review, and approve photos and videos selected by users for album printing & delivery
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSelections}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition shadow-sm"
          >
            <FaSyncAlt className={loading ? "animate-spin text-purple-600" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Total Submissions
            </p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {stats.totalSelections}
            </h3>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-xl">
            <FaImages />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Pending Review
            </p>
            <h3 className="text-2xl font-bold text-yellow-600 mt-1">
              {stats.pending}
            </h3>
          </div>
          <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center text-xl">
            <FaClock />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Approved
            </p>
            <h3 className="text-2xl font-bold text-green-600 mt-1">
              {stats.approved}
            </h3>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">
            <FaCheckCircle />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Selected Media Count
            </p>
            <h3 className="text-2xl font-bold text-purple-600 mt-1">
              {stats.totalPhotos + stats.totalVideos}
            </h3>
            <span className="text-xs text-gray-400">
              {stats.totalPhotos} Photos • {stats.totalVideos} Videos
            </span>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center text-xl">
            <FaHeart />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user, email, event, location..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-gray-700"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Event Filter */}
          <div>
            <select
              value={eventFilter}
              onChange={(e) => {
                setEventFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-gray-700"
            >
              <option value="All">All Events</option>
              {(events || []).map((ev) => {
                const title =
                  [ev.brideName, ev.groomName].filter(Boolean).join(" & ") ||
                  ev.eventSubCategoryId?.name ||
                  ev.location ||
                  `Event #${ev._id.slice(-4)}`;
                return (
                  <option key={ev._id} value={ev._id}>
                    {title}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Lock Filter */}
          <div>
            <select
              value={lockFilter}
              onChange={(e) => setLockFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white text-gray-700"
            >
              <option value="All">All Submissions</option>
              <option value="Locked">Locked / Submitted Only</option>
              <option value="Unlocked">In Progress Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-purple-600">
            <FaSpinner className="animate-spin text-4xl mb-3" />
            <p className="text-gray-500 font-medium">Loading user selections...</p>
          </div>
        ) : filteredSelections.length === 0 ? (
          <div className="text-center py-20 px-4">
            <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              <FaHeart />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              No User Selections Found
            </h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              {search || statusFilter !== "All" || eventFilter !== "All"
                ? "Try adjusting your search query or filters to find selections."
                : "When users select photos or videos in their albums, their selections will appear here for your review."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-4 px-5">User</th>
                  <th className="py-4 px-5">Event & Album</th>
                  <th className="py-4 px-5">Selected Items</th>
                  <th className="py-4 px-5">Lock Status</th>
                  <th className="py-4 px-5">Approval Status</th>
                  <th className="py-4 px-5">Updated At</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredSelections.map((item) => {
                  const user = item.userId || {};
                  const event = item.eventId || {};
                  const eventTitle =
                    [event.brideName, event.groomName]
                      .filter(Boolean)
                      .join(" & ") ||
                    event.eventSubCategoryId?.name ||
                    event.location ||
                    "Album Event";

                  const selectedCount = item.selectedMedia?.length || 0;
                  const photoCount = (item.selectedMedia || []).filter(
                    (m) =>
                      m.mediaId?.videosOrImageUrlType === "Image" ||
                      !m.mediaId?.videosOrImageUrlType
                  ).length;
                  const videoCount = (item.selectedMedia || []).filter(
                    (m) => m.mediaId?.videosOrImageUrlType === "Video"
                  ).length;

                  // Preview up to 3 thumbnails
                  const thumbnails = (item.selectedMedia || [])
                    .slice(0, 3)
                    .map((m) => m.mediaId?.thumbnail || m.mediaId?.videosOrImageUrl)
                    .filter(Boolean);

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-purple-50/30 transition duration-150"
                    >
                      {/* User Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.profileImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                user.name || "User"
                              )}&background=8b5cf6&color=fff`
                            }
                            alt={user.name || "User"}
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {user.name || "Anonymous User"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {user.email || user.phoneNumber || "No contact"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Event Info */}
                      <td className="py-4 px-5">
                        <div>
                          <p className="font-medium text-gray-800">
                            {eventTitle}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-red-400 text-[10px]" />
                                {event.location}
                              </span>
                            )}
                            {event.eventDate && (
                              <span>
                                •{" "}
                                {new Date(event.eventDate).toLocaleDateString(
                                  "en-GB",
                                  { day: "numeric", month: "short", year: "numeric" }
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Selected Media Count & Thumbnail Preview */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2 overflow-hidden">
                            {thumbnails.map((thumb, i) => (
                              <img
                                key={i}
                                src={thumb}
                                alt="Thumb"
                                className="inline-block h-8 w-8 rounded-lg object-cover ring-2 ring-white"
                              />
                            ))}
                          </div>
                          <div>
                            <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md text-xs">
                              {selectedCount} Selected
                            </span>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {photoCount} Photos, {videoCount} Videos
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Lock Status */}
                      <td className="py-4 px-5">
                        {item.isLocked ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-full border border-purple-200">
                            <FaLock className="text-[10px]" /> Submitted & Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            <FaUnlock className="text-[10px]" /> In Progress
                          </span>
                        )}
                      </td>

                      {/* Approval Status */}
                      <td className="py-4 px-5">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-xs text-gray-500">
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Details Button */}
                          <button
                            type="button"
                            onClick={() => setDetailModalItem(item)}
                            title="View Selected Photos & Details"
                            className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-xl transition"
                          >
                            <FaEye className="text-sm" />
                          </button>

                          {/* Edit Status Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Update Status / Notes"
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition"
                          >
                            <FaEdit className="text-sm" />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            disabled={deletingId === item._id}
                            onClick={() => handleDeleteSelection(item._id)}
                            title="Delete Selection"
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition disabled:opacity-50"
                          >
                            {deletingId === item._id ? (
                              <FaSpinner className="animate-spin text-sm" />
                            ) : (
                              <FaTrash className="text-sm" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <p className="text-xs text-gray-500">
              Showing page <strong>{pagination.currentPage || page}</strong> of{" "}
              <strong>{pagination.totalPages}</strong> (
              {pagination.totalRecords} total records)
            </p>
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* ================= MODAL 1: DETAILS & SELECTED MEDIA VIEWER ================= */}
      {detailModalItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setDetailModalItem(null)}
        >
          <div
            className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-xl">
                  <FaHeart />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Selection Details & Gallery
                  </h2>
                  <p className="text-xs text-gray-500">
                    Submitted by{" "}
                    <strong>{detailModalItem.userId?.name || "User"}</strong> for{" "}
                    <strong>
                      {[
                        detailModalItem.eventId?.brideName,
                        detailModalItem.eventId?.groomName,
                      ]
                        .filter(Boolean)
                        .join(" & ") || "Album Event"}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(detailModalItem.status)}
                <button
                  onClick={() => setDetailModalItem(null)}
                  className="p-2.5 text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-full transition shadow-sm"
                >
                  <FaTimes className="text-base" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* User & Event Info Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-sm">
                <div>
                  <p className="text-xs text-purple-600 font-semibold uppercase">
                    User Contact
                  </p>
                  <p className="font-bold text-gray-800 mt-1">
                    {detailModalItem.userId?.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {detailModalItem.userId?.email || "No email"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {detailModalItem.userId?.phoneNumber || "No phone"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-purple-600 font-semibold uppercase">
                    Event Details
                  </p>
                  <p className="font-bold text-gray-800 mt-1">
                    {detailModalItem.eventId?.location || "No Location"}
                  </p>
                  <p className="text-xs text-gray-600">
                    {detailModalItem.eventId?.eventDate
                      ? new Date(
                          detailModalItem.eventId.eventDate
                        ).toLocaleDateString()
                      : "No date"}
                  </p>
                  <p className="text-xs text-gray-600">
                    SubCategory:{" "}
                    {detailModalItem.eventId?.eventSubCategoryId?.name || "General"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-purple-600 font-semibold uppercase">
                    Submission Status
                  </p>
                  <p className="font-bold text-gray-800 mt-1">
                    {detailModalItem.isLocked
                      ? "Locked & Submitted"
                      : "In Progress (Unlocked)"}
                  </p>
                  {detailModalItem.submittedAt && (
                    <p className="text-xs text-gray-600">
                      Submitted:{" "}
                      {new Date(
                        detailModalItem.submittedAt
                      ).toLocaleDateString()}
                    </p>
                  )}
                  {detailModalItem.adminNotes && (
                    <p className="text-xs text-purple-700 bg-white p-2 rounded-lg mt-1 border border-purple-200 italic">
                      Note: "{detailModalItem.adminNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Media Gallery Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaImages className="text-purple-600" />
                    Selected Photos & Videos (
                    {detailModalItem.selectedMedia?.length || 0})
                  </h3>

                  <button
                    onClick={() => handleOpenEdit(detailModalItem)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition shadow-md"
                  >
                    <FaEdit /> Update Status / Notes
                  </button>
                </div>

                {(!detailModalItem.selectedMedia ||
                  detailModalItem.selectedMedia.length === 0) ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border">
                    <p className="text-gray-500">No media items selected.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {detailModalItem.selectedMedia.map((mItem, index) => {
                      const media = mItem.mediaId || {};
                      const isVid = media.videosOrImageUrlType === "Video";
                      const mediaUrl =
                        media.videosOrImageUrl || media.thumbnail;

                      return (
                        <div
                          key={media._id || index}
                          className="group relative bg-black rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col"
                        >
                          <div className="relative h-44 bg-black flex items-center justify-center overflow-hidden">
                            {isVid ? (
                              <video
                                src={mediaUrl}
                                className="w-full h-44 object-cover"
                              />
                            ) : (
                              <img
                                src={mediaUrl}
                                alt="Selected Media"
                                className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                              />
                            )}

                            {/* Badge */}
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                              {isVid ? <FaVideo /> : <FaImage />}
                              {isVid ? "Video" : "Photo"}
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setLightboxMedia({
                                    url: media.videosOrImageUrl,
                                    type: media.videosOrImageUrlType,
                                    comment: mItem.comment,
                                  })
                                }
                                title="Zoom Full Preview"
                                className="p-2.5 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg transition transform hover:scale-110"
                              >
                                <FaEye className="text-sm" />
                              </button>

                              {media.videosOrImageUrl && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    downloadDirectMedia(
                                      media.videosOrImageUrl,
                                      `selected_media_${media._id?.slice(-4)}`
                                    )
                                  }
                                  title="Download Original"
                                  className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg transition transform hover:scale-110 cursor-pointer"
                                >
                                  <FaDownload className="text-sm" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Comment if any */}
                          {mItem.comment && (
                            <div className="p-2.5 bg-white text-xs text-gray-700 border-t border-gray-100 flex items-start gap-1.5">
                              <FaCommentAlt className="text-purple-500 text-[10px] mt-0.5 flex-shrink-0" />
                              <p className="line-clamp-2 italic">
                                "{mItem.comment}"
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl text-sm font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: EDIT STATUS & ADMIN NOTES ================= */}
      {editModalItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditModalItem(null)}
        >
          <div
            className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaEdit className="text-purple-600" />
                Update Selection Status
              </h3>
              <button
                onClick={() => setEditModalItem(null)}
                className="text-gray-400 hover:text-gray-700 p-2 rounded-full"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateStatus} className="p-6 space-y-5">
              {/* Status Select */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Approval Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
                >
                  <option value="Pending">Pending (Under Review)</option>
                  <option value="Reviewed">Reviewed (Checked by Staff)</option>
                  <option value="Approved">Approved (Ready for Album Print)</option>
                  <option value="Rejected">Rejected (Requires User Re-selection)</option>
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Admin Notes / Instructions
                </label>
                <textarea
                  rows="4"
                  value={editForm.adminNotes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, adminNotes: e.target.value })
                  }
                  placeholder="e.g. Sent 45 photos to printing lab on 26 Aug. Delivery expected next Tuesday..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white resize-none"
                />
              </div>

              {/* Lock / Unlock Toggle */}
              <div className="flex items-center justify-between p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                <div>
                  <p className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                    {editForm.isLocked ? (
                      <FaLock className="text-purple-600" />
                    ) : (
                      <FaUnlock className="text-gray-500" />
                    )}
                    Lock Selection
                  </p>
                  <p className="text-xs text-gray-500">
                    When locked, user cannot change or unselect photos
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editForm.isLocked}
                  onChange={(e) =>
                    setEditForm({ ...editForm, isLocked: e.target.checked })
                  }
                  className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition shadow-md disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <FaSpinner className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: FULLSCREEN LIGHTBOX PREVIEW ================= */}
      {lightboxMedia && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          onClick={() => setLightboxMedia(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxMedia(null)}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white p-3 rounded-full z-10 transition"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="flex items-center justify-center min-h-[300px] max-h-[75vh] bg-black">
              {lightboxMedia.type === "Video" ? (
                <video
                  src={lightboxMedia.url}
                  controls
                  autoPlay
                  className="max-h-[75vh] max-w-full object-contain"
                />
              ) : (
                <img
                  src={lightboxMedia.url}
                  alt="Full preview"
                  className="max-h-[75vh] max-w-full object-contain"
                />
              )}
            </div>

            {lightboxMedia.comment && (
              <div className="p-4 bg-neutral-900 text-white text-xs border-t border-neutral-800">
                <span className="text-purple-400 font-bold">User Comment:</span>{" "}
                "{lightboxMedia.comment}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFavorites;