import { useEffect, useState } from "react";
import { FaCheckCircle, FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios";

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const intervalLabel = (plan) => `${plan.intervalCount} ${plan.interval}${plan.intervalCount > 1 ? "s" : ""}`;

export default function Subscription() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const loadData = async () => {
    try {
      const [plansResponse, subscriptionResponse] = await Promise.all([
        axiosInstance.get("/subscriptions/plans"),
        axiosInstance.get("/subscriptions/me"),
      ]);
      setPlans(plansResponse.data.data || []);
      setSubscription(subscriptionResponse.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const payForPlan = async (plan) => {
    setPayingId(plan._id);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay checkout could not load");

      const [{ data: orderResponse }, { data: configResponse }] = await Promise.all([
        axiosInstance.post("/subscriptions/order", { planId: plan._id }),
        axiosInstance.get("/subscriptions/config"),
      ]);

      const options = {
        key: configResponse.keyId,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "Digital Album",
        description: plan.name,
        order_id: orderResponse.data.orderId,
        prefill: { name: JSON.parse(localStorage.getItem("user") || "{}").name || "" },
        handler: async (response) => {
          try {
            await axiosInstance.post("/subscriptions/verify", {
              ...response,
              subscriptionId: orderResponse.data.subscriptionId,
            });
            toast.success("Subscription activated successfully");
            await loadData();
          } catch (error) {
            toast.error(error.response?.data?.message || "Payment verification failed");
          }
        },
        theme: { color: "#4f46e5" },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Unable to start payment");
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading subscription plans...</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Membership</p>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Choose your access plan</h1>
        <p className="text-gray-600 mt-2">Keep your albums, events and media access active with a flexible plan.</p>
      </div>

      {subscription?.status === "active" && subscription.endDate > new Date().toISOString() && (
        <div className="mb-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <FaCheckCircle className="inline mr-2" /> Active until {new Date(subscription.endDate).toLocaleDateString()}
        </div>
      )}
      {subscription?.status === "trial" && subscription.endDate > new Date().toISOString() && (
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <FaCheckCircle className="inline mr-2" /> Free trial ends on {new Date(subscription.endDate).toLocaleDateString()}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
            <p className="text-gray-500 mt-2 min-h-10">{plan.description || "Full Digital Album access"}</p>
            <div className="mt-6 text-3xl font-bold text-indigo-700">₹{plan.amount}<span className="text-sm text-gray-500 font-normal"> / {intervalLabel(plan)}</span></div>
            <button
              onClick={() => payForPlan(plan)}
              disabled={payingId === plan._id}
              className="mt-6 w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              <FaCreditCard className="inline mr-2" /> {payingId === plan._id ? "Opening checkout..." : "Subscribe now"}
            </button>
          </article>
        ))}
      </div>
      {!plans.length && <p className="text-center text-gray-500">No active plans are available yet.</p>}
    </section>
  );
}