import { createSlice } from "@reduxjs/toolkit";
import {
  createBooking,
  getUserBookings,
  getStudioBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  createBookingRazorpayOrder,
  verifyBookingRazorpayPayment,
  addBookingPayment,
} from "./bookingThunk";

const initialState = {
  loading: false,
  paymentLoading: false,
  success: false,
  error: null,
  message: "",

  // Single active booking
  booking: null,

  // Bookings list
  bookings: [],
  studioBookings: [],
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    resetBookingState: (state) => {
      state.loading = false;
      state.paymentLoading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
    clearCurrentBooking: (state) => {
      state.booking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= CREATE RAZORPAY ORDER =================
      .addCase(createBookingRazorpayOrder.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(createBookingRazorpayOrder.fulfilled, (state) => {
        state.paymentLoading = false;
      })
      .addCase(createBookingRazorpayOrder.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload?.message || "Failed to create payment order";
      })

      // ================= VERIFY RAZORPAY PAYMENT =================
      .addCase(verifyBookingRazorpayPayment.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(verifyBookingRazorpayPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.success = true;
        state.message = action.payload.message || "Payment verified successfully!";
      })
      .addCase(verifyBookingRazorpayPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload?.message || "Payment verification failed";
      })

      // ================= CREATE BOOKING =================
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Booking created successfully!";
        state.booking = action.payload.data;
        if (action.payload.data) {
          state.bookings.unshift(action.payload.data);
        }
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create booking";
        state.success = false;
      })

      // ================= GET USER BOOKINGS =================
      .addCase(getUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data || [];
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch bookings";
      })

      // ================= GET STUDIO BOOKINGS =================
      .addCase(getStudioBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStudioBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.studioBookings = action.payload.data || [];
      })
      .addCase(getStudioBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch studio bookings";
      })

      // ================= GET BOOKING BY ID =================
      .addCase(getBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload.data;
      })
      .addCase(getBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch booking details";
      })

      // ================= UPDATE BOOKING STATUS =================
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        const updated = action.payload.data;
        if (updated) {
          state.bookings = state.bookings.map((b) => (b._id === updated._id ? updated : b));
          state.studioBookings = state.studioBookings.map((b) => (b._id === updated._id ? updated : b));
          if (state.booking?._id === updated._id) {
            state.booking = updated;
          }
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update status";
      })

      // ================= CANCEL BOOKING =================
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        const updated = action.payload.data;
        if (updated) {
          state.bookings = state.bookings.map((b) => (b._id === updated._id ? updated : b));
          state.studioBookings = state.studioBookings.map((b) => (b._id === updated._id ? updated : b));
          if (state.booking?._id === updated._id) {
            state.booking = updated;
          }
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to cancel booking";
      })

      // ================= ADD BOOKING PAYMENT =================
      .addCase(addBookingPayment.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(addBookingPayment.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.success = true;
        state.message = action.payload.message || "Payment recorded successfully!";
        const updated = action.payload.data;
        if (updated) {
          state.bookings = state.bookings.map((b) => (b._id === updated._id ? updated : b));
          state.studioBookings = state.studioBookings.map((b) => (b._id === updated._id ? updated : b));
          if (state.booking?._id === updated._id) {
            state.booking = updated;
          }
        }
      })
      .addCase(addBookingPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload?.message || "Failed to record payment";
      });
  },
});

export const { resetBookingState, clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
