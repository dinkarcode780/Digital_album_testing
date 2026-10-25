import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaCheck,
  FaSpinner,
  FaShieldAlt,
  FaUserCheck,
  FaUserTimes,
  FaUsers,
  FaArrowRight,
  FaEllipsisV,
  FaGift,
  FaCreditCard,
  FaCrown,
} from "react-icons/fa";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phoneNumber: "",
  address: "",
};

function ManageAdmins() {
  const { admin } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [clients, setClients] = useState([]);
  const [subscriptionsMap, setSubscriptionsMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmAdmin, setDeleteConfirmAdmin] = useState(null);

  // Fetch all admins, clients and subscription overview
  const fetchData = async () => {
    try {
      setLoading(true);
      const [adminsRes, clientsRes, subRes] = await Promise.all([
        axiosInstance.get("/admin/getAllAdmins"),
        axiosInstance.get("/users/getUserByFilter", {
          params: { userType: "User", limit: "All" },
        }),
        axiosInstance.get("/subscriptions/admin-overview").catch(() => ({ data: { data: { admins: [] } } })),
      ]);

      setAdmins(adminsRes.data?.data || []);
      setClients(clientsRes.data?.data || []);

      const subMap = {};
      (subRes.data?.data?.admins || []).forEach((item) => {
        if (item.admin?._id) {
          subMap[item.admin._id] = item;
        }
      });
      setSubscriptionsMap(subMap);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error(error.response?.data?.message || "Failed to load studio admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter admins
  const filteredAdmins = admins.filter((adm) => {
    const matchesSearch =
      adm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      adm.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (adm.phoneNumber && adm.phoneNumber.toString().includes(searchTerm)) ||
      (adm.address && adm.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "Active"
        ? adm.isActive === true
        : adm.isActive === false;

    return matchesSearch && matchesStatus;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const onlyNumbers = value.replace(/\D/g, "");
      setForm((prev) => ({ ...prev, phoneNumber: onlyNumbers }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowModal(true);
  };

  // Open Edit Modal
  const handleEdit = (adminData) => {
    setForm({
      name: adminData.name || "",
      email: adminData.email || "",
      password: "", // leave blank unless updating
      phoneNumber: adminData.phoneNumber || "",
      address: adminData.address || "",
    });
    setEditingId(adminData._id);
    setShowModal(true);
  };

  // Submit Create or Edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      toast.error("Name and Email are required");
      return;
    }

    if (!editingId && !form.password) {
      toast.error("Password is required for creating a new studio admin");
      return;
    }

    try {
      setSubmitLoading(true);

      if (editingId) {
        // Update admin profile
        const payload = {
          adminId: editingId,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phoneNumber: form.phoneNumber ? Number(form.phoneNumber) : undefined,
          address: form.address.trim(),
        };

        await axiosInstance.put("/admin/adminUpdateProfile", payload);
        toast.success("Studio admin updated successfully");
      } else {
        // Create new admin
        const payload = {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phoneNumber: form.phoneNumber ? Number(form.phoneNumber) : undefined,
          address: form.address.trim(),
        };

        await axiosInstance.post("/admin/createAdmin", payload);
        toast.success("New studio admin registered successfully");
      }

      setShowModal(false);
      setForm(initialForm);
      setEditingId(null);
      await fetchData();
    } catch (error) {
      console.error("Admin save error:", error);
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (adminItem) => {
    try {
      setActionLoadingId(adminItem._id);
      await axiosInstance.put("/admin/userIsActive", { userId: adminItem._id });
      toast.success(
        `Admin account ${adminItem.isActive ? "deactivated" : "activated"} successfully`
      );
      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update admin status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Admin
  const handleDeleteAdmin = async () => {
    if (!deleteConfirmAdmin) return;

    try {
      setSubmitLoading(true);
      const res = await axiosInstance.delete("/admin/deleteAdmin", {
        params: { adminId: deleteConfirmAdmin._id },
      });

      toast.success(res.data?.message || "Studio admin deleted successfully");
      setDeleteConfirmAdmin(null);
      await fetchData();
    } catch (error) {
      console.error("Delete admin error:", error);
      toast.error(error.response?.data?.message || "Failed to delete admin");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Helper to count clients for an admin
  const getClientCountForAdmin = (adminId) => {
    return clients.filter(
      (c) =>
        (typeof c.ownerAdminId === "object"
          ? c.ownerAdminId?._id
          : c.ownerAdminId) === adminId
    ).length;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              Admin Governance
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Manage Studio Administrators
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Full control over studio admins: register, edit profiles, toggle permissions, or delete accounts.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-md shadow-purple-500/20 transition transform hover:-translate-y-0.5"
        >
          <FaPlus />
          <span>Register New Admin</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 md:p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name, email, phone, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-100 p-1 rounded-2xl">
            {["All", "Active", "Inactive"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  statusFilter === tab
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-xs font-bold text-gray-400 hidden sm:inline">
            Showing {filteredAdmins.length} of {admins.length} Admins
          </span>
        </div>
      </div>

      {/* Admins Table / Cards */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading studio administrators...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-purple-50 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">
              <FaUser />
            </div>
            <h3 className="text-base font-bold text-gray-800">No Administrators Found</h3>
            <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== "All"
                ? "Try adjusting your search query or status filter."
                : "Register your first studio admin using the button above."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                  <th className="px-6 py-4">Studio Administrator</th>
                  <th className="px-6 py-4">Subscription</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Assigned Clients</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmins.map((adm) => {
                  const clientCount = getClientCountForAdmin(adm._id);
                  const isActionLoading = actionLoadingId === adm._id;
                  const subData = subscriptionsMap[adm._id];
                  const isFree = subData?.isFreeGrant || subData?.status === "free_grant" || subData?.status === "lifetime_free";
                  const isPaid = subData?.status === "active_paid";
                  const isTrial = subData?.status === "trial";

                  return (
                    <tr
                      key={adm._id}
                      className="hover:bg-purple-50/30 transition-colors duration-150"
                    >
                      {/* Admin Name & Avatar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              adm.profileImage ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                adm.name
                              )}&background=8b5cf6&color=fff`
                            }
                            alt={adm.name}
                            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-purple-500/10 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-900">
                                {adm.name}
                              </span>
                              {adm.userType === "SuperAdmin" && (
                                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-purple-100 text-purple-700">
                                  Super
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{adm.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Subscription Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to="/super-admin/subscription-plans"
                          className="inline-block"
                        >
                          {isFree ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold hover:bg-amber-200 transition">
                              <FaCrown className="text-amber-600 text-[10px]" />
                              <span>{subData?.isLifetime ? "VIP Lifetime" : "VIP Free"}</span>
                            </span>
                          ) : isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200 transition">
                              <FaCheck className="text-emerald-600 text-[10px]" />
                              <span>Active Paid</span>
                            </span>
                          ) : isTrial ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold hover:bg-indigo-200 transition">
                              <span>Trial ({subData?.daysRemaining || 0}d)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold hover:bg-red-200 transition">
                              <span>Expired</span>
                            </span>
                          )}
                        </Link>
                      </td>

                      {/* Contact Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-700 space-y-0.5">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaPhone className="text-gray-400 text-[10px]" />
                            <span>{adm.phoneNumber || "No phone added"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                            <FaEnvelope className="text-[10px]" />
                            <span>{adm.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <FaMapMarkerAlt className="text-gray-400 text-[11px]" />
                          <span className="truncate max-w-[150px]">
                            {adm.address || "Not specified"}
                          </span>
                        </div>
                      </td>

                      {/* Assigned Clients */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/super-admin/clients?adminId=${adm._id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition group"
                        >
                          <FaUsers className="text-purple-500" />
                          <span>{clientCount} Clients</span>
                          <FaArrowRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>

                      {/* Status Toggle Switch */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(adm)}
                            disabled={isActionLoading}
                            title={adm.isActive ? "Click to Deactivate Admin" : "Click to Activate Admin"}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                              adm.isActive ? "bg-emerald-500" : "bg-gray-300"
                            } ${isActionLoading ? "opacity-50 cursor-wait" : ""}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                adm.isActive ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span
                            onClick={() => handleToggleStatus(adm)}
                            className={`text-xs font-bold cursor-pointer select-none px-2 py-0.5 rounded-md ${
                              adm.isActive
                                ? "text-emerald-700 bg-emerald-50"
                                : "text-gray-500 bg-gray-100"
                            }`}
                          >
                            {adm.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to="/super-admin/subscription-plans"
                            title="Manage / Grant Subscription"
                            className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition"
                          >
                            <FaGift />
                          </Link>
                          <button
                            onClick={() => handleEdit(adm)}
                            title="Edit Admin"
                            className="p-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmAdmin(adm)}
                            title="Delete Admin"
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

      {/* Modal: Create or Edit Admin */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit Studio Admin" : "Register New Studio Admin"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {editingId
                    ? "Update admin credentials and contact information"
                    : "Create a new studio admin account to manage photoshoot albums"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
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
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="admin@studio.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                  />
                </div>
              </div>

              {!editingId && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter strong password"
                      required={!editingId}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Address / Studio Location
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3.5 top-3 text-gray-400 text-sm" />
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Studio location, street, city..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md shadow-purple-500/20 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {submitLoading && <FaSpinner className="animate-spin" />}
                  <span>{editingId ? "Update Admin" : "Create Admin"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteConfirmAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaTrash />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Delete Studio Admin?
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-gray-800">{deleteConfirmAdmin.name}</strong>?
              All clients assigned to this admin will automatically be moved to the{" "}
              <span className="text-amber-600 font-bold">Unassigned pool</span> so you can reassign them anytime.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmAdmin(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
              >
                Keep Admin
              </button>
              <button
                onClick={handleDeleteAdmin}
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

export default ManageAdmins;