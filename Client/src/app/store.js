import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./admin/adminSlice";
import authReducer from "./auth/authSlice";
import inviteReducer from "./invite/inviteSlice";
import eventReducer from "./event/eventSlice";
import eventCategoryReducer from "./category/categorySlice";
import subCategoryReducer from "./subcategory/subcategorySlice";
import mediaReducer from "./media/mediaSlice";
import slectedmediaReducer from "./slectedmedia/slectedmediaSlice";
import bookingReducer from "./booking/bookingSlice";
import blogReducer from "./blog/blogSlice";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    invite: inviteReducer,
    event: eventReducer,
    eventCategory: eventCategoryReducer,
    subCategory: subCategoryReducer,
    media: mediaReducer,
    slectedmedia: slectedmediaReducer,
    booking: bookingReducer,
    blog: blogReducer,
  },
});
