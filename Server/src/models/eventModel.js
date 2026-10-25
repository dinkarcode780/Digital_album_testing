import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    eventSubCategoryId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "SubCategory",
   },

    eventDate: {
      type: Date,
    },

    eventEndDate:{
        type: Date,
        default:null
    },

    location: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },

    brideName: {
      type: String,
      trim: true,
    },
    groomName: {
      type: String,
      trim: true,
    },
    isActive: {
    type: Boolean,
    default: true,
  },
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
