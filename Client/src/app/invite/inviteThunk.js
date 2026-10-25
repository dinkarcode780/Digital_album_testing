import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../src/config/axios";

export const inviteUser = createAsyncThunk(
  "invite/inviteUser",
  async (inviteData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/admin/inviteUser",
        inviteData
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

export const verifyInvite = createAsyncThunk(
  "/users/verifyInvite",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users/verifyInvite", {
        params: {
          token,
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Invalid Invite",
        }
      );
    }
  }
);


export const getAllInviteByFilter = createAsyncThunk(
  "invite/getAllInviteByFilter",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/admin/getAllInviteByFilter",
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