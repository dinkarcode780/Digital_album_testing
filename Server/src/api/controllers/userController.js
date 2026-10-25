import crypto from "crypto";
import asyncHandler from "../../utils/asyncHandler.js";
import userModel from "../../models/userModel.js";
import Booking from "../../models/bookingModel.js";
import { compareValue, hashValue } from "../../utils/hashValue.js";
import jwt from "jsonwebtoken";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../middleware/multerS3.js";
import { sendResetPasswordEmail } from "../middleware/nodemailer.js";
import { sendOtp } from "../../utils/sendOtp.js";
import { validatePassword } from "../../utils/validatePassword.js";
import { escapeRegex } from "../../utils/escapeRegex.js";

export const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber } = req.body;

  if (!name || !password || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ success: false, message: passwordError });
  }

  const existingUser = await userModel.findOne({ phoneNumber });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const hashPassword = await hashValue(password);

  const user = await userModel.create({
    name,
    email,
    password: hashPassword,
    phoneNumber,
    subscriptionStatus: "trial",
    trialEndsAt: new Date(Date.now() + Number(process.env.SUBSCRIPTION_TRIAL_DAYS || 7) * 24 * 60 * 60 * 1000),
  });

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.resetOTP;
  delete userResponse.resetOTPExpires;

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: userResponse,
  });
});

export const userLogin = asyncHandler(async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).json({
      success: false,
      message: "email or password is missing",
    });
  }

  const user = await userModel.findOne({ phoneNumber });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid phone number or password",
    });
  }

  const isMatch = await compareValue(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid phone number or password",
    });
  }

  const token = jwt.sign({ id: user._id, tokenVersion: user.tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.resetOTP;
  delete userResponse.resetOTPExpires;
  userResponse.token = token;

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: userResponse,
  });
});

export const userUpdateProfile = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, address} = req.body;
  const userId = req.user._id;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (req.file) {
    if (user.publicId) {
      await deleteFromCloudinary(user.publicId);
    }
    const cloudeResult = await uploadToCloudinary(
      req.file,
      "profileImages",
    );
    user.profileImage = cloudeResult.secure_url;
    user.publicId = cloudeResult.public_id;
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (address) user.address = address;

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.resetOTP;
  delete userResponse.resetOTPExpires;
  delete userResponse.tokenVersion;

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: userResponse,
  });
});

export const userChangePassword = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ success: false, message: passwordError });
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const isMatch = await compareValue(currentPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  const hashPassword = await hashValue(newPassword);
  user.password = hashPassword;
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully. Please log in again.",
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  const user = await userModel.findById(userId).select("-password -resetOTP -resetOTPExpires");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

export const userForgetPassword = asyncHandler(async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: "Email or Phone Number is required",
    });
  }

  let user;

  if (email) {
    user = await userModel.findOne({ email: email.trim() });
  } else {
    user = await userModel.findOne({ phoneNumber });
  }

  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If an account exists, a reset OTP has been sent",
    });
  }

  const otp = crypto.randomInt(100000, 999999).toString();

  const hashedOtp = await hashValue(otp);
  user.resetOTP = hashedOtp;
  user.resetOTPExpires = Date.now() + 5 * 60 * 1000; // 5 Minutes

  await user.save();

  // Send OTP
  if (email) {
    try {
      await sendResetPasswordEmail(user.email, otp);

      return res.status(200).json({
        success: true,
        message: "Password reset OTP sent to your email",
      });
    } catch (emailErr) {
      return res.status(500).json({
        success: false,
        message: emailErr?.message || "Failed to send reset email.",
      });
    }
  }

  if (phoneNumber) {
    try {
      const isSent = await sendOtp(user.phoneNumber, otp);

      if (!isSent) {
        return res.status(429).json({
          success: false,
          message: "OTP limit exceeded. Please try again later.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Password reset OTP sent to your phone number",
      });
    } catch (smsErr) {
      return res.status(500).json({
        success: false,
        message: smsErr?.message || "Failed to send SMS OTP.",
      });
    }
  }
});

export const userResetPassword = asyncHandler(async (req, res) => {
  const { email, phoneNumber, otp, newPassword } = req.body;

  if ((!email && !phoneNumber) || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email or Phone Number, OTP and New Password are required",
    });
  }

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return res.status(400).json({ success: false, message: passwordError });
  }

  let user;

  if (email) {
    user = await userModel.findOne({ email });
  } else {
    user = await userModel.findOne({ phoneNumber });
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (!user.resetOTP || !user.resetOTPExpires || user.resetOTPExpires < Date.now()) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  const isOtpValid = await compareValue(otp, user.resetOTP);
  if (!isOtpValid) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  const hashPassword = await hashValue(newPassword);

  user.password = hashPassword;
  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;
  user.tokenVersion = (user.tokenVersion || 0) + 1;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully. Please log in again.",
  });
});

export const getUserByFilter = asyncHandler(async (req, res) => {
  let {
    search = "",
    userType,
    isActive,
    ownerAdminId,
    page = 1,
    limit = 10,
  } = req.query;

  // Sync unassigned users who have existing bookings with a studio admin
  try {
    const unassignedWithBookings = await Booking.aggregate([
      { $match: { adminId: { $exists: true, $ne: null } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          latestAdminId: { $first: "$adminId" },
        },
      },
    ]);

    for (const item of unassignedWithBookings) {
      if (item._id && item.latestAdminId) {
        await userModel.updateOne(
          { _id: item._id, ownerAdminId: null, userType: "User" },
          { $set: { ownerAdminId: item.latestAdminId } }
        );
      }
    }
  } catch (syncErr) {
  }

  const filter = {};

  if (req.user) {
    if (req.user.userType === "Admin") {
      filter.ownerAdminId = req.user._id;
      filter.userType = "User";
    } else if (req.user.userType === "User") {
      filter._id = req.user._id;
      filter.userType = "User";
    } else if (req.user.userType === "SuperAdmin") {
      // SuperAdmin can filter by specific studio admin or unassigned
      if (ownerAdminId === "unassigned") {
        filter.ownerAdminId = null;
      } else if (ownerAdminId && ownerAdminId !== "All") {
        filter.ownerAdminId = ownerAdminId;
      }
    }
  }

  if (userType && userType !== "All") {
    filter.userType = userType;
  }

  if (
    isActive !== undefined &&
    isActive !== "" &&
    isActive !== "All"
  ) {
    filter.isActive = isActive === "true";
  }

  if (search.trim()) {
    const escapedSearch = escapeRegex(search.trim());
    const orConditions = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { email: { $regex: escapedSearch, $options: "i" } },
    ];

    if (!isNaN(search)) {
      orConditions.push({ phoneNumber: Number(search) });
    }

    filter.$or = orConditions;
  }

  page = Number(page);

  const totalUsers = await userModel.countDocuments(filter);

  let limitNumber = limit === "All" ? totalUsers || 1 : Number(limit);

  if (!limitNumber || limitNumber <= 0) limitNumber = 10;

  const skip = (page - 1) * limitNumber;

  const users = await userModel
    .find(filter)
    .select("-password")
    .populate("ownerAdminId", "name email phoneNumber")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: users,
    totalUsers,
    currentPage: page,
    totalPages: limit === "All" ? 1 : Math.ceil(totalUsers / limitNumber),
  });
});

export const userDeleteById = asyncHandler(async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  const user = await userModel.findByIdAndDelete(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const userLogout = asyncHandler(async (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const userId = req.query?.userId || req.body?.userId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.isActive = !user.isActive;

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.resetOTP;
  delete userResponse.resetOTPExpires;
  delete userResponse.tokenVersion;

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
    data: userResponse,
  });
});
