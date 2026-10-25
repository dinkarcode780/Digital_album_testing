import express from "express"
import { getAllInviteByFilter, inviteUser, verifyInvite } from "../controllers/inviteController.js";
import { isAdmin, isUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/admin/inviteUser",isAdmin,inviteUser);

router.get("/users/verifyInvite",isUser,isAdmin,verifyInvite);

router.get("/admin/getAllInviteByFilter",isUser,isAdmin,getAllInviteByFilter)

export default router;