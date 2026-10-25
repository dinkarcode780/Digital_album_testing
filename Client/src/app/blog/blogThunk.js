import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";

// ================= Get Blogs (Filtered / Paginated) =================
export const getBlogByFilter = createAsyncThunk(
  "blog/getBlogByFilter",
  async (params = {}, { rejectWithValue }) => {
    try {
      const isAdminCall =
        params.isAdmin ||
        params.all === "true" ||
        params.all === true ||
        Boolean(params.adminId);
      const endpoint = isAdminCall
        ? "/admin/getBlogs"
        : "/users/getBlogByFilter";

      const response = await axiosInstance.get(endpoint, {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch blogs",
        }
      );
    }
  }
);

// ================= Get Single Blog By ID / Slug =================
export const getBlogById = createAsyncThunk(
  "blog/getBlogById",
  async (arg, { rejectWithValue }) => {
    try {
      const params =
        typeof arg === "object" && arg !== null
          ? { ...arg }
          : { blogId: arg };

      const isAdminCall =
        params.isAdmin ||
        params.includeUnpublished ||
        params.admin === "true";
      const endpoint = isAdminCall
        ? "/admin/getBlogById"
        : "/users/getBlogById";

      const response = await axiosInstance.get(endpoint, {
        params,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch blog details",
        }
      );
    }
  }
);

// ================= Create Blog (Admin) =================
export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/admin/createBlog",
        blogFormData
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "Failed to create blog";

      return rejectWithValue({
        success: false,
        message,
      });
    }
  }
);

// ================= Update Blog (Admin) =================
export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async (blogFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/admin/updateBlog",
        blogFormData
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "Failed to update blog";

      return rejectWithValue({
        success: false,
        message,
      });
    }
  }
);

// ================= Delete Blog (Admin) =================
export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/admin/deleteBlog", {
        params: { blogId },
      });
      return { blogId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete blog",
        }
      );
    }
  }
);
