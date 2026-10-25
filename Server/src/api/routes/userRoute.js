import express from "express";
import { getUserByFilter, getUserById, toggleUserStatus, userDeleteById, userForgetPassword, userLogin, userLogout, userRegister, userResetPassword, userUpdateProfile, userChangePassword } from "../controllers/userController.js";
import { upload } from "../middleware/multerS3.js";
import { isAdmin, isUser } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/users/userRegister",userRegister);

router.post("/users/userLogin",userLogin);

router.put("/users/userUpdateProfile",isUser,upload.single("profileImage"),userUpdateProfile);

router.put("/users/userChangePassword",isUser,userChangePassword);

router.get("/users/getUserById",isUser,getUserById);

router.get("/users/getUserByFilter",isAdmin,getUserByFilter);

router.delete("/users/userDeleteById",isAdmin,userDeleteById);

router.post("/users/userForgetPassword",userForgetPassword);

router.post("/users/userResetPassword",userResetPassword);

router.get("/users/userLogout",isUser,userLogout);


router.put("/users/toggleUserStatus",isAdmin,toggleUserStatus)


export default router;