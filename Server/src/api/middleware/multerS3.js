import dotenv from "dotenv";
dotenv.config();

import path from "path";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/heic",
  "image/heif",
  "video/mp4",
  "video/quicktime",
  "video/x-matroska",
  "video/mkv",
  "video/webm",
  "video/avi",
  "video/x-msvideo",
  "video/x-m4v",
  "video/3gpp",
  "video/3gpp2",
];

export const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".heic", ".heif",
      ".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v", ".3gp", ".3g2",
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(file.mimetype.toLowerCase()) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos are allowed"));
    }
  },

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export const uploadToCloudinary = (file, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return result;
  } catch (error) {
    throw error;
  }
};
