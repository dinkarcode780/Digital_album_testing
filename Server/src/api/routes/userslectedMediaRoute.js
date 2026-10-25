import express from "express";
import {
  saveUserSelectedMedia,
  toggleMediaSelection,
  getMySelectedMedia,
  submitUserSelectedMedia,
  removeMediaFromSelection,
  clearUserSelectedMedia,
  getAllUserSelectedMedia,
  getUserSelectedMediaById,
  updateSelectionStatus,
  deleteUserSelectedMedia,
} from "../controllers/userslectedMediaController.js";
import { isAdmin, isUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= USER ROUTES =================
// 1. Bulk save / update selected media (also supports previous route name)
router.post("/users/saveUserSelectedMedia", isUser, saveUserSelectedMedia);
router.post("/users/userslectedMedia", isUser, saveUserSelectedMedia);

// 2. Toggle favorite / single media selection (ideal for heart / checkmark button)
router.post("/users/toggleMediaSelection", isUser, toggleMediaSelection);
router.post("/users/toggleFavoriteMedia", isUser, toggleMediaSelection);

// 3. Get logged in user's selected media / favorites list (with event details)
router.get("/users/getMySelectedMedia", isUser, getMySelectedMedia);
router.get("/users/getMyFavorites", isUser, getMySelectedMedia);

// 4. Submit & Lock selected media for admin review
router.put("/users/submitUserSelectedMedia", isUser, submitUserSelectedMedia);

// 5. Remove single media from selection
router.delete("/users/removeMediaFromSelection", isUser, removeMediaFromSelection);

// 6. Clear all selected media for an event
router.delete("/users/clearUserSelectedMedia", isUser, clearUserSelectedMedia);

// 7. Get single selection detail by ID (User / Admin)
router.get("/users/getUserSelectedMediaById", isUser, getUserSelectedMediaById);


// ================= ADMIN ROUTES =================
// 8. Get all user selections with filters & pagination
router.get("/admin/getAllUserSelectedMedia", isAdmin, getAllUserSelectedMedia);

// 9. Get user selection by ID (Admin)
router.get("/admin/getUserSelectedMediaById", isAdmin, getUserSelectedMediaById);

// 10. Update status (Approved, Reviewed, Rejected), admin notes & lock status
router.put("/admin/updateSelectionStatus", isAdmin, updateSelectionStatus);

// 11. Delete a user selection record
router.delete("/admin/deleteUserSelectedMedia", isAdmin, deleteUserSelectedMedia);

export default router;