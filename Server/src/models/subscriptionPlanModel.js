import mongoose from "mongoose";

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    interval: {
      type: String,
      enum: ["day", "week", "month", "year"],
      required: true,
    },
    intervalCount: { type: Number, required: true, min: 1, default: 1 },
    amount: { type: Number, required: true, min: 0 },
    storageLimitGb: { type: Number, required: true, min: 0.1, default: 1 },
    features: {
      type: [String],
      default: [],
    },
    isPopular: { type: Boolean, default: false },
    badge: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);