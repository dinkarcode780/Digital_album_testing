import express from "express";
import {
  createPlan,
  createSubscriptionOrder,
  deletePlan,
  getAdminSubscriptionsOverview,
  getAllTransactions,
  getMyBillingHistory,
  getMyStorage,
  getMySubscription,
  getRazorpayConfig,
  grantFreeSubscription,
  listPlans,
  revokeAdminSubscription,
  togglePlanStatus,
  updatePlan,
  verifySubscriptionPayment,
} from "../controllers/subscriptionController.js";
import { isAdmin, isSuperAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public / Common Plan Listing
router.get("/subscriptions/plans", isAdmin, listPlans);

// Super Admin Plan Management
router.post("/subscriptions/plans", isSuperAdmin, createPlan);
router.put("/subscriptions/plans/:id", isSuperAdmin, updatePlan);
router.patch("/subscriptions/plans/:id/status", isSuperAdmin, togglePlanStatus);
router.delete("/subscriptions/plans/:id", isSuperAdmin, deletePlan);

// Super Admin Overview, Overrides & Transactions
router.get("/subscriptions/admin-overview", isSuperAdmin, getAdminSubscriptionsOverview);
router.post("/subscriptions/grant-free", isSuperAdmin, grantFreeSubscription);
router.post("/subscriptions/revoke/:adminId", isSuperAdmin, revokeAdminSubscription);
router.get("/subscriptions/transactions", isSuperAdmin, getAllTransactions);

// Studio Admin Billing & Storage
router.get("/subscriptions/config", isAdmin, getRazorpayConfig);
router.get("/subscriptions/me", isAdmin, getMySubscription);
router.get("/subscriptions/my-history", isAdmin, getMyBillingHistory);
router.get("/subscriptions/storage", isAdmin, getMyStorage);
router.post("/subscriptions/order", isAdmin, createSubscriptionOrder);
router.post("/subscriptions/verify", isAdmin, verifySubscriptionPayment);

export default router;