import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    features: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
      default: "FaCamera",
      trim: true,
    },
    mediaUrl: {
      type: String,
      default: "",
    },
    mediaType: {
      type: String,
      enum: ["Image", "Video"],
      default: "Image",
    },
    publicId: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ createdBy: 1, isActive: 1 });
serviceSchema.index({ adminId: 1 });

const Service = mongoose.model("Service", serviceSchema);

export default Service;