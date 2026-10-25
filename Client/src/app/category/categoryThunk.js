import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";

// ================= Create Event Category =================

export const createEventCategory = createAsyncThunk(
  "eventCategory/createEventCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/admin/createEventCategory",
        categoryData
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

// ================= Update Event Category =================

export const updateEventCategory = createAsyncThunk(
  "eventCategory/updateEventCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/admin/updateEventCategory",
        categoryData
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

// ================= Delete Event Category =================

export const deleteEventCategory = createAsyncThunk(
  "eventCategory/deleteEventCategory",
  async (eventcategoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        "/admin/deleteEventCategory",
        {
          params: {
            eventcategoryId,
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


export const getEventCategoryById = createAsyncThunk(
  "eventCategory/getEventCategoryById",
  async (eventcategoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/getEventCategoryById",
        {
          params: {
            eventcategoryId,
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

// ================= Get Event Category By Filter =================

export const getEventCategoryByFilter = createAsyncThunk(
  "eventCategory/getEventCategoryByFilter",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/public/categories",
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