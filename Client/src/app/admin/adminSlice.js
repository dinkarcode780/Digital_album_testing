import { createSlice } from "@reduxjs/toolkit";
import { adminLogin, adminRegister, adminLogout, adminUpdateProfile, getAdminById, userIsActive } from "../admin/adminThunk";

// const initialState = {
//   loading: false,
//   admin: null,
//   token: null,
//   isAuthenticated: false,
//   success: false,
//   message: "",
//   error: null,
// };
const initialState = {
  loading: false,

  admin: JSON.parse(
    localStorage.getItem("admin")
  ) || null,

  token: localStorage.getItem("adminToken") || null,

  isAuthenticated: !!localStorage.getItem("adminToken"),

  success: false,
  message: "",
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    clearAdminState: (state) => {
      state.loading = false;
      state.success = false;
      state.message = "";
      state.error = null;
    },

    clearAdminData: (state) => {
      state.admin = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.admin = action.payload.data;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
      })

      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          (typeof action.payload === "string" ? action.payload : "Something went wrong");
        state.message = action.payload?.message || state.error;
      })
      
      // ================= Register Admin =================
      .addCase(adminRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(adminRegister.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message ||
          (typeof action.payload === "string" ? action.payload : "Something went wrong");
        state.message = action.payload?.message || state.error;
      })
      
      // ================= Update Profile =================
      .addCase(adminUpdateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(adminUpdateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.admin = action.payload.data;
         localStorage.setItem(
    "admin",
    JSON.stringify(action.payload.data)
  );
      })

      .addCase(adminUpdateProfile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })
      .addCase(getAdminById.pending, (state) => {
    state.loading = true;
    state.error = null;
})

.addCase(getAdminById.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;
    state.message = action.payload.message;
    state.admin = action.payload.data;
})

.addCase(getAdminById.rejected, (state, action) => {
    state.loading = false;
    state.success = false;
    state.error =
    action.payload?.message || "Something went wrong";
})

.addCase(userIsActive.pending, (state) => {
    state.loading = true;
    state.error = null;
})

.addCase(userIsActive.fulfilled, (state, action) => {
    state.loading = false;
    state.success = true;

    // Agar current admin hi update hua ho
    if (
        state.admin &&
        state.admin._id === action.payload.data._id
    ) {
        state.admin = action.payload.data;
    }
})

.addCase(userIsActive.rejected, (state, action) => {
    state.loading = false;
    state.success = false;
    state.error =
        action.payload?.message || "Something went wrong";
})
// ================= Admin Logout =================

.addCase(adminLogout.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(adminLogout.fulfilled, (state, action) => {
  state.loading = false;
  state.success = action.payload.success;
  state.message = action.payload.message;

  state.admin = null;
  state.token = null;
  state.isAuthenticated = false;
})

.addCase(adminLogout.rejected, (state, action) => {
  state.loading = false;
  state.success = false;
  state.admin = null;
  state.token = null;
  state.isAuthenticated = false;
  state.error =
    action.payload?.message || "Something went wrong";
});
  },
});

export const { clearAdminState, clearAdminData } = adminSlice.actions;

export default adminSlice.reducer;
