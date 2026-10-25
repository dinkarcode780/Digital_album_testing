import { createSlice } from "@reduxjs/toolkit";

import {
  userRegister,
  userLogin,
  userUpdateProfile,
  getUserById,
  getUserByFilter,
  toggleUserStatus,
  userDeleteById,
  userForgetPassword,
  userLogout,
  userResetPassword,
  userChangePassword,
} from "./authThunk";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  users: [],
  token: localStorage.getItem("userToken") || null,
  loading: false,
  success: false,
  error: null,
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearUserState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },

    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.success = false;
      state.error = null;

      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    // ================= Register =================

    builder
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Login =================

    builder
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload.data;
        state.token = action.payload.data.token;
      })

      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Update Profile =================

    builder
      .addCase(userUpdateProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(userUpdateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload?.data) {
          state.user = action.payload.data;
          localStorage.setItem("user", JSON.stringify(action.payload.data));
        }
      })

      .addCase(userUpdateProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Change Password =================

    builder
      .addCase(userChangePassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(userChangePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(userChangePassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Get User By Id =================

    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        if (action.payload?.data) {
          state.user = action.payload.data;
          localStorage.setItem("user", JSON.stringify(action.payload.data));
        }
      })

      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Get User By Filter =================

    builder
      .addCase(getUserByFilter.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(getUserByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = action.payload.data;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })

      .addCase(getUserByFilter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Delete User =================

    builder
      .addCase(userDeleteById.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(userDeleteById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.users = state.users.filter(
          (user) => user._id !== action.payload.data._id,
        );
      })

      .addCase(userDeleteById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Toggle User Status =================

    builder
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.users = state.users.map((user) =>
          user._id === action.payload.data._id ? action.payload.data : user,
        );

        if (state.user && state.user._id === action.payload.data._id) {
          state.user = action.payload.data;
        }
      })

      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Forget Password =================

    builder
      .addCase(userForgetPassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(userForgetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(userForgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Reset Password =================

    builder
      .addCase(userResetPassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(userResetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(userResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Something went wrong";
      });

    // ================= Logout =================

    builder
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.user = null;
        state.token = null;
      })

      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message || "Something went wrong";
      });
  },
});

export const { clearUserState, logoutUser } = authSlice.actions;

export default authSlice.reducer;
