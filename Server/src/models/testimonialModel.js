import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientRole: {
      type: String,
      default: "Wedding Client",
      trim: true,
    },
    clientAvatar: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    eventName: {
      type: String,
      default: "Grand Wedding Shoot",
      trim: true,
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

testimonialSchema.index({ adminId: 1, isActive: 1 });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
