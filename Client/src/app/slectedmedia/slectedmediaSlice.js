import { createSlice } from "@reduxjs/toolkit";
import {
  saveUserSelectedMedia,
  toggleMediaSelection,
  getMySelectedMedia,
  submitUserSelectedMedia,
  removeMediaFromSelection,
  clearUserSelectedMedia,
  getUserSelectedMediaById,
  getAllUserSelectedMedia,
  updateSelectionStatus,
  deleteUserSelectedMedia,
} from "./slectedmediaThunk";

const initialState = {
  loading: false,
  toggleLoading: false,
  success: false,
  error: null,
  message: "",

  // Logged-in user's data
  selectedMediaDoc: null,
  selections: [],
  favorites: [],
  favoriteMediaIds: [],

  // Admin data
  adminSelections: [],
  selectedDetail: null,
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  },
};

const slectedmediaSlice = createSlice({
  name: "slectedmedia",
  initialState,

  reducers: {
    resetSelectedMediaState: (state) => {
      state.loading = false;
      state.toggleLoading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
    clearSelectionErrors: (state) => {
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= 1. Save Bulk Selection =================
      .addCase(saveUserSelectedMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUserSelectedMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.selectedMediaDoc = action.payload.data;

        // Update selections array
        const index = state.selections.findIndex(
          (s) => s._id === action.payload.data?._id
        );
        if (index > -1) {
          state.selections[index] = action.payload.data;
        } else if (action.payload.data) {
          state.selections.unshift(action.payload.data);
        }

        // Re-sync favoriteMediaIds
        if (action.payload.data?.selectedMedia) {
          const newIds = action.payload.data.selectedMedia
            .map((item) => item.mediaId?._id || item.mediaId)
            .filter(Boolean)
            .map(String);
          state.favoriteMediaIds = Array.from(
            new Set([...state.favoriteMediaIds, ...newIds])
          );
        }
      })
      .addCase(saveUserSelectedMedia.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to save selected media";
      })

      // ================= 2. Toggle Favorite / Single Selection =================
      .addCase(toggleMediaSelection.pending, (state) => {
        state.toggleLoading = true;
      })
      .addCase(toggleMediaSelection.fulfilled, (state, action) => {
        state.toggleLoading = false;
        state.success = true;
        state.message = action.payload.message;
        state.selectedMediaDoc = action.payload.data;

        const toggledId = String(action.payload.toggledMediaId);
        const isSelected = action.payload.isSelected;

        if (isSelected) {
          if (!state.favoriteMediaIds.includes(toggledId)) {
            state.favoriteMediaIds.push(toggledId);
          }
        } else {
          state.favoriteMediaIds = state.favoriteMediaIds.filter(
            (id) => id !== toggledId
          );
          state.favorites = state.favorites.filter(
            (f) => String(f.mediaId) !== toggledId
          );
        }

        // Update selections list
        const index = state.selections.findIndex(
          (s) => s._id === action.payload.data?._id
        );
        if (index > -1) {
          state.selections[index] = action.payload.data;
        } else if (action.payload.data) {
          state.selections.unshift(action.payload.data);
        }
      })
      .addCase(toggleMediaSelection.rejected, (state, action) => {
        state.toggleLoading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to toggle selection";
      })

      // ================= 3. Get My Favorites / Selected Media =================
      .addCase(getMySelectedMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMySelectedMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.selections = action.payload.data || [];
        state.favorites = action.payload.favorites || [];

        // Build array of media IDs for quick lookup
        const ids = (action.payload.favorites || [])
          .map((f) => String(f.mediaId))
          .filter(Boolean);
        state.favoriteMediaIds = Array.from(new Set(ids));
      })
      .addCase(getMySelectedMedia.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to load favorites";
      })

      // ================= 4. Submit & Lock Selection =================
      .addCase(submitUserSelectedMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitUserSelectedMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.selectedMediaDoc = action.payload.data;

        const index = state.selections.findIndex(
          (s) => s._id === action.payload.data?._id
        );
        if (index > -1) {
          state.selections[index] = action.payload.data;
        }
      })
      .addCase(submitUserSelectedMedia.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to submit selection";
      })

      // ================= 5. Remove Single Media =================
      .addCase(removeMediaFromSelection.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeMediaFromSelection.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.selectedMediaDoc = action.payload.data;

        const removedId = String(action.payload.removedMediaId);
        state.favoriteMediaIds = state.favoriteMediaIds.filter(
          (id) => id !== removedId
        );
        state.favorites = state.favorites.filter(
          (f) => String(f.mediaId) !== removedId
        );

        const index = state.selections.findIndex(
          (s) => s._id === action.payload.data?._id
        );
        if (index > -1) {
          state.selections[index] = action.payload.data;
        }
      })
      .addCase(removeMediaFromSelection.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to remove media";
      })

      // ================= 6. Clear Entire Selection =================
      .addCase(clearUserSelectedMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearUserSelectedMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.selectedMediaDoc = action.payload.data;

        state.selections = state.selections.filter(
          (s) => s.eventId !== action.payload.eventId
        );
      })
      .addCase(clearUserSelectedMedia.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to clear selection";
      })

      // ================= 7. Get Selection By ID =================
      .addCase(getUserSelectedMediaById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserSelectedMediaById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedDetail = action.payload.data;
      })
      .addCase(getUserSelectedMediaById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ================= 8. Admin: Get All Selections =================
      .addCase(getAllUserSelectedMedia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserSelectedMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.adminSelections = action.payload.data || [];
        state.pagination = {
          totalRecords: action.payload.total,
          currentPage: action.payload.page,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(getAllUserSelectedMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch selections";
      })

      // ================= 9. Admin: Update Status =================
      .addCase(updateSelectionStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSelectionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.adminSelections = state.adminSelections.map((item) =>
          item._id === action.payload.data?._id ? action.payload.data : item
        );
      })
      .addCase(updateSelectionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update status";
      })

      // ================= 10. Admin: Delete Selection =================
      .addCase(deleteUserSelectedMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserSelectedMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.adminSelections = state.adminSelections.filter(
          (item) => item._id !== action.payload.deletedSelectionId
        );
      })
      .addCase(deleteUserSelectedMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete selection";
      });
  },
});

export const { resetSelectedMediaState, clearSelectionErrors } =
  slectedmediaSlice.actions;

export default slectedmediaSlice.reducer;
