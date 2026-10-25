import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";

// ================= Create Media =================

export const createMedia = createAsyncThunk(
  "media/createMedia",
  async (mediaData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/admin/createMedia",
        mediaData
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

// ================= Update Media =================

export const updateMedia = createAsyncThunk(
  "media/updateMedia",
  async (mediaData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/admin/updateMedia",
        mediaData
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

// ================= Delete Media =================

export const deleteMedia = createAsyncThunk(
  "media/deleteMedia",
  async (mediaId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        "/admin/deleteMedia",
        {
          data: {
            mediaId,
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

// ================= Toggle Download =================

export const toggleDownload = createAsyncThunk(
  "media/toggleDownload",
  async (mediaId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/admin/iSdownload",
        {
          mediaId,
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

export const toggleMediaActive = createAsyncThunk(
  "media/toggleMediaActive",
  async (mediaId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/admin/toggleMediaActive",
        {
          mediaId,
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

// ================= Get Media By Id =================

export const getMediaById = createAsyncThunk(
  "media/getMediaById",
  async (mediaId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/getMediaById",
        {
          params: {
            mediaId,
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

// ================= Get Media By Filter =================

export const getMediaByFilter = createAsyncThunk(
  "media/getMediaByFilter",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/getMediaByFilter",
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