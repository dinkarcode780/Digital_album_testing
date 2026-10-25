import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaUserTie,
  FaUserFriends,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExchangeAlt,
  FaTimes,
  FaSpinner,
  FaLock,
  FaMapMarkerAlt,
  FaUserTimes,
  FaFilter,
} from "react-icons/fa";

const initialUserForm = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  address: "",
  ownerAdminId: "",
};

function ManageClient() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedAdminFilter, setSelectedAdminFilter] = useState(
    searchParams.get("adminId") || (searchParams.get("filter") === "unassigned" ? "unassigned" : "All")
  );
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [deleteConfirmClient, setDeleteConfirmClient] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [targetAdminId, setTargetAdminId] = useState("");

  // Fetch all clients & admins
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [clientsRes, adminsRes] = await Promise.all([
        axiosInstance.get("/users/getUserByFilter", {
          params: { userType: "User", limit: "All" },
        }),
        axiosInstance.get("/admin/getAllAdmins"),
      ]);

      setClients(clientsRes.data?.data || []);
      setAdmins(adminsRes.data?.data || []);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast.error(error.response?.data?.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update query params when filter changes
  useEffect(() => {
    const adminFromQuery = searchParams.get("adminId");
    const filterFromQuery = searchParams.get("filter");

    if (adminFromQuery) {
      setSelectedAdminFilter(adminFromQuery);
    } else if (filterFromQuery === "unassigned") {
      setSelectedAdminFilter("unassigned");
    }
  }, [searchParams]);

  // Client filtering logic
  const filteredClients = clients.filter((client) => {
    // Search query
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      client.name?.toLowerCase().includes(s) ||
      client.email?.toLowerCase().includes(s) ||
      (client.phoneNumber && client.phoneNumber.toString().includes(s));

    // Admin Assignment Filter
    let matchesAdmin = true;
    const assignedId =
      typeof client.ownerAdminId === "object"
        ? client.ownerAdminId?._id
        : client.ownerAdminId;

    if (selectedAdminFilter === "unassigned") {
      matchesAdmin = !assignedId;
    } else if (selectedAdminFilter && selectedAdminFilter !== "All") {
      matchesAdmin = assignedId === selectedAdminFilter;
    }

    // Status Filter
    let matchesStatus = true;
    if (statusFilter === "Active") matchesStatus = client.isActive === true;
    if (statusFilter === "Inactive") matchesStatus = client.isActive === false;

    return matchesSearch && matchesAdmin && matchesStatus;
  });

  // Calculate statistics
  const totalClients = clients.length;
  const assignedClients = clients.filter((c) => c.ownerAdminId).length;
  const unassignedClients = totalClients - assignedClients;

  // Open Assign Modal
  const handleOpenAssignModal = (client) => {
    setCurrentUser(client);
    const assignedId =
      typeof client.ownerAdminId === "object"
        ? client.ownerAdminId?._id
        : client.ownerAdminId || "";
    setTargetAdminId(assignedId);
    setShowAssignModal(true);
  };

  // Submit Assign / Reassign / Unassign
  const handleSaveAssignment = async () => {
    if (!currentUser) return;

    try {
      setSubmitLoading(true);
      const res = await axiosInstance.post("/admin/assignClientToAdmin", {
        userId: currentUser._id,
        adminId: targetAdminId || null,
      });

      toast.success(res.data?.message || "Client assignment updated successfully");
      setShowAssignModal(false);
      setCurrentUser(null);
      await fetchAllData();
    } catch (error) {
      console.error("Assignment error:", error);
      toast.error(error.response?.data?.message || "Failed to update assignment");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setUserForm(initialUserForm);
    setShowAddModal(true);
  };

  // Submit Add Client
  const handleCreateClient = async (e) => {
    e.preventDefault();

    if (!userForm.name || !userForm.email || !userForm.password) {
      toast.error("Name, email and password are required");
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await axiosInstance.post("/users/userRegister", {
        name: userForm.name.trim(),
        email: userForm.email.trim().toLowerCase(),
        password: userForm.password,
        phoneNumber: userForm.phoneNumber ? Number(userForm.phoneNumber) : undefined,
        address: userForm.address.trim(),
      });

      const newUserId = res.data?.data?._id;

      // If an admin was selected during creation, assign right away
      if (newUserId && userForm.ownerAdminId) {
        await axiosInstance.post("/admin/assignClientToAdmin", {
          userId: newUserId,
          adminId: userForm.ownerAdminId,
        });
      }

      toast.success("Client account registered successfully");
      setShowAddModal(false);
      setUserForm(initialUserForm);
      await fetchAllData();
    } catch (error) {
      console.error("Create client error:", error);
      toast.error(error.response?.data?.message || "Failed to register client");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (client) => {
    setCurrentUser(client);
    setUserForm({
      name: client.name || "",
      email: client.email || "",
      password: "",
      phoneNumber: client.phoneNumber || "",
      address: client.address || "",
      ownerAdminId:
        (typeof client.ownerAdminId === "object"
          ? client.ownerAdminId?._id
          : client.ownerAdminId) || "",
    });
    setShowEditModal(true);
  };

  // Submit Edit Client
  const handleUpdateClient = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      setSubmitLoading(true);
      await axiosInstance.put("/users/userUpdateProfile", {
        userId: currentUser._id,
        name: userForm.name.trim(),
        email: userForm.email.trim().toLowerCase(),
        phoneNumber: userForm.phoneNumber ? Number(userForm.phoneNumber) : undefined,
        address: userForm.address.trim(),
      });

      // Update admin assignment if changed
      const currentAssignedId =
        typeof currentUser.ownerAdminId === "object"
          ? currentUser.ownerAdminId?._id
          : currentUser.ownerAdminId || "";

      if (userForm.ownerAdminId !== currentAssignedId) {
        await axiosInstance.post("/admin/assignClientToAdmin", {
          userId: currentUser._id,
          adminId: userForm.ownerAdminId || null,
        });
      }

      toast.success("Client details updated successfully");
      setShowEditModal(false);
      setCurrentUser(null);
      await fetchAllData();
    } catch (error) {
      console.error("Update client error:", error);
      toast.error(error.response?.data?.message || "Failed to update client");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (client) => {
    try {
      setActionLoadingId(client._id);
      await axiosInstance.put("/users/toggleUserStatus", null, {
        params: { userId: client._id },
      });

      toast.success(
        `Client ${client.isActive ? "deactivated" : "activated"} successfully`
      );
      await fetchAllData();
    } catch (error) {
      console.error("Status toggle error:", error);
      toast.error(error.response?.data?.message || "Failed to toggle status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Client
  const handleDeleteClient = async () => {
    if (!deleteConfirmClient) return;

    try {
      setSubmitLoading(true);
      await axiosInstance.get("/users/userDeleteById", {
        params: { userId: deleteConfirmClient._id },
      });

      toast.success("Client deleted successfully");
      setDeleteConfirmClient(null);
      await fetchAllData();
    } catch (error) {
      console.error("Delete client error:", error);
      toast.error(error.response?.data?.message || "Failed to delete client");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get Admin Name for client
  const getAssignedAdmin = (client) => {
    if (!client.ownerAdminId) return null;
    if (typeof client.ownerAdminId === "object" && client.ownerAdminId.name) {
      return client.ownerAdminId;
    }
    return admins.find((a) => a._id === client.ownerAdminId) || null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
              Client Directory
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Client & User Management
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Super Admin control: filter by Studio Admin, re-assign studio managers, edit profiles, or remove clients.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-md shadow-blue-500/20 transition transform hover:-translate-y-0.5"
        >
          <FaPlus />
          <span>Add New Client</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
            <FaUserFriends />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Total Clients</span>
            <h3 className="text-2xl font-black text-gray-900">{totalClients}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            <FaCheckCircle />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Assigned to Studio Admin</span>
            <h3 className="text-2xl font-black text-emerald-600">{assignedClients}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${unassignedClients > 0 ? "bg-amber-50 text-amber-600" : "bg-gray-50 text-gray-400"}`}>
            <FaExclamationTriangle />
          </div>
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase">Unassigned Pool</span>
            <h3 className={`text-2xl font-black ${unassignedClients > 0 ? "text-amber-600" : "text-gray-600"}`}>
              {unassignedClients}
            </h3>
          </div>
        </div>
      </div>

      {/* Filter and Search Hub */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search clients by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 transition"
            />
          </div>

          {/* Admin Assignment Filter Dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400 text-xs" />
              <span className="text-xs font-bold text-gray-600">Assigned Studio Admin:</span>
            </div>
            <select
              value={selectedAdminFilter}
              onChange={(e) => {
                setSelectedAdminFilter(e.target.value);
                if (e.target.value === "All") {
                  setSearchParams({});
                } else if (e.target.value === "unassigned") {
                  setSearchParams({ filter: "unassigned" });
                } else {
                  setSearchParams({ adminId: e.target.value });
                }
              }}
              className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Admins ({clients.length})</option>
              <option value="unassigned">⚠️ Unassigned Only ({unassignedClients})</option>
              {admins.map((adm) => (
                <option key={adm._id} value={adm._id}>
                  Studio: {adm.name}
                </option>
              ))}
            </select>

            {/* Status Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl">
              {["All", "Active", "Inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    statusFilter === tab
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedAdminFilter !== "All" && (
          <div className="flex items-center gap-2 pt-2 border-t text-xs text-gray-500">
            <span>Active Filter:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold flex items-center gap-1.5">
              {selectedAdminFilter === "unassigned"
                ? "Unassigned Clients"
                : `Assigned to: ${admins.find((a) => a._id === selectedAdminFilter)?.name || selectedAdminFilter}`}
              <button
                onClick={() => {
                  setSelectedAdminFilter("All");
                  setSearchParams({});
                }}
                className="hover:text-blue-900"
              >
                <FaTimes />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <FaSpinner className="animate-spin text-blue-600 text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading client directory...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
              <FaUserFriends />
            </div>
            <h3 className="text-base font-bold text-gray-800">No Clients Found</h3>
            <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
              No clients match your filter criteria. Try resetting the filters or add a new client.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                  <th className="px-6 py-4">Client User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Assigned Studio Admin</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredClients.map((client) => {
                  const assignedAdmin = getAssignedAdmin(client);
                  const isActionLoading = actionLoadingId === client._id;

                  return (
                    <tr
                      key={client._id}
                      className="hover:bg-blue-50/20 transition-colors duration-150"
                    >
                      {/* Client Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              client.profileImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                client.name
                              )}&background=3b82f6&color=fff`
                            }
                            alt={client.name}
                            className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-500/10 shadow-sm"
                          />
                          <div>
                            <span className="font-bold text-sm text-gray-900 block">
                              {client.name}
                            </span>
                            <span className="text-xs text-gray-500">{client.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-700 space-y-0.5">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaPhone className="text-gray-400 text-[10px]" />
                            <span>{client.phoneNumber || "No phone"}</span>
                          </div>
                          {client.address && (
                            <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                              <FaMapMarkerAlt className="text-[10px]" />
                              <span className="truncate max-w-[140px]">{client.address}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Assigned Admin Badge & Quick Change */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          {assignedAdmin ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                              <FaUserTie className="text-purple-500 text-[11px]" />
                              <span>{assignedAdmin.name}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100">
                              <FaExclamationTriangle className="text-amber-500 text-[11px]" />
                              <span>Unassigned</span>
                            </span>
                          )}

                          <button
                            onClick={() => handleOpenAssignModal(client)}
                            title="Change or reassign studio admin"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition text-xs"
                          >
                            <FaExchangeAlt />
                          </button>
                        </div>
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(client)}
                            disabled={isActionLoading}
                            title={client.isActive ? "Click to Deactivate Client" : "Click to Activate Client"}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              client.isActive ? "bg-emerald-500" : "bg-gray-300"
                            } ${isActionLoading ? "opacity-50 cursor-wait" : ""}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                client.isActive ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span
                            onClick={() => handleToggleStatus(client)}
                            className={`text-xs font-bold cursor-pointer select-none px-2 py-0.5 rounded-md ${
                              client.isActive
                                ? "text-emerald-700 bg-emerald-50"
                                : "text-gray-500 bg-gray-100"
                            }`}
                          >
                            {client.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(client)}
                            title="Edit Client"
                            className="p-2 rounded-xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmClient(client)}
                            title="Delete Client"
                            className="p-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                          >
                            <FaTrash />
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
      </div>

      {/* Modal: Assign / Reassign Studio Admin */}
      {showAssignModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Assign Studio Administrator
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Assign <strong className="text-gray-800">{currentUser.name}</strong> to a studio admin
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Select Studio Admin
                </label>
                <select
                  value={targetAdminId}
                  onChange={(e) => setTargetAdminId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm font-semibold text-gray-800"
                >
                  <option value="">-- Unassigned (Move to pool) --</option>
                  {admins.map((adm) => (
                    <option key={adm._id} value={adm._id}>
                      {adm.name} ({adm.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl p-4 bg-purple-50/60 border border-purple-100 text-xs text-purple-800 space-y-1">
                <p className="font-semibold">Note on Assignment:</p>
                <p className="text-purple-600">
                  Studio admins will only see albums, shoots, and media for clients explicitly assigned to them. Super Admin retains master visibility across all.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAssignment}
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md shadow-purple-500/20 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitLoading && <FaSpinner className="animate-spin" />}
                  <span>Save Assignment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Client */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add New Client</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Register client account and optionally assign to a studio admin
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Client Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="client@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    placeholder="Create a password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="tel"
                    value={userForm.phoneNumber}
                    onChange={(e) => setUserForm({ ...userForm, phoneNumber: e.target.value.replace(/\D/g, "") })}
                    placeholder="10-digit phone number"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Assign Studio Admin (Optional)
                </label>
                <div className="relative">
                  <FaUserTie className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <select
                    value={userForm.ownerAdminId}
                    onChange={(e) => setUserForm({ ...userForm, ownerAdminId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 font-medium"
                  >
                    <option value="">Leave Unassigned (Pool)</option>
                    {admins.map((adm) => (
                      <option key={adm._id} value={adm._id}>
                        Studio Admin: {adm.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                  <textarea
                    value={userForm.address}
                    onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                    rows={2}
                    placeholder="Client address / city..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitLoading && <FaSpinner className="animate-spin" />}
                  <span>Register Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Client */}
      {showEditModal && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Client Profile</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update personal details or assigned studio admin
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleUpdateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userForm.phoneNumber}
                  onChange={(e) => setUserForm({ ...userForm, phoneNumber: e.target.value.replace(/\D/g, "") })}
                  maxLength={10}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Assigned Studio Admin
                </label>
                <select
                  value={userForm.ownerAdminId}
                  onChange={(e) => setUserForm({ ...userForm, ownerAdminId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800 font-medium"
                >
                  <option value="">Unassigned (No Studio Admin)</option>
                  {admins.map((adm) => (
                    <option key={adm._id} value={adm._id}>
                      Studio: {adm.name} ({adm.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Address
                </label>
                <textarea
                  value={userForm.address}
                  onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-800"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitLoading && <FaSpinner className="animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirmClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaTrash />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Delete Client Account?
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-gray-800">{deleteConfirmClient.name}</strong>?
              This will remove their user credentials.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmClient(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClient}
                disabled={submitLoading}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition disabled:opacity-50 flex items-center gap-2"
              >
                {submitLoading && <FaSpinner className="animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageClient;