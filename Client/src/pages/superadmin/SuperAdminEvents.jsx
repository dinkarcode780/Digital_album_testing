import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";
import {
  FaCalendarAlt,
  FaSearch,
  FaMapMarkerAlt,
  FaUserTie,
  FaUser,
  FaPhotoVideo,
  FaTrash,
  FaEdit,
  FaFilter,
  FaSpinner,
  FaPlus,
  FaTimes,
  FaHeart,
} from "react-icons/fa";

function SuperAdminEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const [eventsRes, adminsRes, clientsRes] = await Promise.all([
        axiosInstance.get("/admin/getEventByFilter", { params: { limit: 100 } }),
        axiosInstance.get("/admin/getAllAdmins"),
        axiosInstance.get("/users/getUserByFilter", { params: { userType: "User", limit: "All" } }),
      ]);

      setEvents(eventsRes.data?.data || []);
      setAdmins(adminsRes.data?.data || []);
      setClients(clientsRes.data?.data || []);
    } catch (error) {
      console.error("Super Admin events fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, []);

  // Helper to find client & assigned studio admin for an event
  const getEventAssignmentDetails = (ev) => {
    const rawUserId =
      typeof ev.userId === "object" && ev.userId !== null
        ? ev.userId?._id
        : ev.userId;

    const clientObj =
      clients.find((c) => String(c._id) === String(rawUserId)) ||
      (typeof ev.userId === "object" ? ev.userId : null);

    const rawAdmin =
      clientObj?.ownerAdminId ||
      (typeof ev.userId === "object" ? ev.userId?.ownerAdminId : null);

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
      client: clientObj,
      adminId,
      adminObj,
      adminName,
    };
  };

  // Filter events
  const filteredEvents = events.filter((ev) => {
    const { client, adminId, adminName } = getEventAssignmentDetails(ev);

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

    // Status filter
    if (selectedStatus !== "All" && ev.status !== selectedStatus) {
      return false;
    }

    // Search query
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      const match =
        (ev.brideName || "").toLowerCase().includes(s) ||
        (ev.groomName || "").toLowerCase().includes(s) ||
        (ev.location || "").toLowerCase().includes(s) ||
        (client?.name || "").toLowerCase().includes(s) ||
        (adminName || "").toLowerCase().includes(s);
      if (!match) return false;
    }

    return true;
  });

  // Delete event
  const handleDeleteEvent = async () => {
    if (!deleteConfirmEvent) return;

    try {
      setDeleteLoading(true);
      await axiosInstance.delete("/admin/deleteEvent", {
        params: { eventId: deleteConfirmEvent._id },
        data: { eventId: deleteConfirmEvent._id },
      });

      toast.success("Event deleted successfully");
      setDeleteConfirmEvent(null);
      await fetchEventsData();
    } catch (error) {
      console.error("Delete event error:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper to find client's assigned admin
  const getAdminForClient = (client) => {
    if (!client) return null;
    const rawAdmin =
      client.ownerAdminId ||
      clients.find((c) => String(c._id) === String(client._id || client))?.ownerAdminId;
    const adminId =
      typeof rawAdmin === "object" && rawAdmin !== null
        ? String(rawAdmin._id)
        : rawAdmin
        ? String(rawAdmin)
        : null;
    if (!adminId) return null;
    return admins.find((a) => String(a._id) === String(adminId)) || null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              Event Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Events & Photoshoots
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Master oversight of all wedding, pre-wedding, and studio shoots across all admins.
          </p>
        </div>

        <Link
          to="/super-admin/media"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-md shadow-purple-500/20 transition transform hover:-translate-y-0.5"
        >
          <FaPhotoVideo />
          <span>Go to Media Hub</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by bride, groom, location, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
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
                  Studio: {adm.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            {["All", "Upcoming", "Ongoing", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedStatus === tab
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

      {/* Events Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading events & shoots...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border border-gray-100 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
            <FaCalendarAlt />
          </div>
          <h3 className="text-base font-bold text-gray-800">No Events Found</h3>
          <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
            No events match your selected filters. Try clearing search or selecting another studio admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredEvents.map((ev) => {
            const client = ev.userId;
            const assignedAdmin = getAdminForClient(client);

            return (
              <div
                key={ev._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ev.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : ev.status === "Ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {ev.status || "Upcoming"}
                      </span>
                      <h3 className="font-bold text-base text-gray-900 mt-2 flex items-center gap-1.5">
                        <FaHeart className="text-red-400 text-xs" />
                        <span>
                          {ev.brideName && ev.groomName
                            ? `${ev.brideName} & ${ev.groomName}`
                            : ev.location || "Photoshoot"}
                        </span>
                      </h3>
                    </div>

                    <button
                      onClick={() => setDeleteConfirmEvent(ev)}
                      title="Delete Event"
                      className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>
                        {ev.eventDate
                          ? new Date(ev.eventDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Date not specified"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-gray-400" />
                      <span>{ev.location || "Studio"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      <span>Client: {client?.name || "Unassigned client"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUserTie className="text-purple-500" />
                      <span>
                        Studio Admin:{" "}
                        <strong className="text-gray-800">
                          {assignedAdmin ? assignedAdmin.name : "Unassigned"}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">
                    Category: {ev.eventSubCategoryId?.name || "General"}
                  </span>
                  <Link
                    to={`/super-admin/media?eventId=${ev._id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition"
                  >
                    <FaPhotoVideo className="text-xs" />
                    <span>View Media</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Delete Event Confirmation */}
      {deleteConfirmEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaTrash />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Delete Event & Albums?
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete this event? Media files associated with this shoot may also be removed.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmEvent(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={deleteLoading}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition disabled:opacity-50 flex items-center gap-2"
              >
                {deleteLoading && <FaSpinner className="animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminEvents;
