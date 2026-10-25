import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  isSent: {
    type: Boolean,
    default: false
  },

  sentAt: {
    type: Date
  },

  isOpened: {
    type: Boolean,
    default: false
  },

  openedAt: {
    type: Date
  }


},{timestamps:true});

const Email = mongoose.model("Email",emailSchema);

export default Email;