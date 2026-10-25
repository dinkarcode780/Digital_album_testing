import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Blog category is required"],
      trim: true,
    },
    author: {
      type: String,
      default: "Album Studio",
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Blog image is required"],
      trim: true,
    },
    publicId: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const blogModel = mongoose.model("Blog", blogSchema);

export default blogModel;