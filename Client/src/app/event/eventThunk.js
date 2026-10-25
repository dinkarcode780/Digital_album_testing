import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";

export const createEvent = createAsyncThunk(
  "event/createEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/admin/createEvent",
        eventData
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

// ==================== Update Event ====================

export const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/admin/updateEvent",
        eventData
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

// ==================== Delete Event ====================

export const deleteEvent = createAsyncThunk(
  "event/deleteEvent",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        "/admin/deleteEvent",
        {
          params: {
            eventId,
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

export const getEventById = createAsyncThunk(
  "event/getEventById",
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/getEventById",
        {
          params: {
            eventId,
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

// ==================== Get Event By Filter ====================

export const getAllEventByFilter = createAsyncThunk(
  "event/getAllEventByFilter",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/getEventByFilter",
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