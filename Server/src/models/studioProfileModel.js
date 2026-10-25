import mongoose from "mongoose";

const showcaseAlbumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: "Wedding",
    trim: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  mediaUrls: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const studioProfileSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studioName: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: "Capturing Your Best Moments Forever",
      trim: true,
    },
    aboutBio: {
      type: String,
      default:
        "We are a professional photography and cinematography studio specializing in weddings, pre-wedding shoots, events, and portrait photography with modern high-end equipment.",
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    coverBanner: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    },
    phoneNumber: {
      type: String,
      default: "",
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    city: {
      type: String,
      default: "Patna",
      trim: true,
    },
    state: {
      type: String,
      default: "Bihar",
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    eventsCompleted: {
      type: Number,
      default: 150,
    },
    specialties: {
      type: [String],
      default: ["Wedding Photography", "Pre-Wedding Shoot", "Cinematic Film", "Candid", "Drone Shoots"],
    },
    pricingStartingFrom: {
      type: Number,
      default: 15000,
    },
    googleMapLink: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    youtube: {
      type: String,
      default: "",
    },
    websiteUrl: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    reviewsCount: {
      type: Number,
      default: 24,
    },
    showcaseAlbums: [showcaseAlbumSchema],
  },
  {
    timestamps: true,
  }
);

const StudioProfile = mongoose.model("StudioProfile", studioProfileSchema);

export default StudioProfile;
