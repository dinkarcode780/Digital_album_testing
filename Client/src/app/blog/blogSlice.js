import { createSlice } from "@reduxjs/toolkit";
import {
  getBlogByFilter,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from "./blogThunk";

const initialState = {
  loading: false,
  detailLoading: false,
  actionLoading: false,
  success: false,
  error: null,
  message: "",

  // Blog data
  blogs: [],
  blog: null,

  // Filters & Controls
  selectedCategory: "All",
  searchTerm: "",
  sortBy: "latest",

  // Pagination
  pagination: {
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 9,
    hasNextPage: false,
    hasPrevPage: false,
  },
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.pagination.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearBlogDetail: (state) => {
      state.blog = null;
      state.detailLoading = false;
      state.error = null;
    },
    resetBlogState: (state) => {
      state.loading = false;
      state.detailLoading = false;
      state.actionLoading = false;
      state.success = false;
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= Get Blogs List =================
      .addCase(getBlogByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.blogs = action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = {
            totalRecords: action.payload.pagination.totalRecords ?? 0,
            currentPage: action.payload.pagination.currentPage ?? 1,
            totalPages: action.payload.pagination.totalPages ?? 1,
            limit: action.payload.pagination.limit ?? 9,
            hasNextPage: action.payload.pagination.hasNextPage ?? false,
            hasPrevPage: action.payload.pagination.hasPrevPage ?? false,
          };
        }
      })
      .addCase(getBlogByFilter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to load blogs";
      })

      // ================= Get Single Blog By ID / Slug =================
      .addCase(getBlogById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.success = true;
        state.blog = action.payload.data || null;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.detailLoading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to load blog";
      })

      // ================= Create Blog =================
      .addCase(createBlog.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
        state.message = action.payload.message || "Blog created successfully";
        if (action.payload.data) {
          state.blogs.unshift(action.payload.data);
          state.pagination.totalRecords += 1;
        }
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.actionLoading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to create blog";
      })

      // ================= Update Blog =================
      .addCase(updateBlog.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
        state.message = action.payload.message || "Blog updated successfully";
        const updated = action.payload.data;
        if (updated) {
          state.blogs = state.blogs.map((b) =>
            b._id === updated._id ? updated : b
          );
          if (state.blog && state.blog._id === updated._id) {
            state.blog = updated;
          }
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.actionLoading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to update blog";
      })

      // ================= Delete Blog =================
      .addCase(deleteBlog.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
        state.message = action.payload.message || "Blog deleted successfully";
        const deletedId = action.payload.blogId;
        state.blogs = state.blogs.filter((b) => b._id !== deletedId);
        if (state.blog && state.blog._id === deletedId) {
          state.blog = null;
        }
        if (state.pagination.totalRecords > 0) {
          state.pagination.totalRecords -= 1;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.actionLoading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to delete blog";
      });
  },
});

export const {
  setSelectedCategory,
  setSearchTerm,
  setSortBy,
  setPage,
  clearBlogDetail,
  resetBlogState,
} = blogSlice.actions;

export default blogSlice.reducer;
