import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";

export const adminRegister = createAsyncThunk(
  "admin/adminRegister",
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/admin/register",
        registerData
      );

      return response.data;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      return rejectWithValue(message);
    }
  }
);

export const adminLogin = createAsyncThunk(
  "admin/adminLogin",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/admin/adminLogin",
        loginData
      );

      localStorage.setItem(
        "adminToken",
        response.data.data.token
      );

      const { _id, name, email, phoneNumber, userType, profileImage, isActive } = response.data.data;
      localStorage.setItem(
        "admin",
        JSON.stringify({ _id, name, email, phoneNumber, userType, profileImage, isActive })
      );

      return response.data;

    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      return rejectWithValue(message);
    }
  }
);


export const adminUpdateProfile = createAsyncThunk(
  "admin/adminUpdateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("adminId", profileData.adminId);
      formData.append("name", profileData.name);
      formData.append("email", profileData.email);
      formData.append("phoneNumber", profileData.phoneNumber);
      formData.append("address", profileData.address);

      if (profileData.profileImage) {
        formData.append("profileImage", profileData.profileImage);
      }

      const response = await axiosInstance.put(
        "/admin/adminUpdateProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

export const getAdminById = createAsyncThunk(
  "admin/getAdminById",
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/admin/getAdminById?adminId=${adminId}`
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

// ================== User Active / Deactive ==================

export const userIsActive = createAsyncThunk(
  "admin/userIsActive",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/admin/userIsActive",
        {
          userId,
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

export const adminLogout = createAsyncThunk(
  "admin/adminLogout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/adminLogout"
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
    }
  }
);