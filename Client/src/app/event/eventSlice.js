import { createSlice } from "@reduxjs/toolkit";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getAllEventByFilter,
} from "./eventThunk";

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: "",

  // Single Event
  event: null,

  // Event List
  events: [],

  // Pagination
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  },
};

const eventSlice = createSlice({
  name: "event",
  initialState,

  reducers: {
    resetEventState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Create Event =================

      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })

      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.event = action.payload.data;

        state.events.unshift(action.payload.data);
      })

      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Update Event =================

      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.event = action.payload.data;

        state.events = state.events.map((item) =>
          item._id === action.payload.data._id
            ? action.payload.data
            : item
        );
      })

      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Delete Event =================

      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.events = state.events.filter(
          (item) => item._id !== action.payload.data._id
        );
      })

      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Get Event By Id =================

      .addCase(getEventById.pending, (state) => {
        state.loading = true;
      })

      .addCase(getEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.event = action.payload.data;
        state.message = action.payload.message;
      })

      .addCase(getEventById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Get All Events =================

      .addCase(getAllEventByFilter.pending, (state) => {
        state.loading = true;
      })

      .addCase(getAllEventByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.events = action.payload.data;

        state.pagination = {
          totalRecords: action.payload.totalRecords,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };

        state.message = action.payload.message;
      })

      .addCase(getAllEventByFilter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      });
  },
});

export const { resetEventState } = eventSlice.actions;

export default eventSlice.reducer;