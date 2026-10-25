import express from "express";
import {
  adminLogin,
  adminLogout,
  adminUpdateProfile,
  getAdminById,
  userIsActive,
  getAllAdmins,
  getMyClients,
  assignClientToAdmin,
  createAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";
import { upload } from "../middleware/multerS3.js";
import { isAdmin, isSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/admin/adminLogin", adminLogin);
router.post("/admin/register", isSuperAdmin, createAdmin);

// Protected routes (authentication required)
router.post("/admin/createAdmin", isSuperAdmin, createAdmin);
router.get("/admin/getAllAdmins", isSuperAdmin, getAllAdmins);
router.delete("/admin/deleteAdmin", isSuperAdmin, deleteAdmin);
router.get("/admin/getMyClients", isAdmin, getMyClients);
router.post("/admin/assignClientToAdmin", isSuperAdmin, assignClientToAdmin);
router.put("/admin/adminUpdateProfile", isAdmin, upload.single("profileImage"), adminUpdateProfile);
router.get("/admin/getAdminById", isAdmin, getAdminById);
router.put("/admin/userIsActive", isAdmin, userIsActive);
router.get("/admin/adminLogout", isAdmin, adminLogout);

export default router;