import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventCategory",
  },

  name: {
    type: String,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

const SubCategory = mongoose.model(
  "SubCategory",
  subCategorySchema
);

export default SubCategory;