import { createSlice } from "@reduxjs/toolkit";
import {
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
  getEventCategoryById,
  getEventCategoryByFilter,
} from "./categoryThunk";

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: "",

  // Single Category
  eventCategory: null,

  // Category List
  eventCategories: [],

  // Pagination
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  },
};

const eventCategorySlice = createSlice({
  name: "eventCategory",
  initialState,

  reducers: {
    resetEventCategoryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Create =================

      .addCase(createEventCategory.pending, (state) => {
        state.loading = true;
      })

      .addCase(createEventCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.eventCategory = action.payload.data;

        state.eventCategories.unshift(action.payload.data);
      })

      .addCase(createEventCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Update =================

      .addCase(updateEventCategory.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateEventCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.eventCategory = action.payload.data;

        state.eventCategories = state.eventCategories.map((item) =>
          item._id === action.payload.data._id
            ? action.payload.data
            : item
        );
      })

      .addCase(updateEventCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Delete =================

      .addCase(deleteEventCategory.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteEventCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.eventCategories = state.eventCategories.filter(
          (item) => item._id !== action.meta.arg
        );
      })

      .addCase(deleteEventCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Get By Id =================

      .addCase(getEventCategoryById.pending, (state) => {
        state.loading = true;
      })

      .addCase(getEventCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.eventCategory = action.payload.data;
      })

      .addCase(getEventCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Get All =================

      .addCase(getEventCategoryByFilter.pending, (state) => {
        state.loading = true;
      })

      .addCase(getEventCategoryByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.eventCategories = action.payload.data;

        state.pagination = {
          totalRecords: action.payload.totalRecords,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })

      .addCase(getEventCategoryByFilter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      });
  },
});

export const { resetEventCategoryState } =
  eventCategorySlice.actions;

export default eventCategorySlice.reducer;