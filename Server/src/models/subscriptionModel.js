import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", default: null },
    planName: { type: String, required: true },
    interval: { type: String, default: "month" },
    intervalCount: { type: Number, default: 1 },
    amount: { type: Number, default: 0 },
    storageLimitGb: { type: Number, required: true, min: 0.1, default: 1 },
    status: {
      type: String,
      enum: ["created", "active", "failed", "expired", "cancelled"],
      default: "created",
    },
    isFreeGrant: { type: Boolean, default: false },
    isLifetime: { type: Boolean, default: false },
    grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    grantReason: { type: String, trim: true, default: "" },
    startDate: Date,
    endDate: Date,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  { timestamps: true },
);

subscriptionSchema.index({ userId: 1, status: 1, endDate: 1 });
subscriptionSchema.index({ razorpayOrderId: 1 });

export default mongoose.model("Subscription", subscriptionSchema);