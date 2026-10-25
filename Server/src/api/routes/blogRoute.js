import {
  createBlog,
  deleteBlog,
  getBlogByFilter,
  getBlogById,
  updateBlog,
} from "../controllers/blogController.js";
import express from "express";
import { upload } from "../middleware/multerS3.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }
    next();
  });
};

router.post("/admin/createBlog", isAdmin, uploadSingle("image"), createBlog);
router.put("/admin/updateBlog", isAdmin, uploadSingle("image"), updateBlog);
router.delete("/admin/deleteBlog", isAdmin, deleteBlog);
router.get("/admin/getBlogs", isAdmin, getBlogByFilter);
router.get("/admin/getBlogById", isAdmin, getBlogById);
router.get("/admin/getBlogById/:id", isAdmin, getBlogById);

// Public / User read endpoints
router.get("/users/getBlogById", getBlogById);
router.get("/users/getBlogById/:id", getBlogById);
router.get("/users/getBlogByFilter", getBlogByFilter);

router.get("/public/blogs", getBlogByFilter);
router.get("/public/blogs/:id", getBlogById);

export default router;