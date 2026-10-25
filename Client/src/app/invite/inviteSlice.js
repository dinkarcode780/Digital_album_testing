import { createSlice } from "@reduxjs/toolkit";
import { getAllInviteByFilter, inviteUser, verifyInvite } from "./inviteThunk";

const initialState = {
  loading: false,
  success: false,
  error: null,
  message: "",

  invite: null,
  verifiedInvite: null,
};

const inviteSlice = createSlice({
  name: "invite",
  initialState,
  reducers: {
    resetInviteState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.message = "";
      state.invite = null;
      state.verifiedInvite = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= Invite User =================

      .addCase(inviteUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(inviteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.invite = action.payload.data;
      })

      .addCase(inviteUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })

      // ================= Verify Invite =================

      .addCase(verifyInvite.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(verifyInvite.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.verifiedInvite = action.payload.data;
      })

      .addCase(verifyInvite.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      })
      // ================= Get All Invites =================

      .addCase(getAllInviteByFilter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllInviteByFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.invites = action.payload.data;
        state.pagination = action.payload.pagination;
        state.message = action.payload.message;
      })

      .addCase(getAllInviteByFilter.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message;
      });
  },
});

export const { resetInviteState } = inviteSlice.actions;

export default inviteSlice.reducer;