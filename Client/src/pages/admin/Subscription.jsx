import React, { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCreditCard,
  FaCrown,
  FaGift,
  FaHdd,
  FaShieldAlt,
  FaClock,
  FaHistory,
  FaStar,
  FaCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaArrowRight,
  FaLayerGroup,
} from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function AdminSubscription() {
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [storage, setStorage] = useState({ usedBytes: 0, limitBytes: 0, storageLimitGb: 0, percentage: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, subRes, storageRes, historyRes] = await Promise.all([
        axiosInstance.get("/subscriptions/plans"),
        axiosInstance.get("/subscriptions/me"),
        axiosInstance.get("/subscriptions/storage"),
        axiosInstance.get("/subscriptions/my-history").catch(() => ({ data: { data: [] } })),
      ]);

      setPlans((plansRes.data?.data || []).filter((plan) => plan.isActive));
      setSubscription(subRes.data?.data || null);
      setStorage(storageRes.data?.data || { usedBytes: 0, limitBytes: 0, storageLimitGb: 0, percentage: 0 });
      setHistory(historyRes.data?.data || []);
    } catch (error) {
      console.error("Error loading subscription data:", error);
      toast.error(error.response?.data?.message || "Unable to load studio subscription details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const usedGb = (storage.usedBytes / (1024 ** 3)).toFixed(2);
  const usagePercent = storage.percentage || (storage.limitBytes ? Math.min(100, (storage.usedBytes / storage.limitBytes) * 100) : 0);

  const payForPlan = async (plan) => {
    setPayingId(plan._id);
    try {
      const isLoaded = await loadRazorpay();
      if (!isLoaded) throw new Error("Razorpay checkout SDK failed to load. Please check your internet connection.");

      const [{ data: orderResponse }, { data: configResponse }] = await Promise.all([
        axiosInstance.post("/subscriptions/order", { planId: plan._id }),
        axiosInstance.get("/subscriptions/config"),
      ]);

      const options = {
        key: configResponse.keyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: admin.name || "Digital Album Studio",
        description: `${plan.name} - ${plan.storageLimitGb} GB Cloud Storage`,
        order_id: orderResponse.data.orderId,
        prefill: {
          name: admin.name || "",
          email: admin.email || "",
          contact: admin.phoneNumber || "",
        },
        theme: { color: "#7c3aed" },
        handler: async (response) => {
          try {
            await axiosInstance.post("/subscriptions/verify", {
              ...response,
              subscriptionId: orderResponse.data.subscriptionId,
            });
            toast.success("🎉 Studio subscription activated successfully!");
            await loadData();
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description || "Transaction rejected"}`);
      });
      razorpayInstance.open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to start checkout");
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <FaSpinner className="animate-spin text-purple-600 text-4xl mx-auto mb-3" />
        <p className="text-gray-500 font-semibold text-sm">Loading studio billing details...</p>
      </div>
    );
  }

  const isFreeVIP = subscription?.isFreeGrant;
  const isLifetime = subscription?.isLifetime;
  const isActivePaid = subscription?.status === "active" && !isFreeVIP;
  const isTrial = subscription?.status === "trial";
  const isExpired = subscription?.status === "expired" || !subscription?.isActive;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FaCreditCard className="text-purple-600" /> Studio Subscription & Billing
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {admin.name ? `${admin.name}'s Studio Billing` : "Studio Billing & Cloud Storage"}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage your photoshoot cloud storage, active studio plans, and payment receipts.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CURRENT SUBSCRIPTION STATUS HERO CARD */}
      {/* ========================================================================= */}
      {isFreeVIP ? (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-amber-500/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/20 backdrop-blur-md text-amber-100 text-xs font-bold uppercase tracking-wider">
                <FaCrown className="text-amber-300" /> Super Admin VIP Complimentary Pass
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                {subscription?.planName || "VIP Free Studio Access"}
              </h2>
              <p className="text-amber-100 text-sm leading-relaxed">
                You have been granted complimentary VIP Studio privileges by Super Admin. Enjoy premium cloud storage for your client albums without recurring fees!
              </p>
              {subscription?.grantReason && (
                <p className="text-xs text-amber-200/90 italic">
                  Note: "{subscription.grantReason}"
                </p>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center md:min-w-[200px] shrink-0">
              <p className="text-xs font-bold uppercase text-amber-200">Validity</p>
              <p className="text-xl font-black mt-1">
                {isLifetime ? "Lifetime VIP" : new Date(subscription.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <p className="text-xs text-amber-100 mt-0.5">
                {isLifetime ? "Never Expires" : `${subscription.daysRemaining} days remaining`}
              </p>
            </div>
          </div>
        </div>
      ) : isActivePaid ? (
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-purple-500/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <FaCheckCircle /> Active Studio Plan
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                {subscription?.planName || "Studio Pro"}
              </h2>
              <p className="text-purple-100 text-sm leading-relaxed">
                Your studio is active with full high-speed client gallery downloads and cloud storage.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center md:min-w-[200px] shrink-0">
              <p className="text-xs font-bold uppercase text-purple-200">Next Renewal / Expiry</p>
              <p className="text-xl font-black mt-1">
                {new Date(subscription.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <p className="text-xs text-purple-200 mt-0.5">
                {subscription.daysRemaining} days remaining
              </p>
            </div>
          </div>
        </div>
      ) : isTrial ? (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl shrink-0">
              <FaClock />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[11px] font-bold uppercase">
                Studio Free Trial
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">
                You have {subscription?.daysRemaining || 0} days left in your free studio trial
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Choose a plan below before your trial expires on{" "}
                <strong>
                  {subscription?.endDate
                    ? new Date(subscription.endDate).toLocaleDateString("en-IN")
                    : "soon"}
                </strong>{" "}
                to avoid any interruption in media uploads.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl shrink-0">
              <FaExclamationTriangle />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-red-200 text-red-900 text-[11px] font-bold uppercase">
                Subscription Required
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-1">
                Your studio subscription has expired or is inactive
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                Select a plan below to immediately activate your studio cloud storage and start uploading client memories.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STORAGE USAGE METER */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
              <FaHdd />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Cloud Storage Consumption</h3>
              <p className="text-xs text-gray-500">
                Total media, high-res photos and videos uploaded for all client events
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xl font-black text-gray-900">
              {usedGb} GB <span className="text-sm font-normal text-gray-500">/ {storage.storageLimitGb || 0} GB</span>
            </p>
            <p className="text-xs font-bold text-purple-600">{Math.round(usagePercent)}% Used</p>
          </div>
        </div>

        {/* Meter Progress Bar */}
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usagePercent >= 90
                ? "bg-red-500"
                : usagePercent >= 75
                ? "bg-amber-500"
                : "bg-gradient-to-r from-purple-600 to-indigo-600"
            }`}
            style={{ width: `${Math.min(100, usagePercent)}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>0 GB</span>
          <span>{Math.max(0, (storage.storageLimitGb - Number(usedGb))).toFixed(2)} GB Available</span>
          <span>{storage.storageLimitGb || 0} GB Max</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. AVAILABLE SUBSCRIPTION PLANS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-900">
            Available Studio Access Plans
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Upgrade or renew your studio subscription with instant online payment via Razorpay (UPI, Cards, NetBanking).
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
            <p className="text-gray-500 text-sm">
              No subscription plans are currently active. Please contact Super Admin.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const isMonthly = plan.interval === "month" && plan.intervalCount === 1;
              const isYearly = plan.interval === "year" && plan.intervalCount === 1;
              const intervalText = isMonthly
                ? "Month"
                : isYearly
                ? "Year"
                : `${plan.intervalCount} ${plan.interval}${plan.intervalCount > 1 ? "s" : ""}`;

              const isCurrentPlan = subscription?.planId === plan._id && subscription?.status === "active";

              return (
                <div
                  key={plan._id}
                  className={`relative bg-white rounded-3xl border transition-all duration-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl ${
                    plan.isPopular
                      ? "border-purple-400 ring-2 ring-purple-500/20 shadow-purple-500/5"
                      : "border-gray-100"
                  }`}
                >
                  {/* Popular Ribbon */}
                  {plan.isPopular && (
                    <div className="absolute -top-3 right-6">
                      <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-purple-500/20">
                        <FaStar className="text-[10px]" /> Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-black text-gray-900">{plan.name}</h3>
                    <p className="text-gray-500 text-xs mt-1 min-h-[32px]">
                      {plan.description || "Studio cloud management & client proofing"}
                    </p>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-black text-gray-900">
                        ₹{plan.amount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        / {intervalText}
                      </span>
                    </div>

                    {/* Storage Highlight */}
                    <div className="mt-4 p-3 rounded-2xl bg-purple-50 border border-purple-100 flex items-center gap-3">
                      <FaHdd className="text-purple-600 text-base" />
                      <div>
                        <p className="text-xs font-bold text-gray-900">{plan.storageLimitGb} GB Cloud Storage</p>
                        <p className="text-[11px] text-purple-700">Photoshoot & Event Cloud Hosting</p>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="mt-5 space-y-2.5">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Included Features
                      </p>
                      {(plan.features && plan.features.length > 0
                        ? plan.features
                        : [
                            "Unlimited Client Invites",
                            "High-Speed Album Delivery",
                            "Guest QR Code Access",
                            "Client Selection & Proofing",
                          ]
                      ).map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                          <FaCheck className="text-emerald-500 text-xs mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => payForPlan(plan)}
                    disabled={payingId === plan._id}
                    className={`mt-6 w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5 shadow-md ${
                      isCurrentPlan
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/20"
                    } disabled:opacity-50`}
                  >
                    {payingId === plan._id ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Opening Razorpay...</span>
                      </>
                    ) : isCurrentPlan ? (
                      <>
                        <FaCheckCircle />
                        <span>Extend Current Plan</span>
                      </>
                    ) : (
                      <>
                        <FaCreditCard />
                        <span>Subscribe for Studio</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. BILLING & PAYMENT HISTORY */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
            <FaFileInvoiceDollar />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Billing & Payment History</h3>
            <p className="text-xs text-gray-500">Record of your previous subscription invoices & grants</p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-xs text-gray-400">No payment history recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Storage</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Type / Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((item) => (
                  <tr key={item._id} className="text-xs text-gray-700">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{item.planName}</td>
                    <td className="py-3.5 px-4">{item.storageLimitGb} GB</td>
                    <td className="py-3.5 px-4 font-black">
                      {item.isFreeGrant ? "Free Grant (₹0)" : `₹${item.amount.toLocaleString("en-IN")}`}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.isFreeGrant ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          VIP Free Pass
                        </span>
                      ) : item.status === "active" ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Paid
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                      {item.razorpayPaymentId || item.razorpayOrderId || "Super Admin Grant"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}