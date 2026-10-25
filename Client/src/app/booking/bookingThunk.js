import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axios";

// 1. Get Razorpay Config Key
export const getBookingRazorpayConfig = createAsyncThunk(
  "booking/getBookingRazorpayConfig",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/booking/razorpay/config");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch Razorpay config",
        }
      );
    }
  }
);

// 2. Create Razorpay Order for Booking
export const createBookingRazorpayOrder = createAsyncThunk(
  "booking/createBookingRazorpayOrder",
  async (orderPayload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/booking/razorpay/order", orderPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to create Razorpay payment order",
        }
      );
    }
  }
);

// 3. Verify Razorpay Payment
export const verifyBookingRazorpayPayment = createAsyncThunk(
  "booking/verifyBookingRazorpayPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/booking/razorpay/verify", paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Razorpay payment verification failed",
        }
      );
    }
  }
);

// 4. Create Booking (Logged in user)
export const createBooking = createAsyncThunk(
  "booking/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/booking/create", bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to create booking",
        }
      );
    }
  }
);

// 5. Get User Bookings
export const getUserBookings = createAsyncThunk(
  "booking/getUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/booking/user");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch bookings",
        }
      );
    }
  }
);

// 6. Get Studio Bookings (Admin)
export const getStudioBookings = createAsyncThunk(
  "booking/getStudioBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/booking/studio");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch studio bookings",
        }
      );
    }
  }
);

// 7. Get Booking By ID
export const getBookingById = createAsyncThunk(
  "booking/getBookingById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to fetch booking details",
        }
      );
    }
  }
);

// 8. Update Booking Status
export const updateBookingStatus = createAsyncThunk(
  "booking/updateBookingStatus",
  async ({ bookingId, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/booking/status/${bookingId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to update booking status",
        }
      );
    }
  }
);

// 9. Cancel Booking
export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/booking/cancel/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to cancel booking",
        }
      );
    }
  }
);

// 10. Add Booking Payment (Installment/Balance)
export const addBookingPayment = createAsyncThunk(
  "booking/addBookingPayment",
  async ({ bookingId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/booking/${bookingId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          success: false,
          message: "Failed to record payment",
        }
      );
    }
  }
);
