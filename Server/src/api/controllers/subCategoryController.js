import asyncHandler from "../../utils/asyncHandler.js";
import eventcategoryModel from "../../models/eventCateogoryModel.js";
import subcategoryModel from "../../models/subCategoryModel.js";
import { escapeRegex } from "../../utils/escapeRegex.js";


export const createSubCategory = asyncHandler(async (req, res) => {
  const { categoryId, name, description } = req.body;

  if (!categoryId || !name) {
    return res.status(400).json({
      success: false,
      message: "categoryId and name are required",
    });
  }

  const category = await eventcategoryModel.findById(categoryId);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Event category not found",
    });
  }

  const existingSubCategory = await subcategoryModel.findOne({
    categoryId,
    name: name.trim(),
  });

  if (existingSubCategory) {
    return res.status(400).json({
      success: false,
      message: "Sub category already exists",
    });
  }

  let subCategory = await subcategoryModel.create({
    categoryId,
    name,
    description,
  });

  subCategory = await subCategory.populate("categoryId", "name");

  res.status(201).json({
    success: true,
    message: "Sub category created successfully",
    data: subCategory,
  });
});


export const updateSubCategory = asyncHandler(async (req, res) => {
    const { subCategoryId ,name, description, isActive, categoryId } = req.body;

    if (!subCategoryId) {
        return res.status(400).json({
            success: false,
            message: "subCategoryId is required"
        });
    }

    const subCategory = await subcategoryModel.findById(subCategoryId);

    if (!subCategory) {
        return res.status(404).json({
            success: false,
            message: "Sub category not found"
        });
    }

    if (categoryId) {
        const category = await eventcategoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Event category not found"
            });
        }

        subCategory.categoryId = categoryId;
    }

    if (name) {
        subCategory.name = name;
    }

    if (description !== undefined) {
        subCategory.description = description;
    }

    if (isActive !== undefined) {
        subCategory.isActive = isActive;
    }

    await subCategory.save();

    const populatedSubCategory = await subCategory.populate("categoryId", "name");

    res.status(200).json({
        success: true,
        message: "Sub category updated successfully",
        data: populatedSubCategory
    });

});

export const getSubCategoryById = asyncHandler(async (req, res) => {

    const { subCategoryId } = req.query;

    const subCategory = await subcategoryModel
        .findById(subCategoryId)
        .populate("categoryId");

    if (!subCategory) {
        return res.status(404).json({
            success: false,
            message: "Sub category not found"
        });
    }

    res.status(200).json({
        success: true,
        message:"Fetched category successfully",
        data: subCategory
    });

});


export const getSubCategoryByFilter = asyncHandler(async (req, res) => {

    const {
        search,
        categoryId,
        isActive,
        page = 1,
        limit = 10
    } = req.query;

    let filter = {};
    if (search) {
        const escapedSearch = escapeRegex(search);
        filter.$or = [
            {
                name: {
                    $regex: escapedSearch,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: escapedSearch,
                    $options: "i"
                }
            }
        ];
    }

    if (categoryId) {
        filter.categoryId = categoryId;
    }

    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }

    const skip = (Number(page) - 1) * Number(limit);

    const subCategories = await subcategoryModel
        .find(filter)
        .populate("categoryId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalRecords = await subcategoryModel.countDocuments(filter);

    res.status(200).json({
        success: true,
        message:"All subcategory Fetched successfully",
        data: subCategories,
        totalRecords,
        currentPage: Number(page),
        totalPages: Math.ceil(totalRecords / Number(limit)),
    });

});



export const deleteSubCategory = asyncHandler(async (req, res) => {

    const { subCategoryId } = req.query;

    if (!subCategoryId) {
        return res.status(400).json({
            success: false,
            message: "subCategoryId is required"
        });
    }

    const subCategory = await subcategoryModel.findByIdAndDelete(
        subCategoryId,  
    );

    if (!subCategory) {
        return res.status(404).json({
            success: false,
            message: "Sub category not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Sub category deleted successfully",
        data: subCategory
    });

});
