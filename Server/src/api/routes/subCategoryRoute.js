import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategoryByFilter,
  getSubCategoryById,
  updateSubCategory,
} from "../controllers/subCategoryController.js";
import { isAdmin, isUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/admin/createSubcategory", isAdmin, createSubCategory);

router.put("/admin/updateSubCategory", isAdmin, updateSubCategory);

router.get("/admin/getSubCategoryById", isUser, getSubCategoryById);

router.get("/admin/getSubCategoryByFilter", isUser, getSubCategoryByFilter);

router.delete("/admin/deleteSubCategory", isAdmin, deleteSubCategory);

export default router;
