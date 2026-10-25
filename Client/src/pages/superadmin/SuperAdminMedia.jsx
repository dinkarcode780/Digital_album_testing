import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";
import {
  FaSearch,
  FaFilter,
  FaPhotoVideo,
  FaImages,
  FaVideo,
  FaTrash,
  FaEye,
  FaDownload,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaPlus,
  FaUserTie,
  FaCalendarAlt,
  FaUser,
  FaPlay,
  FaCheckCircle,
  FaLock,
  FaUnlock,
  FaCloudUploadAlt,
} from "react-icons/fa";

function SuperAdminMedia() {
  const [mediaList, setMediaList] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState("All");
  const [mediaTypeFilter, setMediaTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals
  const [previewMedia, setPreviewMedia] = useState(null);
  const [deleteConfirmMedia, setDeleteConfirmMedia] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form
  const [uploadEventId, setUploadEventId] = useState("");
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadThumbnail, setUploadThumbnail] = useState(null);

  // Load all initial metadata
  const fetchData = async () => {
    try {
      setLoading(true);
      const [mediaRes, adminsRes, clientsRes, eventsRes] = await Promise.all([
        axiosInstance.get("/admin/getMediaByFilter", { params: { limit: 200 } }),
        axiosInstance.get("/admin/getAllAdmins"),
        axiosInstance.get("/users/getUserByFilter", { params: { userType: "User", limit: "All" } }),
        axiosInstance.get("/admin/getEventByFilter", { params: { limit: 100 } }),
      ]);

      setMediaList(mediaRes.data?.data || []);
      setAdmins(adminsRes.data?.data || []);
      setClients(clientsRes.data?.data || []);
      setEvents(eventsRes.data?.data || []);
    } catch (error) {
      console.error("Super Admin Media load error:", error);
      toast.error(error.response?.data?.message || "Failed to load media assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper to reliably resolve event, client, and assigned admin for any media item
  const getMediaAssignmentDetails = (item) => {
    const eventObj =
      typeof item.eventId === "object" && item.eventId !== null
        ? item.eventId
        : events.find((e) => String(e._id) === String(item.eventId));

    const rawUserId =
      typeof eventObj?.userId === "object" && eventObj?.userId !== null
        ? eventObj.userId?._id
        : eventObj?.userId;

    const clientObj =
      clients.find((c) => String(c._id) === String(rawUserId)) ||
      (typeof eventObj?.userId === "object" ? eventObj.userId : null);

    const rawAdmin =
      clientObj?.ownerAdminId ||
      (typeof eventObj?.userId === "object" ? eventObj?.userId?.ownerAdminId : null);

    const adminId =
      typeof rawAdmin === "object" && rawAdmin !== null
        ? String(rawAdmin._id)
        : rawAdmin
        ? String(rawAdmin)
        : null;

    const adminObj = adminId
      ? admins.find((a) => String(a._id) === String(adminId))
      : null;

    const adminName =
      adminObj?.name ||
      (typeof rawAdmin === "object" ? rawAdmin?.name : null);

    return {
      event: eventObj,
      client: clientObj,
      adminId,
      adminObj,
      adminName,
    };
  };

  // Filter Media
  const filteredMedia = mediaList.filter((item) => {
    const { event, client, adminId, adminName } = getMediaAssignmentDetails(item);

    // Admin filter
    if (selectedAdmin !== "All") {
      if (selectedAdmin === "unassigned") {
        if (adminId) return false;
      } else {
        if (!adminId || String(adminId) !== String(selectedAdmin)) {
          return false;
        }
      }
    }

    // Event filter
    if (selectedEvent !== "All") {
      const eventIdStr = event?._id ? String(event._id) : String(item.eventId);
      if (eventIdStr !== String(selectedEvent)) {
        return false;
      }
    }

    // Media type filter
    if (mediaTypeFilter !== "All" && item.videosOrImageUrlType !== mediaTypeFilter) {
      return false;
    }

    // Status filter
    if (statusFilter === "Active" && !item.isActive) return false;
    if (statusFilter === "Inactive" && item.isActive) return false;

    // Search term
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      const eventName = `${event?.brideName || ""} ${event?.groomName || ""} ${event?.location || ""}`.toLowerCase();
      const clientName = (client?.name || "").toLowerCase();
      const adminNameStr = (adminName || "").toLowerCase();
      const matchSearch =
        eventName.includes(s) ||
        clientName.includes(s) ||
        adminNameStr.includes(s) ||
        item.videosOrImageUrlType?.toLowerCase().includes(s);
      if (!matchSearch) return false;
    }

    return true;
  });

  // Toggle Media Active
  const handleToggleActive = async (mediaItem) => {
    try {
      setActionLoadingId(mediaItem._id);
      await axiosInstance.put("/admin/toggleMediaActive", {
        mediaId: mediaItem._id,
      });

      toast.success(`Media marked as ${mediaItem.isActive ? "Inactive (Hidden)" : "Active (Visible)"}`);

      if (previewMedia?._id === mediaItem._id) {
        setPreviewMedia((prev) => ({ ...prev, isActive: !prev.isActive }));
      }

      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Toggle Downloadable Permission
  const handleToggleDownloadable = async (mediaItem) => {
    try {
      setActionLoadingId(mediaItem._id);
      await axiosInstance.put("/admin/iSdownload", {
        mediaId: mediaItem._id,
      });

      toast.success(
        `Downloads ${mediaItem.isDownloadable ? "disabled" : "enabled"} for this media`
      );

      if (previewMedia?._id === mediaItem._id) {
        setPreviewMedia((prev) => ({ ...prev, isDownloadable: !prev.isDownloadable }));
      }

      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle download permission");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Media
  const handleDeleteMedia = async () => {
    if (!deleteConfirmMedia) return;

    try {
      setActionLoadingId(deleteConfirmMedia._id);
      await axiosInstance.delete("/admin/deleteMedia", {
        params: { mediaId: deleteConfirmMedia._id },
        data: { mediaId: deleteConfirmMedia._id },
      });

      toast.success("Media deleted permanently");
      setDeleteConfirmMedia(null);
      if (previewMedia?._id === deleteConfirmMedia._id) {
        setPreviewMedia(null);
      }
      await fetchData();
    } catch (error) {
      console.error("Delete media error:", error);
      toast.error(error.response?.data?.message || "Failed to delete media");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Upload Media
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!uploadEventId) {
      toast.error("Please select an event");
      return;
    }

    if (!uploadFiles.length) {
      toast.error("Please select at least one media file");
      return;
    }

    try {
      setUploadLoading(true);
      const formData = new FormData();
      formData.append("eventId", uploadEventId);

      Array.from(uploadFiles).forEach((file) => {
        formData.append("mediaFiles", file);
      });

      if (uploadThumbnail) {
        formData.append("thumbnail", uploadThumbnail);
      }

      await axiosInstance.post("/admin/createMedia", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Media uploaded successfully!");
      setShowUploadModal(false);
      setUploadFiles([]);
      setUploadThumbnail(null);
      setUploadEventId("");
      await fetchData();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload media");
    } finally {
      setUploadLoading(false);
    }
  };

  // Count stats
  const totalPhotos = mediaList.filter((m) => m.videosOrImageUrlType === "Image").length;
  const totalVideos = mediaList.filter((m) => m.videosOrImageUrlType === "Video").length;
  const totalActive = mediaList.filter((m) => m.isActive).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              Central Media Hub
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Master Media & Albums Access
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Unrestricted access to all photos, videos, and albums across all studio admins and clients.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-md shadow-purple-500/20 transition transform hover:-translate-y-0.5"
        >
          <FaCloudUploadAlt className="text-base" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Assets</span>
          <h3 className="text-2xl font-black text-gray-900 mt-1">{mediaList.length}</h3>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Photos</span>
          <h3 className="text-2xl font-black text-purple-600 mt-1">{totalPhotos}</h3>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Videos</span>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">{totalVideos}</h3>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Active / Visible</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-1">{totalActive}</h3>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by event, client, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800 transition"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter by Studio Admin */}
            <div className="flex items-center gap-1.5">
              <FaUserTie className="text-gray-400 text-xs" />
              <select
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="All">All Studio Admins</option>
                <option value="unassigned">Unassigned Clients</option>
                {admins.map((adm) => (
                  <option key={adm._id} value={adm._id}>
                    Admin: {adm.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Event */}
            <div className="flex items-center gap-1.5">
              <FaCalendarAlt className="text-gray-400 text-xs" />
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 max-w-[180px] truncate"
              >
                <option value="All">All Events ({events.length})</option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.brideName && ev.groomName
                      ? `${ev.brideName} & ${ev.groomName}`
                      : ev.location || "Shoot"}
                  </option>
                ))}
              </select>
            </div>

            {/* Media Type Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              {[
                { label: "All", value: "All" },
                { label: "Photos", value: "Image" },
                { label: "Videos", value: "Video" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setMediaTypeFilter(tab.value)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    mediaTypeFilter === tab.value
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              {["All", "Active", "Inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    statusFilter === tab
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-xs text-gray-400">
          <span>
            Showing <strong className="text-gray-700">{filteredMedia.length}</strong> of{" "}
            {mediaList.length} media items
          </span>
          {(selectedAdmin !== "All" || selectedEvent !== "All" || mediaTypeFilter !== "All" || statusFilter !== "All" || searchTerm) && (
            <button
              onClick={() => {
                setSelectedAdmin("All");
                setSelectedEvent("All");
                setMediaTypeFilter("All");
                setStatusFilter("All");
                setSearchTerm("");
              }}
              className="text-purple-600 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading media gallery...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
            <FaPhotoVideo />
          </div>
          <h3 className="text-base font-bold text-gray-800">No Media Matches</h3>
          <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting another studio admin, or upload media to events.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMedia.map((item) => {
            const isVideo = item.videosOrImageUrlType === "Video";
            const { event, client, adminName } = getMediaAssignmentDetails(item);
            const isActionLoading = actionLoadingId === item._id;

            return (
              <div
                key={item._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Visual Thumbnail / Preview Area */}
                <div className="relative aspect-[4/3] bg-gray-900 overflow-hidden">
                  {isVideo ? (
                    <video
                      src={item.videosOrImageUrl}
                      poster={item.thumbnail}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <img
                      src={item.videosOrImageUrl || item.thumbnail}
                      alt="Album shoot media"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md flex items-center gap-1 ${
                        isVideo
                          ? "bg-indigo-600/80 text-white"
                          : "bg-purple-600/80 text-white"
                      }`}
                    >
                      {isVideo ? <FaVideo /> : <FaImages />} {item.videosOrImageUrlType}
                    </span>
                  </div>

                  {/* Status & Download Badges */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ring-2 ring-white/50 ${
                        item.isActive ? "bg-emerald-400" : "bg-red-400"
                      }`}
                      title={item.isActive ? "Active" : "Inactive"}
                    ></span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-bold backdrop-blur-md ${
                        item.isDownloadable
                          ? "bg-emerald-500/80 text-white"
                          : "bg-black/60 text-gray-300"
                      }`}
                    >
                      {item.isDownloadable ? "Downloadable" : "Locked"}
                    </span>
                  </div>

                  {/* Hover Overlay with Instant Controls */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-xs">
                    {/* Zoom / Lightbox */}
                    <button
                      onClick={() => setPreviewMedia(item)}
                      title="Inspect Full Size"
                      className="w-10 h-10 rounded-2xl bg-white text-gray-900 hover:bg-purple-600 hover:text-white transition flex items-center justify-center text-sm shadow-lg"
                    >
                      {isVideo ? <FaPlay /> : <FaEye />}
                    </button>

                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(item)}
                      disabled={isActionLoading}
                      title={item.isActive ? "Deactivate" : "Activate"}
                      className={`w-10 h-10 rounded-2xl transition flex items-center justify-center text-sm shadow-lg ${
                        item.isActive
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-gray-200 text-gray-700 hover:bg-emerald-500 hover:text-white"
                      }`}
                    >
                      <FaCheck />
                    </button>

                    {/* Toggle Downloadable */}
                    <button
                      onClick={() => handleToggleDownloadable(item)}
                      disabled={isActionLoading}
                      title={item.isDownloadable ? "Lock Download" : "Allow Download"}
                      className={`w-10 h-10 rounded-2xl transition flex items-center justify-center text-sm shadow-lg ${
                        item.isDownloadable
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      <FaDownload />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmMedia(item)}
                      disabled={isActionLoading}
                      title="Delete Media Permanently"
                      className="w-10 h-10 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center text-sm shadow-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-bold text-sm text-gray-900 truncate">
                        {event?.brideName && event?.groomName
                          ? `${event.brideName} & ${event.groomName}`
                          : event?.location || "Photoshoot Album"}
                      </h4>
                      {adminName ? (
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-700 truncate max-w-[110px]"
                          title={`Studio Admin: ${adminName}`}
                        >
                          Studio: {adminName}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700">
                          Unassigned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                      <FaUser className="text-[10px] text-gray-400" />
                      <span className="truncate">Client: {client?.name || "Unknown"}</span>
                    </p>
                  </div>

                  {/* Status & Download Toggle Bar */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    {/* Active/Inactive Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      disabled={isActionLoading}
                      title={item.isActive ? "Click to Deactivate (Hide from Client)" : "Click to Activate (Make Visible to Client)"}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                        item.isActive
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-xs"
                          : "bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                      } ${isActionLoading ? "opacity-50 cursor-wait" : ""}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${item.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}></span>
                      <span>{item.isActive ? "Active" : "Inactive"}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleDownloadable(item)}
                        disabled={isActionLoading}
                        title={item.isDownloadable ? "Download Allowed (Click to lock)" : "Download Locked (Click to allow)"}
                        className={`p-1.5 rounded-lg text-xs transition ${
                          item.isDownloadable
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                            : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                        }`}
                      >
                        <FaDownload />
                      </button>
                      <button
                        onClick={() => setPreviewMedia(item)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-purple-600 hover:bg-purple-50 transition"
                      >
                        Inspect →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Lightbox Preview */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
            {/* Lightbox Header */}
            <div className="p-4 bg-gray-900/90 border-b border-white/10 flex items-center justify-between text-white">
              <div>
                <h3 className="font-bold text-sm">
                  {previewMedia.eventId?.brideName && previewMedia.eventId?.groomName
                    ? `${previewMedia.eventId.brideName} & ${previewMedia.eventId.groomName}`
                    : "Media Asset Preview"}
                </h3>
                <p className="text-xs text-gray-400">
                  Type: {previewMedia.videosOrImageUrlType} • Status:{" "}
                  <strong className={previewMedia.isActive ? "text-emerald-400" : "text-red-400"}>
                    {previewMedia.isActive ? "Active (Visible)" : "Inactive (Hidden)"}
                  </strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewMedia.videosOrImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs flex items-center gap-1"
                >
                  <FaDownload /> Download
                </a>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Media Content */}
            <div className="flex-1 bg-black flex items-center justify-center p-4 overflow-hidden">
              {previewMedia.videosOrImageUrlType === "Video" ? (
                <video
                  src={previewMedia.videosOrImageUrl}
                  controls
                  autoPlay
                  className="max-h-[65vh] w-auto max-w-full rounded-xl"
                />
              ) : (
                <img
                  src={previewMedia.videosOrImageUrl}
                  alt="High res preview"
                  className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
                />
              )}
            </div>

            {/* Lightbox Footer Actions */}
            <div className="p-4 bg-gray-900 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="text-gray-400 flex items-center gap-2">
                <span>Client: <strong className="text-white">{getMediaAssignmentDetails(previewMedia).client?.name || "N/A"}</strong></span>
                <span>•</span>
                <span>Studio Admin: <strong className="text-purple-400">{getMediaAssignmentDetails(previewMedia).adminName || "Unassigned"}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleActive(previewMedia)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    previewMedia.isActive
                      ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
                      : "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${previewMedia.isActive ? "bg-white animate-pulse" : "bg-white"}`}></span>
                  <span>{previewMedia.isActive ? "Status: Active (Click to Hide)" : "Status: Inactive (Click to Show)"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleDownloadable(previewMedia)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    previewMedia.isDownloadable
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <FaDownload className="text-xs" />
                  <span>{previewMedia.isDownloadable ? "Download Allowed" : "Download Locked"}</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmMedia(previewMedia)}
                  className="px-3 py-1.5 rounded-xl bg-red-600/30 text-red-400 hover:bg-red-600 hover:text-white transition font-bold"
                >
                  Delete Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirmMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaTrash />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Permanently Delete Media?
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              This will permanently erase this file from cloud storage and remove it from all client and admin albums. This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmMedia(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMedia}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition flex items-center gap-2"
              >
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload Media to Event */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Super Admin Media Upload
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Upload photos and videos directly to any photoshoot event
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Event / Album *
                </label>
                <select
                  value={uploadEventId}
                  onChange={(e) => setUploadEventId(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-medium text-gray-800"
                >
                  <option value="">-- Choose an event --</option>
                  {events.map((ev) => (
                    <option key={ev._id} value={ev._id}>
                      {ev.brideName && ev.groomName
                        ? `${ev.brideName} & ${ev.groomName}`
                        : ev.location || "Shoot"}{" "}
                      (Client: {ev.userId?.name || "User"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Photos or Videos * (Max 20)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setUploadFiles(e.target.files)}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Selected: {uploadFiles.length} file{uploadFiles.length === 1 ? "" : "s"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Optional Thumbnail (Image only)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadThumbnail(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-700 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md shadow-purple-500/20 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {uploadLoading && <FaSpinner className="animate-spin" />}
                  <span>{uploadLoading ? "Uploading..." : "Start Upload"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminMedia;
