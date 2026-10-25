import mongoose from "mongoose";

const eventCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
   categoryImage: {
      type: String,
    },

    publicId: {
      type: String,
      default: "",
    },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const EventCategory = mongoose.model("EventCategory", eventCategorySchema);

export default EventCategory;