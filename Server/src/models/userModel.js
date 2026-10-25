import mongoose from "mongoose";
import { hashValue } from "../utils/hashValue.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    phoneNumber: {
      type: Number,
      sparse: true,
    },
    password: {
      type: String,
    },
    resetOTP: {
      type: String,
      trim: true,
    },
    resetOTPExpires: {
      type: Date,
    },

    userType: {
      type: String,
      enum: ["SuperAdmin","Admin", "User",],
      default: "User",
    },

    ownerAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    profileImage: {
      type: String,
    },

    publicId: {
      type: String,
    },

    address: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },

    subscriptionStatus: {
      type: String,
      enum: ["trial", "active", "expired"],
      default: "trial",
    },

    trialEndsAt: {
      type: Date,
      default: () => new Date(Date.now() + Number(process.env.SUBSCRIPTION_TRIAL_DAYS || 7) * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;

const createDefaultAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existingSuperAdmin = await User.findOne({ email });

  if (!existingSuperAdmin) {
    const hashedPassword = await hashValue(password);

    await User.create({
      name: "Super Admin",
      email,
      password: hashedPassword,
      userType: "SuperAdmin",
    });

    console.log("Default super admin created successfully");
  } else {
    console.log("Default super admin already exists");
  }
};

export { createDefaultAdmin };
