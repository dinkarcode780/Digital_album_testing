import Subscription from "../../models/subscriptionModel.js";

const hasActiveSubscription = async (userId) => {
  const subscription = await Subscription.findOne({
    userId,
    status: "active",
    $or: [
      { isLifetime: true },
      { endDate: { $gt: new Date() } },
    ],
  }).sort({ endDate: -1, createdAt: -1 });

  return subscription;
};

const isSubscribed = async (req, res, next) => {
  // Only Admin requires subscription; SuperAdmin and User are exempt
  if (req.user.userType !== "Admin") {
    return next();
  }

  const subscription = await hasActiveSubscription(req.user._id);

  let trialEndsAt = req.user.trialEndsAt;
  if (!trialEndsAt && req.user.subscriptionStatus === undefined) {
    trialEndsAt = new Date(Date.now() + Number(process.env.SUBSCRIPTION_TRIAL_DAYS || 7) * 24 * 60 * 60 * 1000);
    await req.user.updateOne({ subscriptionStatus: "trial", trialEndsAt });
  }

  const trialIsActive = req.user.subscriptionStatus === "trial" && trialEndsAt && new Date(trialEndsAt) > new Date();

  if (!subscription && !trialIsActive) {
    if (req.user.subscriptionStatus === "trial") {
      await req.user.updateOne({ subscriptionStatus: "expired" });
    }
    return res.status(402).json({
      success: false,
      message: "An active studio subscription is required",
      code: "SUBSCRIPTION_REQUIRED",
    });
  }

  req.subscription = subscription || {
    status: "trial",
    endDate: trialEndsAt,
    storageLimitGb: 2, // default 2GB for trial
  };
  next();
};

export { hasActiveSubscription, isSubscribed };