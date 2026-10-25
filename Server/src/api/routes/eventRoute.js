import express from "express";
import {
  createEvent,
  deleteEvent,
  getEventByFilter,
  getEventById,
  updateEvent,
} from "../controllers/eventController.js";
import { isAdmin, isUser } from "../middleware/authMiddleware.js";
import { isSubscribed } from "../middleware/subscriptionMiddleware.js";

const router = express.Router();

router.post("/admin/createEvent",isAdmin, createEvent);
router.put("/admin/updateEvent", isAdmin,updateEvent);
router.delete("/admin/deleteEvent", isAdmin,deleteEvent);
router.get("/admin/getEventById", isUser, isSubscribed, getEventById);
router.get("/admin/getEventByFilter", isUser, isSubscribed, getEventByFilter);

export default router;
