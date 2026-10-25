import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";

// ================= Create Sub Category =================

export const createSubCategory = createAsyncThunk(
  "subCategory/createSubCategory",
  async (subCategoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/admin/createSubcategory",
        subCategoryData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    }
  }
);

// ================= Update Sub Category =================

export const updateSubCategory = createAsyncThunk(
  "subCategory/updateSubCategory",
  async (subCategoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/admin/updateSubCategory",
        subCategoryData
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    }
  }
);

// ================= Delete Sub Category =================

export const deleteSubCategory = createAsyncThunk(
  "subCategory/deleteSubCategory",
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        "/admin/deleteSubCategory",
        {
          params: {
            subCategoryId,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    }
  }
);


// ================= Get Sub Category By Id =================

export const getSubCategoryById = createAsyncThunk(
  "subCategory/getSubCategoryById",
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/getSubCategoryById",
        {
          params: {
            subCategoryId,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    }
  }
);

// ================= Get Sub Category By Filter =================

export const getSubCategoryByFilter = createAsyncThunk(
  "subCategory/getSubCategoryByFilter",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/getSubCategoryByFilter",
        {
          params,
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    }
  }
);