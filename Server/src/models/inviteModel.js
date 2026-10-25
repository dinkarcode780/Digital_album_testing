import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phoneNumber: {
      type: Number,
    },

    inviteToken: {
      type: String,
    },

    expiresAt: {
      type: Date,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted"],
      default: "Pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
