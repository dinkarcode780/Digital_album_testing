import Media from "../../models/mediaModel.js";
import Subscription from "../../models/subscriptionModel.js";

const getStudioUsageBytes = async (adminId) => {
  const result = await Media.aggregate([
    { $lookup: { from: "events", localField: "eventId", foreignField: "_id", as: "event" } },
    { $unwind: "$event" },
    { $lookup: { from: "users", localField: "event.userId", foreignField: "_id", as: "client" } },
    { $unwind: "$client" },
    { $match: { "client.ownerAdminId": adminId } },
    { $group: { _id: null, bytes: { $sum: "$fileSizeBytes" } } },
  ]);

  return result[0]?.bytes || 0;
};

const checkStorageQuota = async (req, res, next) => {
  if (req.user.userType !== "Admin") return next();

  const subscription = await Subscription.findOne({
    userId: req.user._id,
    status: "active",
    $or: [
      { isLifetime: true },
      { endDate: { $gt: new Date() } },
    ],
  }).sort({ endDate: -1, createdAt: -1 });

  const trialIsActive =
    req.user.subscriptionStatus === "trial" &&
    req.user.trialEndsAt &&
    new Date(req.user.trialEndsAt) > new Date();

  if (!subscription && !trialIsActive) {
    return res.status(402).json({
      success: false,
      message: "An active studio subscription is required before uploading media",
      code: "SUBSCRIPTION_REQUIRED",
    });
  }

  const effectiveStorageLimitGb = subscription?.storageLimitGb || 2; // 2GB default for active trial
  const mediaFiles = req.files?.mediaFiles || [];
  const replacementFiles = req.files?.mediaFile || [];
  const incomingBytes = [...mediaFiles, ...replacementFiles].reduce(
    (total, file) => total + (file.size || file.buffer?.length || 0),
    0
  );
  const existingMedia = req.body?.mediaId
    ? await Media.findById(req.body.mediaId).select("fileSizeBytes")
    : null;
  const currentUsageBytes = Math.max(
    0,
    (await getStudioUsageBytes(req.user._id)) - (existingMedia?.fileSizeBytes || 0)
  );
  const limitBytes = effectiveStorageLimitGb * 1024 * 1024 * 1024;

  if (currentUsageBytes + incomingBytes > limitBytes) {
    return res.status(413).json({
      success: false,
      message: `Storage limit exceeded. Your plan includes ${effectiveStorageLimitGb} GB.`,
      code: "STORAGE_LIMIT_EXCEEDED",
      data: {
        usedBytes: currentUsageBytes,
        requestedBytes: incomingBytes,
        limitBytes,
        storageLimitGb: effectiveStorageLimitGb,
      },
    });
  }

  req.storage = {
    usedBytes: currentUsageBytes,
    limitBytes,
    storageLimitGb: effectiveStorageLimitGb,
  };
  next();
};

export { getStudioUsageBytes, checkStorageQuota };
