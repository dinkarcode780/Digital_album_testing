import express from "express";
import {
  addShowcaseAlbum,
  createStudioService,
  createStudioTestimonial,
  deleteShowcaseAlbum,
  deleteStudioService,
  deleteStudioTestimonial,
  getAllStudioShowcases,
  getMyStudioProfile,
  toggleStudioFeatured,
  toggleStudioPublicStatus,
  updateMyStudioProfile,
  updateStudioService,
} from "../controllers/studioShowcaseController.js";
import { isAdmin, isSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Studio Showcase & Profile
router.get("/admin/studio-profile", isAdmin, getMyStudioProfile);
router.put("/admin/studio-profile", isAdmin, updateMyStudioProfile);
router.post("/admin/studio-showcase/albums", isAdmin, addShowcaseAlbum);
router.delete("/admin/studio-showcase/albums/:albumId", isAdmin, deleteShowcaseAlbum);

// Admin Services CRUD
router.post("/admin/studio-services", isAdmin, createStudioService);
router.put("/admin/studio-services/:id", isAdmin, updateStudioService);
router.delete("/admin/studio-services/:id", isAdmin, deleteStudioService);

// Admin Testimonials CRUD
router.post("/admin/studio-testimonials", isAdmin, createStudioTestimonial);
router.delete("/admin/studio-testimonials/:id", isAdmin, deleteStudioTestimonial);

// Super Admin Showcase Monitoring & Moderation
router.get("/super-admin/studio-showcases", isSuperAdmin, getAllStudioShowcases);
router.patch("/super-admin/studio-showcase/:adminId/feature", isSuperAdmin, toggleStudioFeatured);
router.patch("/super-admin/studio-showcase/:adminId/visibility", isSuperAdmin, toggleStudioPublicStatus);

export default router;
