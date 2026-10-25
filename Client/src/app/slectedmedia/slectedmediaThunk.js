import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";

// ================= 1. Save or Update Bulk Selection =================
export const saveUserSelectedMedia = createAsyncThunk(
  "selectedMedia/saveUserSelectedMedia",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/users/saveUserSelectedMedia",
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to save selected media",
        }
      );
    }
  }
);

// ================= 2. Toggle Favorite / Single Media Selection =================
export const toggleMediaSelection = createAsyncThunk(
  "selectedMedia/toggleMediaSelection",
  async ({ mediaId, eventId, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/users/toggleMediaSelection",
        {
          mediaId,
          eventId,
          comment,
        }
      );
      return {
        ...response.data,
        toggledMediaId: mediaId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to toggle media selection",
        }
      );
    }
  }
);

// Alias for toggleFavorite
export const toggleFavoriteMedia = toggleMediaSelection;

// ================= 3. Get User's Favorites & Selected Media =================
export const getMySelectedMedia = createAsyncThunk(
  "selectedMedia/getMySelectedMedia",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/users/getMyFavorites",
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch favorites",
        }
      );
    }
  }
);

// Alias for getMyFavorites
export const getMyFavorites = getMySelectedMedia;

// ================= 4. Submit & Lock Selection for Admin =================
export const submitUserSelectedMedia = createAsyncThunk(
  "selectedMedia/submitUserSelectedMedia",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/users/submitUserSelectedMedia",
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to submit selection",
        }
      );
    }
  }
);

// ================= 5. Remove Single Media from Selection =================
export const removeMediaFromSelection = createAsyncThunk(
  "selectedMedia/removeMediaFromSelection",
  async ({ eventId, mediaId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        "/users/removeMediaFromSelection",
        {
          data: { eventId, mediaId },
        }
      );
      return {
        ...response.data,
        removedMediaId: mediaId,
        eventId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to remove media from selection",
        }
      );
    }
  }
);

// ================= 6. Clear Entire Selection for Event =================
export const clearUserSelectedMedia = createAsyncThunk(
  "selectedMedia/clearUserSelectedMedia",
  async ({ eventId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        "/users/clearUserSelectedMedia",
        {
          data: { eventId },
        }
      );
      return {
        ...response.data,
        eventId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to clear selection",
        }
      );
    }
  }
);

// ================= 7. Get Selection By ID (User / Admin) =================
export const getUserSelectedMediaById = createAsyncThunk(
  "selectedMedia/getUserSelectedMediaById",
  async (selectionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/users/getUserSelectedMediaById",
        {
          params: { selectionId },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch selection details",
        }
      );
    }
  }
);

// ================= 8. Admin: Get All Selections =================
export const getAllUserSelectedMedia = createAsyncThunk(
  "selectedMedia/getAllUserSelectedMedia",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/getAllUserSelectedMedia",
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch all selections",
        }
      );
    }
  }
);

// ================= 9. Admin: Update Status & Notes =================
export const updateSelectionStatus = createAsyncThunk(
  "selectedMedia/updateSelectionStatus",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/admin/updateSelectionStatus",
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to update selection status",
        }
      );
    }
  }
);

// ================= 10. Admin: Delete Selection =================
export const deleteUserSelectedMedia = createAsyncThunk(
  "selectedMedia/deleteUserSelectedMedia",
  async (selectionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        "/admin/deleteUserSelectedMedia",
        {
          params: { selectionId },
        }
      );
      return {
        ...response.data,
        deletedSelectionId: selectionId,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to delete selection",
        }
      );
    }
  }
);
