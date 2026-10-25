import { createSlice } from "@reduxjs/toolkit";
import {
  createMedia,
  updateMedia,
  deleteMedia,
  toggleDownload,
  toggleMediaActive,
  getMediaById,
  getMediaByFilter,
} from "./mediaThunk";

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: "",

  // Single Media
  media: null,

  // Media List
  medias: [],

  // Pagination
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  },
};

const mediaSlice = createSlice({
  name: "media",

  initialState,

  reducers: {
    resetMediaState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Create =================

      .addCase(createMedia.pending, (state) => {
        state.loading = true;
      })

      .addCase(createMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.medias.unshift(...action.payload.data);
      })

      .addCase(createMedia.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Update =================

      .addCase(updateMedia.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.media = action.payload.data;

        state.medias = state.medias.map((item) =>
          item._id === action.payload.data._id
            ? action.payload.data
            : item
        );
      })

      .addCase(updateMedia.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Delete =================

      .addCase(deleteMedia.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.medias = state.medias.filter(
          (item) => item._id !== action.meta.arg
        );
      })

      .addCase(deleteMedia.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Toggle Download =================

      .addCase(toggleDownload.pending, (state) => {
        state.loading = true;
      })

      .addCase(toggleDownload.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.medias = state.medias.map((item) =>
          item._id === action.payload.data._id
            ? action.payload.data
            : item
        );

        if (
          state.media &&
          state.media._id === action.payload.data._id
        ) {
          state.media = action.payload.data;
        }
      })

      .addCase(toggleDownload.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Toggle Active =================

      .addCase(toggleMediaActive.pending, (state) => {
        state.loading = true;
      })

      .addCase(toggleMediaActive.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.medias = state.medias.map((item) =>
          item._id === action.payload.data._id
            ? action.payload.data
            : item
        );

        if (
          state.media &&
          state.media._id === action.payload.data._id
        ) {
          state.media = action.payload.data;
        }
      })

      .addCase(toggleMediaActive.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Get By Id =================

      .addCase(getMediaById.pending, (state) => {
        state.loading = true;
      })

      .addCase(getMediaById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.media = action.payload.data;
      })

      .addCase(getMediaById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Get By Filter =================

      .addCase(getMediaByFilter.pending, (state) => {
        state.loading = true;
      })

      .addCase(getMediaByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.medias = action.payload.data;

        state.pagination = {
          totalRecords: action.payload.totalRecords,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })

      .addCase(getMediaByFilter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      });
  },
});

export const { resetMediaState } = mediaSlice.actions;

export default mediaSlice.reducer;