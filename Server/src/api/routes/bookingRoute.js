import express from "express";
import {
  createBooking,
  getUserBookings,
  getStudioBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getBookingRazorpayConfig,
  createBookingRazorpayOrder,
  verifyBookingRazorpayPayment,
  addBookingPayment,
} from "../controllers/bookingController.js";
import { isUser, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Razorpay Booking Payment Routes
router.get("/booking/razorpay/config", isUser, getBookingRazorpayConfig);
router.post("/booking/razorpay/order", isUser, createBookingRazorpayOrder);
router.post("/booking/razorpay/verify", isUser, verifyBookingRazorpayPayment);

// Standard Booking CRUD (User must be logged in)
router.post("/booking/create", isUser, createBooking);
router.post("/booking/:id/payment", isUser, addBookingPayment);
router.get("/booking/user", isUser, getUserBookings);
router.get("/booking/studio", isAdmin, getStudioBookings);
router.get("/booking/:id", isUser, getBookingById);
router.put("/booking/status/:id", isUser, updateBookingStatus);
router.put("/booking/cancel/:id", isUser, cancelBooking);

export default router;
