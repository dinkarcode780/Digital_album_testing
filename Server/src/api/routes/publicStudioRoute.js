import express from "express";
import {
  getPublicStudioDetails,
  listPublicStudios,
  submitPublicBookingInquiry,
} from "../controllers/publicStudioController.js";

const router = express.Router();

// Public Studio Directory & Search
router.get("/public/studios", listPublicStudios);

// Public Studio Full Portfolio (About, Demo Albums, Services, Blogs, Testimonials)
router.get("/public/studios/:id", getPublicStudioDetails);

// Public Shoot Booking Inquiry
router.post("/public/book-inquiry", submitPublicBookingInquiry);

export default router;
