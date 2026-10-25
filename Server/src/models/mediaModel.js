import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({

    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
    },

    thumbnail: {
        type: String
    },
    
    videosOrImageUrl:{
        type:String,

    },

    videosOrImageUrlType:{
        type:String,
        enum:["Video","Image"],
        default:"Image"
    },

    isDownloadable: {
        type: Boolean,
        default: false
    },

   publicId: {                   
        type: String,
    },

    fileSizeBytes: {
        type: Number,
        default: 0,
    },

    thumbnailPublicId: {
      type: String,
    },

    isActive: {
        type: Boolean,
        default: true
    }


},{timestamps:true});


const Media = mongoose.model("Media",mediaSchema);

export default Media;