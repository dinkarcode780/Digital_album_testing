import asyncHandler from "../../utils/asyncHandler.js";
import { compareValue, hashValue } from "../../utils/hashValue.js";
import jwt from "jsonwebtoken";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../middleware/multerS3.js";
import userModel from "../../models/userModel.js";
import { validatePassword } from "../../utils/validatePassword.js";

export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ success: false, message: passwordError });
  }

  const exists = await userModel.findOne({ email: email.trim().toLowerCase() });
  if (exists) {
    return res.status(409).json({
      success: false,
      message: "Admin with this email already exists",
    });
  }

  const hashedPassword = await hashValue(password);

  const admin = await userModel.create({
    name,
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    phoneNumber,
    address,
    userType: "Admin",
    ownerAdminId: null,
  });

  const adminResponse = admin.toObject();
  delete adminResponse.password;

  res.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: adminResponse,
  });
});

export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await userModel
    .find({ userType: "Admin" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Admins fetched successfully",
    data: admins,
  });
});

export const getMyClients = asyncHandler(async (req, res) => {
  const adminId = req.user?._id;

  const clients = await userModel
    .find({ userType: "User", ownerAdminId: adminId })
    .select("-password")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: "Clients fetched successfully",
    data: clients,
  });
});

export const assignClientToAdmin = asyncHandler(async (req, res) => {
  const targetUserId = req.body.userId || req.body.clientId;
  const targetAdminId = req.body.adminId;

  if (!targetUserId) {
    return res.status(400).json({
      success: false,
      message: "userId (or clientId) is required",
    });
  }

  const user = await userModel.findById(targetUserId).select("-password -resetOTP -resetOTPExpires -tokenVersion");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Client user not found",
    });
  }

  if (user.userType !== "User") {
    return res.status(400).json({
      success: false,
      message: "Only client users can be assigned to an admin",
    });
  }

  if (!targetAdminId) {
    user.ownerAdminId = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Client unassigned successfully",
      data: user,
    });
  }

  const admin = await userModel.findById(targetAdminId);

  if (!admin || !["Admin", "SuperAdmin"].includes(admin.userType)) {
    return res.status(404).json({
      success: false,
      message: "Valid studio admin not found",
    });
  }

  user.ownerAdminId = admin._id;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Client assigned to ${admin.name} successfully`,
    data: user,
  });
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email or password is missing",
    });
  }

  const admin = await userModel.findOne({
    email: email.trim().toLowerCase(),
    userType: { $in: ["Admin", "SuperAdmin"] },
  });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await compareValue(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ id: admin._id, tokenVersion: admin.tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const adminResponse = admin.toObject();
  delete adminResponse.password;
  delete adminResponse.resetOTP;
  delete adminResponse.resetOTPExpires;
  adminResponse.token = token;

  res.status(200).json({
    success: true,
    message: "Admin logged in successfully",
    data: adminResponse,
  });
});

export const adminUpdateProfile = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, address } = req.body;
  const adminId = req.user._id;

  const admin = await userModel.findById(adminId);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  if (req.file) {
    if (admin.publicId) {
      await deleteFromCloudinary(admin.publicId, "image");
    }

    const uploadResult = await uploadToCloudinary(req.file, "adminProfile");

    if (!uploadResult) {
      return res.status(400).json({
        success: false,
        message: "Profile image upload failed",
      });
    }

    admin.profileImage = uploadResult.secure_url;
    admin.publicId = uploadResult.public_id;
  }

  admin.name = name || admin.name;
  admin.email = email || admin.email;
  admin.phoneNumber = phoneNumber || admin.phoneNumber;
  admin.address = address || admin.address;

  await admin.save();

  const adminResponse = admin.toObject();
  delete adminResponse.password;
  delete adminResponse.resetOTP;
  delete adminResponse.resetOTPExpires;
  delete adminResponse.tokenVersion;

  res.status(200).json({
    success: true,
    message: "Admin profile updated successfully",
    data: adminResponse,
  });
});

export const getAdminById = asyncHandler(async (req, res) => {
  const { adminId } = req.query;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "adminId is required",
    });
  }

  const admin = await userModel.findById(adminId).select("-password -resetOTP -resetOTPExpires");

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Admin fetched successfully",
    data: admin,
  });
});

export const userIsActive = asyncHandler(async (req, res) => {
  const userId =
    req.body?.userId ||
    req.query?.userId ||
    req.body?.adminId ||
    req.query?.adminId;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId or adminId is required",
    });
  }

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (user.userType === "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Cannot change SuperAdmin active status",
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

export const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie("authorization");

  res
    .status(200)
    .json({ success: true, message: "Admin Log Out successfully" });
});

export const deleteAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.query;

  if (!adminId) {
    return res.status(400).json({
      success: false,
      message: "adminId is required",
    });
  }

  const admin = await userModel.findById(adminId);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  if (admin.userType === "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "SuperAdmin cannot be deleted",
    });
  }

  // Unassign any clients assigned to this admin
  await userModel.updateMany(
    { ownerAdminId: admin._id },
    { $set: { ownerAdminId: null } },
  );

  // Delete profile image from Cloudinary if exists
  if (admin.publicId) {
    try {
      await deleteFromCloudinary(admin.publicId, "image");
    } catch (err) {
    }
  }

  await userModel.findByIdAndDelete(adminId);

  res.status(200).json({
    success: true,
    message:
      "Admin deleted successfully and their clients have been moved to unassigned pool",
  });
});
