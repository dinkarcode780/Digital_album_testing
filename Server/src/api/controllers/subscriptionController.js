import crypto from "crypto";
import Razorpay from "razorpay";
import asyncHandler from "../../utils/asyncHandler.js";
import SubscriptionPlan from "../../models/subscriptionPlanModel.js";
import Subscription from "../../models/subscriptionModel.js";
import User from "../../models/userModel.js";
import { getStudioUsageBytes } from "../middleware/storageQuotaMiddleware.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getEndDate = (startDate, interval, intervalCount) => {
  const endDate = new Date(startDate);
  const count = Number(intervalCount);

  if (interval === "day") endDate.setDate(endDate.getDate() + count);
  if (interval === "week") endDate.setDate(endDate.getDate() + count * 7);
  if (interval === "month") endDate.setMonth(endDate.getMonth() + count);
  if (interval === "year") endDate.setFullYear(endDate.getFullYear() + count);

  return endDate;
};

// ==========================================
// PLAN MANAGEMENT (Super Admin & Admin)
// ==========================================

export const listPlans = asyncHandler(async (req, res) => {
  const filter = req.user?.userType === "SuperAdmin" ? {} : { isActive: true };
  const rawPlans = await SubscriptionPlan.find(filter).sort({ amount: 1 });

  const plans = rawPlans.map((plan) => {
    const obj = plan.toObject();
    return {
      ...obj,
      storageLimitGb: obj.storageLimitGb || 1,
      features: Array.isArray(obj.features) ? obj.features : [],
      isPopular: Boolean(obj.isPopular),
      badge: obj.badge || "",
    };
  });

  res.status(200).json({ success: true, data: plans });
});

export const createPlan = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    interval = "month",
    intervalCount = 1,
    amount,
    storageLimitGb,
    features = [],
    isPopular = false,
    badge = "",
  } = req.body;

  if (!name || amount === undefined || !storageLimitGb) {
    return res.status(400).json({
      success: false,
      message: "Plan name, amount and storage limit (GB) are required",
    });
  }

  const parsedFeatures = Array.isArray(features)
    ? features.filter(Boolean)
    : typeof features === "string"
    ? features.split("\n").map((f) => f.trim()).filter(Boolean)
    : [];

  const plan = await SubscriptionPlan.create({
    name: name.trim(),
    description: description ? description.trim() : "",
    interval,
    intervalCount: Math.max(1, Number(intervalCount)),
    amount: Math.max(0, Number(amount)),
    storageLimitGb: Math.max(0.1, Number(storageLimitGb)),
    features: parsedFeatures,
    isPopular: Boolean(isPopular),
    badge: badge ? badge.trim() : "",
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: "Subscription plan created successfully",
    data: plan,
  });
});

export const updatePlan = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    interval,
    intervalCount,
    amount,
    storageLimitGb,
    features,
    isPopular,
    badge,
    isActive,
  } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (interval !== undefined) updateData.interval = interval;
  if (intervalCount !== undefined) updateData.intervalCount = Math.max(1, Number(intervalCount));
  if (amount !== undefined) updateData.amount = Math.max(0, Number(amount));
  if (storageLimitGb !== undefined) updateData.storageLimitGb = Math.max(0.1, Number(storageLimitGb));
  if (isPopular !== undefined) updateData.isPopular = Boolean(isPopular);
  if (badge !== undefined) updateData.badge = badge ? badge.trim() : "";
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);

  if (features !== undefined) {
    updateData.features = Array.isArray(features)
      ? features.filter(Boolean)
      : typeof features === "string"
      ? features.split("\n").map((f) => f.trim()).filter(Boolean)
      : [];
  }

  const plan = await SubscriptionPlan.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!plan) {
    return res.status(404).json({ success: false, message: "Subscription plan not found" });
  }

  res.status(200).json({
    success: true,
    message: "Subscription plan updated successfully",
    data: plan,
  });
});

export const deletePlan = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
  if (!plan) {
    return res.status(404).json({ success: false, message: "Subscription plan not found" });
  }
  res.status(200).json({ success: true, message: "Subscription plan deleted successfully" });
});

export const togglePlanStatus = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findById(req.params.id);
  if (!plan) {
    return res.status(404).json({ success: false, message: "Subscription plan not found" });
  }

  plan.isActive = !plan.isActive;
  await plan.save();

  res.status(200).json({
    success: true,
    data: plan,
    message: plan.isActive ? "Plan activated successfully" : "Plan deactivated successfully",
  });
});

// ==========================================
// ADMIN BILLING & CHECKOUT
// ==========================================

export const getRazorpayConfig = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, keyId: process.env.RAZORPAY_KEY_ID });
});

export const getMySubscription = asyncHandler(async (req, res) => {
  const now = new Date();
  const subscription = await Subscription.findOne({
    userId: req.user._id,
    status: "active",
    $or: [{ isLifetime: true }, { endDate: { $gt: now } }],
  })
    .sort({ endDate: -1, createdAt: -1 })
    .populate("grantedBy", "name email");

  if (subscription) {
    const daysRemaining = subscription.isLifetime
      ? 9999
      : Math.max(0, Math.ceil((new Date(subscription.endDate) - now) / (1000 * 60 * 60 * 24)));

    return res.status(200).json({
      success: true,
      data: {
        ...subscription.toObject(),
        daysRemaining,
        isActive: true,
      },
    });
  }

  // If no active paid or free grant, check trial
  const trialEndsAt = req.user.trialEndsAt;
  const trialIsActive =
    req.user.subscriptionStatus === "trial" &&
    trialEndsAt &&
    new Date(trialEndsAt) > now;

  if (trialIsActive) {
    const daysRemaining = Math.max(0, Math.ceil((new Date(trialEndsAt) - now) / (1000 * 60 * 60 * 24)));
    return res.status(200).json({
      success: true,
      data: {
        status: "trial",
        planName: "Studio Free Trial",
        storageLimitGb: 2,
        startDate: req.user.createdAt,
        endDate: trialEndsAt,
        daysRemaining,
        isActive: true,
        isTrial: true,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: {
      status: "expired",
      planName: "Expired",
      storageLimitGb: 0,
      daysRemaining: 0,
      isActive: false,
    },
  });
});

export const getMyBillingHistory = asyncHandler(async (req, res) => {
  const subscriptions = await Subscription.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate("planId", "name interval amount storageLimitGb");

  res.status(200).json({ success: true, data: subscriptions });
});

export const getMyStorage = asyncHandler(async (req, res) => {
  const usageBytes =
    req.user.userType === "Admin" ? await getStudioUsageBytes(req.user._id) : 0;

  const now = new Date();
  const subscription = await Subscription.findOne({
    userId: req.user._id,
    status: "active",
    $or: [{ isLifetime: true }, { endDate: { $gt: now } }],
  }).sort({ endDate: -1 });

  let storageLimitGb = subscription?.storageLimitGb || 0;
  if (!subscription && req.user.subscriptionStatus === "trial") {
    storageLimitGb = 2; // trial 2 GB
  }

  const limitBytes = storageLimitGb * 1024 * 1024 * 1024;
  const percentage = limitBytes > 0 ? Math.min(100, (usageBytes / limitBytes) * 100) : 0;

  res.status(200).json({
    success: true,
    data: {
      usedBytes: usageBytes,
      limitBytes,
      storageLimitGb,
      percentage: Number(percentage.toFixed(1)),
    },
  });
});

export const createSubscriptionOrder = asyncHandler(async (req, res) => {
  const plan = await SubscriptionPlan.findOne({
    _id: req.body.planId,
    isActive: true,
  });

  if (!plan) {
    return res.status(404).json({ success: false, message: "Active subscription plan not found" });
  }

  const order = await razorpay.orders.create({
    amount: Math.round(plan.amount * 100),
    currency: "INR",
    receipt: `sub_${req.user._id}_${Date.now()}`.slice(0, 40),
    notes: { userId: String(req.user._id), planId: String(plan._id) },
  });

  const subscription = await Subscription.create({
    userId: req.user._id,
    planId: plan._id,
    planName: plan.name,
    interval: plan.interval,
    intervalCount: plan.intervalCount,
    amount: plan.amount,
    storageLimitGb: plan.storageLimitGb || 1,
    razorpayOrderId: order.id,
    status: "created",
  });

  res.status(201).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      subscriptionId: subscription._id,
    },
  });
});

export const verifySubscriptionPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    subscriptionId,
  } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const sigBuf = Buffer.from(expectedSignature);
  const receivedBuf = Buffer.from(razorpay_signature);
  if (sigBuf.length !== receivedBuf.length || !crypto.timingSafeEquals(sigBuf, receivedBuf)) {
    return res.status(400).json({ success: false, message: "Invalid payment signature" });
  }

  const subscription = await Subscription.findOne({
    _id: subscriptionId,
    userId: req.user._id,
    razorpayOrderId: razorpay_order_id,
  });

  if (!subscription) {
    return res.status(404).json({ success: false, message: "Subscription order not found" });
  }

  const now = new Date();
  const activeSubscription = await Subscription.findOne({
    userId: req.user._id,
    status: "active",
    $or: [{ isLifetime: true }, { endDate: { $gt: now } }],
  }).sort({ endDate: -1 });

  const startDate = activeSubscription?.endDate || now;

  subscription.status = "active";
  subscription.startDate = startDate;
  subscription.endDate = getEndDate(
    startDate,
    subscription.interval,
    subscription.intervalCount,
  );
  subscription.razorpayPaymentId = razorpay_payment_id;
  subscription.razorpaySignature = razorpay_signature;
  await subscription.save();

  await req.user.updateOne({ subscriptionStatus: "active" });

  res.status(200).json({
    success: true,
    message: "Studio subscription successfully activated",
    data: subscription,
  });
});

export const handleSubscriptionWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ success: false, message: "Webhook secret not configured" });
  }
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body)
    .digest("hex");

  if (!signature) {
    return res.status(400).json({ success: false, message: "Invalid webhook signature" });
  }
  const whSigBuf = Buffer.from(expectedSignature);
  const whRecBuf = Buffer.from(signature);
  if (whSigBuf.length !== whRecBuf.length || !crypto.timingSafeEquals(whSigBuf, whRecBuf)) {
    return res.status(400).json({ success: false, message: "Invalid webhook signature" });
  }

  const event = JSON.parse(req.body.toString("utf8"));
  const payment = event.payload?.payment?.entity;

  if (event.event === "payment.failed" && payment?.order_id) {
    await Subscription.findOneAndUpdate(
      { razorpayOrderId: payment.order_id },
      { status: "failed" },
    );
  }

  if (event.event === "payment.captured" && payment?.order_id) {
    const subscription = await Subscription.findOne({
      razorpayOrderId: payment.order_id,
      status: "created",
    });

    if (subscription) {
      const now = new Date();
      const activeSubscription = await Subscription.findOne({
        userId: subscription.userId,
        status: "active",
        $or: [{ isLifetime: true }, { endDate: { $gt: now } }],
      }).sort({ endDate: -1 });

      const startDate = activeSubscription?.endDate || now;
      subscription.status = "active";
      subscription.startDate = startDate;
      subscription.endDate = getEndDate(
        startDate,
        subscription.interval,
        subscription.intervalCount,
      );
      subscription.razorpayPaymentId = payment.id;
      await subscription.save();

      await User.findByIdAndUpdate(subscription.userId, { subscriptionStatus: "active" });
    }
  }

  res.status(200).json({ success: true });
});

// ==========================================
// SUPER ADMIN GOVERNANCE & FREE OVERRIDES
// ==========================================

export const getAdminSubscriptionsOverview = asyncHandler(async (req, res) => {
  const admins = await User.find({ userType: "Admin" })
    .select("name email phoneNumber address profileImage isActive subscriptionStatus trialEndsAt createdAt")
    .sort({ createdAt: -1 });

  const now = new Date();

  const overviewList = await Promise.all(
    admins.map(async (adm) => {
      const activeSub = await Subscription.findOne({
        userId: adm._id,
        status: "active",
        $or: [{ isLifetime: true }, { endDate: { $gt: now } }],
      })
        .sort({ endDate: -1, createdAt: -1 })
        .populate("grantedBy", "name email");

      const usageBytes = await getStudioUsageBytes(adm._id);
      let status = "expired";
      let planName = "None";
      let storageLimitGb = 0;
      let endDate = null;
      let isFreeGrant = false;
      let isLifetime = false;
      let daysRemaining = 0;

      if (activeSub) {
        isFreeGrant = Boolean(activeSub.isFreeGrant);
        isLifetime = Boolean(activeSub.isLifetime);
        planName = activeSub.planName;
        storageLimitGb = activeSub.storageLimitGb || 1;
        endDate = activeSub.endDate;
        daysRemaining = isLifetime
          ? 9999
          : Math.max(0, Math.ceil((new Date(activeSub.endDate) - now) / (1000 * 60 * 60 * 24)));
        status = isFreeGrant ? (isLifetime ? "lifetime_free" : "free_grant") : "active_paid";
      } else if (adm.subscriptionStatus === "trial" && adm.trialEndsAt && new Date(adm.trialEndsAt) > now) {
        status = "trial";
        planName = "Studio Trial";
        storageLimitGb = 2;
        endDate = adm.trialEndsAt;
        daysRemaining = Math.max(0, Math.ceil((new Date(adm.trialEndsAt) - now) / (1000 * 60 * 60 * 24)));
      } else {
        status = "expired";
        planName = "Expired / Inactive";
      }

      return {
        admin: adm,
        subscription: activeSub,
        status,
        planName,
        storageLimitGb,
        usageBytes,
        usedGb: Number((usageBytes / (1024 ** 3)).toFixed(2)),
        usagePercentage:
          storageLimitGb > 0
            ? Math.min(100, Number(((usageBytes / (storageLimitGb * 1024 ** 3)) * 100).toFixed(1)))
            : 0,
        endDate,
        daysRemaining,
        isFreeGrant,
        isLifetime,
        grantedBy: activeSub?.grantedBy || null,
        grantReason: activeSub?.grantReason || "",
      };
    })
  );

  const stats = {
    totalAdmins: admins.length,
    activePaid: overviewList.filter((item) => item.status === "active_paid").length,
    freeGrants: overviewList.filter(
      (item) => item.status === "free_grant" || item.status === "lifetime_free"
    ).length,
    trials: overviewList.filter((item) => item.status === "trial").length,
    expired: overviewList.filter((item) => item.status === "expired").length,
  };

  res.status(200).json({ success: true, data: { admins: overviewList, stats } });
});

export const grantFreeSubscription = asyncHandler(async (req, res) => {
  const {
    adminId,
    planId,
    customPlanName,
    storageLimitGb = 10,
    durationDays = 365,
    isLifetime = false,
    reason = "Granted VIP Access by Super Admin",
  } = req.body;

  if (!adminId) {
    return res.status(400).json({ success: false, message: "Admin ID is required" });
  }

  const admin = await User.findOne({ _id: adminId, userType: "Admin" });
  if (!admin) {
    return res.status(404).json({ success: false, message: "Studio Admin not found" });
  }

  let chosenPlan = null;
  if (planId) {
    chosenPlan = await SubscriptionPlan.findById(planId);
  }

  const finalPlanName =
    customPlanName ||
    (chosenPlan ? `${chosenPlan.name} (VIP Free)` : isLifetime ? "VIP Lifetime Free" : "VIP Free Pass");

  const finalStorageLimitGb = Math.max(
    0.5,
    Number(storageLimitGb) || chosenPlan?.storageLimitGb || 10
  );

  const now = new Date();
  let endDate;

  if (Boolean(isLifetime)) {
    endDate = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000); // 100 years
  } else {
    const days = Math.max(1, Number(durationDays) || 30);
    endDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  // Cancel any existing active subscriptions to cleanly apply new grant
  await Subscription.updateMany(
    { userId: adminId, status: "active" },
    { status: "cancelled" }
  );

  const subscription = await Subscription.create({
    userId: admin._id,
    planId: chosenPlan?._id || null,
    planName: finalPlanName,
    interval: isLifetime ? "lifetime" : "custom",
    intervalCount: 1,
    amount: 0,
    storageLimitGb: finalStorageLimitGb,
    status: "active",
    isFreeGrant: true,
    isLifetime: Boolean(isLifetime),
    grantedBy: req.user._id,
    grantReason: reason.trim(),
    startDate: now,
    endDate,
  });

  await admin.updateOne({ subscriptionStatus: "active" });

  res.status(200).json({
    success: true,
    message: `Free VIP subscription successfully granted to ${admin.name}`,
    data: subscription,
  });
});

export const revokeAdminSubscription = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const { reason = "Revoked by Super Admin" } = req.body;

  const admin = await User.findOne({ _id: adminId, userType: "Admin" });
  if (!admin) {
    return res.status(404).json({ success: false, message: "Studio Admin not found" });
  }

  await Subscription.updateMany(
    { userId: adminId, status: "active" },
    { status: "cancelled", grantReason: reason }
  );

  await admin.updateOne({ subscriptionStatus: "expired" });

  res.status(200).json({
    success: true,
    message: `Subscription for ${admin.name} has been revoked successfully`,
  });
});

export const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Subscription.find()
    .sort({ createdAt: -1 })
    .populate("userId", "name email phoneNumber profileImage")
    .populate("grantedBy", "name email");

  const totalRevenue = transactions
    .filter((t) => t.status === "active" && !t.isFreeGrant)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalPaidCount = transactions.filter((t) => t.status === "active" && !t.isFreeGrant).length;
  const totalFreeCount = transactions.filter((t) => t.isFreeGrant).length;

  res.status(200).json({
    success: true,
    data: {
      transactions,
      stats: {
        totalRevenue,
        totalPaidCount,
        totalFreeCount,
        totalTransactions: transactions.length,
      },
    },
  });
});
