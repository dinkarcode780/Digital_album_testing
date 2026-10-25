import express from "express";
import { handleSubscriptionWebhook } from "../controllers/subscriptionController.js";

const router = express.Router();
router.post("/", handleSubscriptionWebhook);

export default router;