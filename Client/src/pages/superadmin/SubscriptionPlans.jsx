import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaSearch,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaCrown,
  FaGift,
  FaCreditCard,
  FaUsers,
  FaHistory,
  FaHdd,
  FaCalendarAlt,
  FaShieldAlt,
  FaStar,
  FaBan,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSyncAlt,
  FaArrowRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";

const initialPlanForm = {
  name: "",
  description: "",
  interval: "month",
  intervalCount: 1,
  amount: "",
  storageLimitGb: 10,
  features: [
    "Unlimited Client Photo Sharing",
    "High-Resolution Album Downloads",
    "Secure Client Proofing Gallery",
    "Event Guest Access & QR Codes",
  ],
  isPopular: false,
  badge: "",
};

const initialGrantForm = {
  adminId: "",
  planId: "",
  customPlanName: "VIP Free Studio Pass",
  storageLimitGb: 20,
  durationDays: 365,
  isLifetime: false,
  reason: "Granted VIP Studio Access by Super Admin",
};

export default function SubscriptionPlans() {
  const [activeTab, setActiveTab] = useState("plans"); // 'plans' | 'admins' | 'transactions'

  // Plans State
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [planForm, setPlanForm] = useState(initialPlanForm);
  const [featureInput, setFeatureInput] = useState("");
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [planActionLoading, setPlanActionLoading] = useState(false);

  // Admin Subscriptions Overview State
  const [adminsOverview, setAdminsOverview] = useState([]);
  const [overviewStats, setOverviewStats] = useState({
    totalAdmins: 0,
    activePaid: 0,
    freeGrants: 0,
    trials: 0,
    expired: 0,
  });
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminStatusFilter, setAdminStatusFilter] = useState("All");

  // Free Grant Modal State
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantForm, setGrantForm] = useState(initialGrantForm);
  const [grantLoading, setGrantLoading] = useState(false);
  const [selectedAdminForGrant, setSelectedAdminForGrant] = useState(null);

  // Revoke Modal State
  const [revokeAdminData, setRevokeAdminData] = useState(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [revokeLoading, setRevokeLoading] = useState(false);

  // Transactions State
  const [transactions, setTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState({
    totalRevenue: 0,
    totalPaidCount: 0,
    totalFreeCount: 0,
    totalTransactions: 0,
  });
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState("");

  // ==========================================
  // FETCH DATA
  // ==========================================

  const loadPlans = async () => {
    try {
      setPlansLoading(true);
      const res = await axiosInstance.get("/subscriptions/plans");
      setPlans(res.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load subscription plans");
    } finally {
      setPlansLoading(false);
    }
  };

  const loadAdminsOverview = async () => {
    try {
      setOverviewLoading(true);
      const res = await axiosInstance.get("/subscriptions/admin-overview");
      setAdminsOverview(res.data?.data?.admins || []);
      setOverviewStats(
        res.data?.data?.stats || {
          totalAdmins: 0,
          activePaid: 0,
          freeGrants: 0,
          trials: 0,
          expired: 0,
        }
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admins overview");
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setTransactionsLoading(true);
      const res = await axiosInstance.get("/subscriptions/transactions");
      setTransactions(res.data?.data?.transactions || []);
      setTransactionStats(
        res.data?.data?.stats || {
          totalRevenue: 0,
          totalPaidCount: 0,
          totalFreeCount: 0,
          totalTransactions: 0,
        }
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load transactions");
    } finally {
      setTransactionsLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
    loadAdminsOverview();
    loadTransactions();
  }, []);

  // ==========================================
  // PLAN HANDLERS
  // ==========================================

  const handleOpenCreatePlan = () => {
    setPlanForm(initialPlanForm);
    setFeatureInput("");
    setEditingPlanId(null);
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlanId(plan._id);
    setPlanForm({
      name: plan.name,
      description: plan.description || "",
      interval: plan.interval || "month",
      intervalCount: plan.intervalCount || 1,
      amount: plan.amount,
      storageLimitGb: plan.storageLimitGb || 10,
      features: Array.isArray(plan.features) && plan.features.length > 0
        ? [...plan.features]
        : initialPlanForm.features,
      isPopular: Boolean(plan.isPopular),
      badge: plan.badge || "",
    });
    setFeatureInput("");
    setShowPlanModal(true);
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setPlanForm((prev) => ({
      ...prev,
      features: [...prev.features, featureInput.trim()],
    }));
    setFeatureInput("");
  };

  const handleRemoveFeature = (idx) => {
    setPlanForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!planForm.name || planForm.amount === "" || !planForm.storageLimitGb) {
      toast.error("Please fill all required plan fields");
      return;
    }

    try {
      setPlanActionLoading(true);
      if (editingPlanId) {
        await axiosInstance.put(`/subscriptions/plans/${editingPlanId}`, planForm);
        toast.success("Subscription plan updated successfully");
      } else {
        await axiosInstance.post("/subscriptions/plans", planForm);
        toast.success("New subscription plan created successfully");
      }
      setShowPlanModal(false);
      setPlanForm(initialPlanForm);
      setEditingPlanId(null);
      await loadPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save plan");
    } finally {
      setPlanActionLoading(false);
    }
  };

  const handleTogglePlan = async (id) => {
    try {
      const res = await axiosInstance.patch(`/subscriptions/plans/${id}/status`);
      toast.success(res.data?.message || "Plan status updated");
      await loadPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to toggle plan status");
    }
  };

  const handleDeletePlan = async () => {
    if (!deletePlanId) return;
    try {
      setPlanActionLoading(true);
      await axiosInstance.delete(`/subscriptions/plans/${deletePlanId}`);
      toast.success("Plan permanently deleted");
      setDeletePlanId(null);
      await loadPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete plan");
    } finally {
      setPlanActionLoading(false);
    }
  };

  // ==========================================
  // FREE GRANT HANDLERS
  // ==========================================

  const handleOpenGrantModal = (adminData = null) => {
    if (adminData) {
      setSelectedAdminForGrant(adminData);
      setGrantForm({
        ...initialGrantForm,
        adminId: adminData._id || adminData.admin?._id,
        storageLimitGb: adminData.storageLimitGb || 20,
      });
    } else {
      setSelectedAdminForGrant(null);
      setGrantForm(initialGrantForm);
    }
    setShowGrantModal(true);
  };

  const handleGrantSubmit = async (e) => {
    e.preventDefault();
    if (!grantForm.adminId) {
      toast.error("Please select a Studio Administrator");
      return;
    }

    try {
      setGrantLoading(true);
      const res = await axiosInstance.post("/subscriptions/grant-free", grantForm);
      toast.success(res.data?.message || "Free VIP subscription granted successfully");
      setShowGrantModal(false);
      setGrantForm(initialGrantForm);
      await Promise.all([loadAdminsOverview(), loadTransactions()]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to grant free subscription");
    } finally {
      setGrantLoading(false);
    }
  };

  const handleRevokeSubmit = async () => {
    if (!revokeAdminData) return;
    const adminId = revokeAdminData.admin?._id || revokeAdminData._id;

    try {
      setRevokeLoading(true);
      const res = await axiosInstance.post(`/subscriptions/revoke/${adminId}`, {
        reason: revokeReason || "Revoked by Super Admin",
      });
      toast.success(res.data?.message || "Subscription revoked successfully");
      setRevokeAdminData(null);
      setRevokeReason("");
      await Promise.all([loadAdminsOverview(), loadTransactions()]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to revoke subscription");
    } finally {
      setRevokeLoading(false);
    }
  };

  // ==========================================
  // FILTERED DATA
  // ==========================================

  const filteredAdmins = adminsOverview.filter((item) => {
    const admin = item.admin || {};
    const matchesSearch =
      admin.name?.toLowerCase().includes(adminSearch.toLowerCase()) ||
      admin.email?.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (admin.phoneNumber && admin.phoneNumber.toString().includes(adminSearch));

    let matchesStatus = true;
    if (adminStatusFilter === "ActivePaid") matchesStatus = item.status === "active_paid";
    if (adminStatusFilter === "FreeGrant")
      matchesStatus = item.status === "free_grant" || item.status === "lifetime_free";
    if (adminStatusFilter === "Trial") matchesStatus = item.status === "trial";
    if (adminStatusFilter === "Expired") matchesStatus = item.status === "expired";

    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = transactions.filter((t) => {
    const user = t.userId || {};
    return (
      user.name?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      t.planName?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      t.razorpayOrderId?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      t.razorpayPaymentId?.toLowerCase().includes(transactionSearch.toLowerCase())
    );
  });

  return (
    <div className="space-y-7 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaCrown className="text-purple-600" /> Super Admin Billing Control
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Studio Subscription & Plans Hub
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Full governance: create/edit studio plans, grant free VIP subscriptions to admins, and monitor revenue.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleOpenGrantModal(null)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5"
          >
            <FaGift />
            <span>Grant Free VIP Pass</span>
          </button>

          <button
            onClick={handleOpenCreatePlan}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 transition transform hover:-translate-y-0.5"
          >
            <FaPlus />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "plans"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200"
          }`}
        >
          <FaCreditCard />
          <span>Subscription Plans ({plans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("admins")}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "admins"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200"
          }`}
        >
          <FaUsers />
          <span>Admin Subscriptions ({overviewStats.totalAdmins})</span>
        </button>

        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition whitespace-nowrap ${
            activeTab === "transactions"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-700 border border-gray-200"
          }`}
        >
          <FaHistory />
          <span>Transactions & Revenue (₹{transactionStats.totalRevenue.toLocaleString("en-IN")})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SUBSCRIPTION PLANS */}
      {/* ========================================================================= */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          {/* Plans Grid */}
          {plansLoading ? (
            <div className="py-20 text-center">
              <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading plans...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl">
                <FaCreditCard />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Subscription Plans Configured</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
                Create your first studio pricing tier so admins can subscribe and upload unlimited photoshoot memories.
              </p>
              <button
                onClick={handleOpenCreatePlan}
                className="mt-5 inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-purple-500/20 hover:bg-purple-700"
              >
                <FaPlus /> Create First Plan
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan) => {
                const isMonthly = plan.interval === "month" && plan.intervalCount === 1;
                const isYearly = plan.interval === "year" && plan.intervalCount === 1;
                const intervalText = isMonthly
                  ? "Monthly"
                  : isYearly
                  ? "Yearly"
                  : `Every ${plan.intervalCount} ${plan.interval}${plan.intervalCount > 1 ? "s" : ""}`;

                return (
                  <div
                    key={plan._id}
                    className={`relative bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-xl ${
                      plan.isPopular
                        ? "border-purple-400 ring-2 ring-purple-500/20"
                        : "border-gray-100"
                    } ${!plan.isActive ? "opacity-60 bg-gray-50/50" : ""}`}
                  >
                    {/* Top Badges */}
                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                            plan.isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {plan.isActive ? "● Active" : "○ Inactive / Hidden"}
                        </span>

                        {plan.isPopular && (
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <FaStar className="text-[10px]" /> Popular
                          </span>
                        )}

                        {plan.badge && !plan.isPopular && (
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                            {plan.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                      <p className="text-gray-500 text-xs mt-1 min-h-[32px]">
                        {plan.description || "Studio cloud management plan for high-res albums"}
                      </p>

                      {/* Pricing Tag */}
                      <div className="mt-5 flex items-baseline gap-1">
                        <span className="text-3xl md:text-4xl font-black text-gray-900">
                          ₹{plan.amount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-semibold text-gray-500">
                          / {intervalText}
                        </span>
                      </div>

                      {/* Storage Quota Card */}
                      <div className="mt-4 p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <FaHdd className="text-purple-600 text-lg" />
                          <div>
                            <p className="text-xs font-bold text-gray-900">Cloud Storage Quota</p>
                            <p className="text-[11px] text-purple-700 font-semibold">
                              {plan.storageLimitGb} GB Allocated
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Feature Checklist */}
                      <div className="mt-5 space-y-2.5">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Included Features
                        </p>
                        {(plan.features || []).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                            <FaCheckCircle className="text-emerald-500 text-sm mt-0.5 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleTogglePlan(plan._id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          plan.isActive
                            ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200"
                            : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200"
                        }`}
                        title={plan.isActive ? "Deactivate plan" : "Activate plan"}
                      >
                        <FaPowerOff />
                        <span>{plan.isActive ? "Deactivate" : "Activate"}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="p-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold transition text-xs flex items-center gap-1"
                          title="Edit plan"
                        >
                          <FaEdit /> <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeletePlanId(plan._id)}
                          className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition text-xs"
                          title="Delete plan"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDIO ADMIN SUBSCRIPTIONS */}
      {/* ========================================================================= */}
      {activeTab === "admins" && (
        <div className="space-y-6">
          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Admins</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{overviewStats.totalAdmins}</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Paid</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{overviewStats.activePaid}</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">VIP Free Grants</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{overviewStats.freeGrants}</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">In Trial</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">{overviewStats.trials}</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm col-span-2 sm:col-span-1">
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Expired</p>
              <p className="text-2xl font-black text-red-500 mt-1">{overviewStats.expired}</p>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search studio admin by name, email, phone..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: "All", value: "All" },
                { label: "Active Paid", value: "ActivePaid" },
                { label: "VIP Free", value: "FreeGrant" },
                { label: "Trial", value: "Trial" },
                { label: "Expired", value: "Expired" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setAdminStatusFilter(tab.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    adminStatusFilter === tab.value
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Admins Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {overviewLoading ? (
              <div className="py-20 text-center">
                <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading admin subscription records...</p>
              </div>
            ) : filteredAdmins.length === 0 ? (
              <div className="py-16 text-center">
                <FaUsers className="text-3xl text-gray-300 mx-auto mb-2" />
                <h4 className="font-bold text-gray-800">No Studio Admins Found</h4>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                      <th className="px-6 py-4">Studio Administrator</th>
                      <th className="px-6 py-4">Subscription Status</th>
                      <th className="px-6 py-4">Current Plan</th>
                      <th className="px-6 py-4">Storage Consumption</th>
                      <th className="px-6 py-4">Validity / Expiry</th>
                      <th className="px-6 py-4 text-right">VIP Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAdmins.map((item) => {
                      const adm = item.admin || {};
                      const isFree = item.isFreeGrant || item.status === "free_grant" || item.status === "lifetime_free";
                      const isPaid = item.status === "active_paid";
                      const isTrial = item.status === "trial";
                      const isExpired = item.status === "expired";

                      return (
                        <tr key={adm._id} className="hover:bg-purple-50/20 transition-colors">
                          {/* Admin Info */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  adm.profileImage ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    adm.name || "Admin"
                                  )}&background=8b5cf6&color=fff`
                                }
                                alt={adm.name}
                                className="w-10 h-10 rounded-2xl object-cover ring-2 ring-purple-500/10 shadow-sm"
                              />
                              <div>
                                <span className="font-bold text-sm text-gray-900 block">
                                  {adm.name}
                                </span>
                                <span className="text-xs text-gray-500 block">{adm.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isFree ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                <FaCrown className="text-amber-600 text-[11px]" />
                                <span>{item.isLifetime ? "VIP Lifetime Free" : "VIP Free Pass"}</span>
                              </span>
                            ) : isPaid ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                <FaCheckCircle className="text-emerald-600 text-[11px]" />
                                <span>Active Paid Plan</span>
                              </span>
                            ) : isTrial ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                                <span>Free Trial ({item.daysRemaining}d left)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                                <FaBan className="text-red-500 text-[11px]" />
                                <span>Expired / None</span>
                              </span>
                            )}
                          </td>

                          {/* Plan Name */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">
                                {item.planName}
                              </span>
                              {item.grantReason && (
                                <span className="text-[10px] text-gray-400 italic block truncate max-w-[160px]">
                                  Note: {item.grantReason}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Storage Consumption Meter */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-40">
                              <div className="flex justify-between text-[11px] font-semibold text-gray-600 mb-1">
                                <span>{item.usedGb} GB used</span>
                                <span>{item.storageLimitGb} GB</span>
                              </div>
                              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    item.usagePercentage >= 90
                                      ? "bg-red-500"
                                      : item.usagePercentage >= 70
                                      ? "bg-amber-500"
                                      : "bg-purple-600"
                                  }`}
                                  style={{ width: `${Math.min(100, item.usagePercentage)}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Expiry Date */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-700">
                              {item.isLifetime ? (
                                <span className="font-bold text-emerald-600">Lifetime Access</span>
                              ) : item.endDate ? (
                                <>
                                  <span className="font-semibold block">
                                    {new Date(item.endDate).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    {item.daysRemaining > 0
                                      ? `${item.daysRemaining} days remaining`
                                      : "Expired"}
                                  </span>
                                </>
                              ) : (
                                <span className="text-gray-400">No active plan</span>
                              )}
                            </div>
                          </td>

                          {/* VIP Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenGrantModal(adm)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition border border-amber-200"
                                title="Grant or modify free VIP access"
                              >
                                <FaGift className="text-amber-600" />
                                <span>Grant Free Pass</span>
                              </button>

                              {(isFree || isPaid) && (
                                <button
                                  onClick={() => setRevokeAdminData(item)}
                                  className="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition text-xs"
                                  title="Revoke / Cancel subscription"
                                >
                                  <FaBan />
                                </button>
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
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TRANSACTIONS & REVENUE HISTORY */}
      {/* ========================================================================= */}
      {activeTab === "transactions" && (
        <div className="space-y-6">
          {/* Revenue Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-700 to-indigo-700 p-6 rounded-3xl text-white shadow-lg shadow-purple-500/20">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Total Direct Revenue
              </p>
              <p className="text-3xl font-black mt-2">
                ₹{transactionStats.totalRevenue.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-purple-200 mt-1">Paid Razorpay Studio Subscriptions</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Paid Orders Completed
              </p>
              <p className="text-3xl font-black text-gray-900 mt-2">
                {transactionStats.totalPaidCount}
              </p>
              <p className="text-xs text-gray-400 mt-1">Directly paid via Razorpay</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Super Admin Free Grants
              </p>
              <p className="text-3xl font-black text-gray-900 mt-2">
                {transactionStats.totalFreeCount}
              </p>
              <p className="text-xs text-gray-400 mt-1">VIP Studio Access passes issued</p>
            </div>
          </div>

          {/* Search Transactions */}
          <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by admin name, email, plan or Order ID..."
                value={transactionSearch}
                onChange={(e) => setTransactionSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <button
              onClick={loadTransactions}
              className="px-4 py-2 rounded-2xl border text-gray-600 hover:text-purple-600 hover:bg-purple-50 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <FaSyncAlt /> Refresh
            </button>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {transactionsLoading ? (
              <div className="py-20 text-center">
                <FaSpinner className="animate-spin text-purple-600 text-3xl mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Loading transactions history...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="py-16 text-center">
                <FaHistory className="text-3xl text-gray-300 mx-auto mb-2" />
                <h4 className="font-bold text-gray-800">No Transactions Found</h4>
                <p className="text-xs text-gray-500 mt-1">
                  When studio admins subscribe or receive grants, orders will show up here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60 text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                      <th className="px-6 py-4">Studio Administrator</th>
                      <th className="px-6 py-4">Plan Name</th>
                      <th className="px-6 py-4">Amount (₹)</th>
                      <th className="px-6 py-4">Status & Type</th>
                      <th className="px-6 py-4">Order / Payment ID</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTransactions.map((tx) => {
                      const user = tx.userId || {};
                      const isFree = tx.isFreeGrant;

                      return (
                        <tr key={tx._id} className="hover:bg-purple-50/20 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <span className="font-bold text-sm text-gray-900 block">
                                {user.name || "Unknown Admin"}
                              </span>
                              <span className="text-xs text-gray-500 block">{user.email}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-bold text-gray-800">{tx.planName}</span>
                            <span className="text-[10px] text-purple-600 block">
                              {tx.storageLimitGb} GB Storage
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-black text-gray-900">
                              {isFree ? "Free Grant (₹0)" : `₹${tx.amount.toLocaleString("en-IN")}`}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {isFree ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                                Super Admin Free Grant
                              </span>
                            ) : tx.status === "active" ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                Active Paid
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-bold">
                                {tx.status}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-[11px] font-mono text-gray-600 space-y-0.5">
                              {tx.razorpayPaymentId && (
                                <p className="text-indigo-600 font-semibold">
                                  Pay ID: {tx.razorpayPaymentId}
                                </p>
                              )}
                              {tx.razorpayOrderId && (
                                <p className="text-gray-400">Order: {tx.razorpayOrderId}</p>
                              )}
                              {isFree && <p className="text-amber-700">VIP Override</p>}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                            {new Date(tx.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
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
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE / EDIT SUBSCRIPTION PLAN */}
      {/* ========================================================================= */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editingPlanId ? "Edit Subscription Plan" : "Create New Subscription Plan"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure studio pricing, cloud storage quotas, billing frequency, and feature perks.
                </p>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Studio Pro, Starter, Elite Studio"
                    value={planForm.name}
                    onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 999"
                    value={planForm.amount}
                    onChange={(e) => setPlanForm({ ...planForm, amount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. For professional wedding & event photographers"
                  value={planForm.description}
                  onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Storage Quota (GB) *
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    required
                    placeholder="e.g. 50"
                    value={planForm.storageLimitGb}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, storageLimitGb: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Billing Interval *
                  </label>
                  <select
                    value={planForm.interval}
                    onChange={(e) => setPlanForm({ ...planForm, interval: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                    <option value="week">Weekly</option>
                    <option value="day">Daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Interval Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="1"
                    value={planForm.intervalCount}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, intervalCount: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                  />
                </div>
              </div>

              {/* Marketing Badges & Highlight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 bg-purple-50 p-3 rounded-2xl border border-purple-100">
                  <input
                    type="checkbox"
                    id="isPopular"
                    checked={planForm.isPopular}
                    onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                    className="w-5 h-5 text-purple-600 rounded-lg focus:ring-purple-500"
                  />
                  <label htmlFor="isPopular" className="text-xs font-bold text-purple-900 cursor-pointer">
                    Mark as "Most Popular" Ribbon
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Custom Badge Tag (e.g. Best Value)"
                    value={planForm.badge}
                    onChange={(e) => setPlanForm({ ...planForm, badge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-800"
                  />
                </div>
              </div>

              {/* Features List */}
              <div className="pt-2 border-t">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Plan Features & Perks
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Type a feature (e.g. Priority 4K Album Rendering)..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {planForm.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700"
                    >
                      <span className="flex items-center gap-2">
                        <FaCheck className="text-emerald-500 text-[10px]" />
                        {feat}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={planActionLoading}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold shadow-md shadow-purple-500/20 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {planActionLoading && <FaSpinner className="animate-spin" />}
                  <span>{editingPlanId ? "Update Plan" : "Create Plan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: GRANT FREE VIP SUBSCRIPTION TO ADMIN */}
      {/* ========================================================================= */}
      {showGrantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-lg shadow-sm">
                  <FaGift />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Grant Free VIP Studio Pass
                  </h3>
                  <p className="text-xs text-gray-500">
                    Grant full studio privileges & storage to specific admin without payment.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGrantModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleGrantSubmit} className="space-y-4">
              {/* Select Admin */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Studio Administrator *
                </label>
                <select
                  required
                  value={grantForm.adminId}
                  onChange={(e) => setGrantForm({ ...grantForm, adminId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-gray-800 font-medium"
                >
                  <option value="">-- Choose Studio Admin --</option>
                  {adminsOverview.map((item) => {
                    const adm = item.admin || {};
                    return (
                      <option key={adm._id} value={adm._id}>
                        {adm.name} ({adm.email}) - Current: {item.planName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Custom Plan Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Pass Title / Badge Name
                </label>
                <input
                  type="text"
                  value={grantForm.customPlanName}
                  onChange={(e) => setGrantForm({ ...grantForm, customPlanName: e.target.value })}
                  placeholder="e.g. VIP Lifetime Free Studio Pass"
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm"
                />
              </div>

              {/* Storage Quota */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Storage Quota Allowance (GB) *
                </label>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {[10, 25, 50, 100, 500].map((gb) => (
                    <button
                      key={gb}
                      type="button"
                      onClick={() => setGrantForm({ ...grantForm, storageLimitGb: gb })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                        grantForm.storageLimitGb === gb
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {gb} GB
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  required
                  value={grantForm.storageLimitGb}
                  onChange={(e) =>
                    setGrantForm({ ...grantForm, storageLimitGb: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-sm font-bold text-gray-800"
                />
              </div>

              {/* Validity Options */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-amber-900">Grant Lifetime Validity</p>
                    <p className="text-[11px] text-amber-700">Never expires (100-year validity)</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={grantForm.isLifetime}
                    onChange={(e) => setGrantForm({ ...grantForm, isLifetime: e.target.checked })}
                    className="w-5 h-5 text-amber-600 rounded-lg focus:ring-amber-500"
                  />
                </div>

                {!grantForm.isLifetime && (
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                      Or Specific Days Validity
                    </label>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {[30, 90, 180, 365].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setGrantForm({ ...grantForm, durationDays: d })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            grantForm.durationDays === d
                              ? "bg-amber-600 text-white"
                              : "bg-white text-amber-900 border border-amber-200"
                          }`}
                        >
                          {d} Days {d === 365 ? "(1 Year)" : ""}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min="1"
                      value={grantForm.durationDays}
                      onChange={(e) =>
                        setGrantForm({ ...grantForm, durationDays: Number(e.target.value) })
                      }
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-xs font-bold text-gray-800"
                    />
                  </div>
                )}
              </div>

              {/* Reason / Audit Note */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Internal Reason / Note
                </label>
                <textarea
                  rows={2}
                  value={grantForm.reason}
                  onChange={(e) => setGrantForm({ ...grantForm, reason: e.target.value })}
                  placeholder="e.g. VIP Partner Studio complimentary pass"
                  className="w-full px-4 py-2 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white text-xs text-gray-800"
                />
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowGrantModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={grantLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm font-bold shadow-md shadow-amber-500/20 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {grantLoading && <FaSpinner className="animate-spin" />}
                  <span>Grant Free VIP Pass Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: REVOKE SUBSCRIPTION CONFIRMATION */}
      {/* ========================================================================= */}
      {revokeAdminData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaBan />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Revoke Studio Subscription?
            </h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to revoke the active subscription for{" "}
              <strong className="text-gray-900">{revokeAdminData.admin?.name}</strong>? Their status will immediately switch to Expired.
            </p>

            <div className="mt-4 text-left">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Revocation Reason (Optional)
              </label>
              <input
                type="text"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="e.g. Terms violation or admin requested cancellation"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs"
              />
            </div>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setRevokeAdminData(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
              >
                Keep Active
              </button>
              <button
                onClick={handleRevokeSubmit}
                disabled={revokeLoading}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition disabled:opacity-50 flex items-center gap-2"
              >
                {revokeLoading && <FaSpinner className="animate-spin" />}
                <span>Confirm Revoke</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DELETE PLAN CONFIRMATION */}
      {deletePlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FaTrash />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Permanently Delete Plan?</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              This will delete this plan template permanently. Existing active studio subscriptions will not be affected.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeletePlanId(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlan}
                disabled={planActionLoading}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition disabled:opacity-50 flex items-center gap-2"
              >
                {planActionLoading && <FaSpinner className="animate-spin" />}
                <span>Delete Plan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}