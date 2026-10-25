import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    
    heroTitle: {
      type: String,
      required: true,
      trim: true,
    },

    heroDescription: {
      type: String,
      required: true,
      trim: true,
    },

    heroImage: {
      type: String,
      required: true,
    },

    heroImagePublicId: {
      type: String,
      required: true,
    },


    missionTitle: {
      type: String,
      required: true,
      trim: true,
    },

    missionDescription: {
      type: String,
      required: true,
      trim: true,
    },

    missionImage: {
      type: String,
      required: true,
    },

    missionImagePublicId: {
      type: String,
      required: true,
    },


    statistics: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },

        value: {
          type: String,
          required: true,
          trim: true,
        },

        icon: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],


    features: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const About = mongoose.model("About", aboutSchema);

export default About;