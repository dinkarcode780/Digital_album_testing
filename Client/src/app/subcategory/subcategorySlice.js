import { createSlice } from "@reduxjs/toolkit";
import {
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoryById,
  getSubCategoryByFilter,
} from "./subcategoryThunk";

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: "",

  // Single Sub Category
  subCategory: null,

  // Sub Category List
  subCategories: [],

  // Pagination
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
  },
};

const subCategorySlice = createSlice({
  name: "subCategory",
  initialState,

  reducers: {
    resetSubCategoryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Create =================

      .addCase(createSubCategory.pending, (state) => {
        state.loading = true;
      })

      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.subCategory = action.payload.data;

        state.subCategories.unshift(action.payload.data);
      })

      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Update =================

      .addCase(updateSubCategory.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.subCategory = action.payload.data;

        state.subCategories = state.subCategories.map((item) =>
          item._id === action.payload.data._id
            ? action.payload.data
            : item
        );
      })

      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Delete =================

      .addCase(deleteSubCategory.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        state.subCategories = state.subCategories.filter(
          (item) => item._id !== action.meta.arg
        );
      })

      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Get By Id =================

      .addCase(getSubCategoryById.pending, (state) => {
        state.loading = true;
      })

      .addCase(getSubCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.subCategory = action.payload.data;
      })

      .addCase(getSubCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Get All =================

      .addCase(getSubCategoryByFilter.pending, (state) => {
        state.loading = true;
      })

      .addCase(getSubCategoryByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.subCategories = action.payload.data;

        state.pagination = {
          totalRecords: action.payload.totalRecords,
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })

      .addCase(getSubCategoryByFilter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      });
  },
});

export const { resetSubCategoryState } = subCategorySlice.actions;

export default subCategorySlice.reducer;