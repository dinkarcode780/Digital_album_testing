import asyncHandler from "../../utils/asyncHandler.js";
import mediaModel from "../../models/mediaModel.js";
import eventModel from "../../models/eventModel.js";
import inviteModel from "../../models/inviteModel.js";
import userModel from "../../models/userModel.js";
import { escapeRegex } from "../../utils/escapeRegex.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../middleware/multerS3.js";

const ensureMediaAccess = async (req, mediaId) => {
  const media = await mediaModel.findById(mediaId).populate("eventId");

  if (!media) {
    return { media: null, allowed: false };
  }

  const event = media.eventId;

  if (!event) {
    return { media, allowed: false };
  }

  if (req.user?.userType === "SuperAdmin") {
    return { media, allowed: true };
  }

  if (req.user?.userType === "User") {
    const isOwner = String(event.userId) === String(req.user._id);
    const inviteMatch = await inviteModel.findOne({
      eventId: event._id,
      $or: [
        ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
        ...(req.user.phoneNumber
          ? [{ phoneNumber: req.user.phoneNumber }]
          : []),
      ],
    });

    return { media, allowed: isOwner || !!inviteMatch };
  }

  if (req.user?.userType === "Admin") {
    const assignedClient = await userModel.findOne({
      _id: event.userId,
      userType: "User",
      ownerAdminId: req.user._id,
    });

    return { media, allowed: !!assignedClient };
  }

  return { media, allowed: false };
};
export const createMedia = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: "eventId is required",
    });
  }

  const event = await eventModel.findById(eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  if (req.user?.userType === "User" && String(event.userId) !== String(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to upload media for this event",
    });
  }

  if (req.user?.userType === "Admin") {
    const assignedClient = await userModel.findOne({
      _id: event.userId,
      userType: "User",
      ownerAdminId: req.user._id,
    });

    if (!assignedClient) {
      return res.status(403).json({
        success: false,
        message: "You can only upload media for your own assigned clients",
      });
    }
  }

  if (!req.files?.mediaFiles?.length) {
    return res.status(400).json({
      success: false,
      message: "Please upload at least one media file",
    });
  }

  // 1. Upload thumbnail (if present) in parallel with media files
  const thumbnailFile = req.files.thumbnail?.[0];
  const thumbnailPromise = thumbnailFile
    ? uploadToCloudinary(thumbnailFile, "eventThumbnail")
    : Promise.resolve(null);

  // 2. Upload all media files concurrently
  const mediaUploadPromises = req.files.mediaFiles.map((file) =>
    uploadToCloudinary(file, "eventMedia"),
  );

  // 3. Wait for all uploads (including thumbnail) to finish
  const [thumbnailResult, ...mediaResults] = await Promise.allSettled([
    thumbnailPromise,
    ...mediaUploadPromises,
  ]);

  // 4. Extract successful uploads
  const successfulThumbnail =
    thumbnailResult.status === "fulfilled" ? thumbnailResult.value : null;

  const successfulMedia = mediaResults
    .map((result, index) => ({ result, index }))
    .filter(({ result }) => result.status === "fulfilled" && result.value !== null);

  if (successfulMedia.length === 0) {
    return res.status(500).json({
      success: false,
      message: "All media uploads failed",
    });
  }

  // 5. Prepare documents for DB insertion
  const mediaDocs = successfulMedia.map(({ result, index }) => {
    const upload = result.value;
    const originalFile = req.files.mediaFiles[index];
    return {
      eventId,
      thumbnail: successfulThumbnail?.secure_url || "",
      videosOrImageUrl: upload.secure_url,
      videosOrImageUrlType: originalFile.mimetype.startsWith("video/")
        ? "Video"
        : "Image",
      thumbnailPublicId: successfulThumbnail?.public_id || "",
      // If you still want to store publicId per media, uncomment:
      publicId: upload.public_id,
      fileSizeBytes: originalFile.size || originalFile.buffer?.length || 0,
    };
  });

  // 6. Bulk insert into DB
  const savedMedia = await mediaModel.insertMany(mediaDocs);

  res.status(201).json({
    success: true,
    message: "Media uploaded successfully",
    data: savedMedia,
  });
});

export const updateMedia = asyncHandler(async (req, res) => {
  const { mediaId, isDownloadable, isActive } = req.body;

  if (!mediaId) {
    return res.status(400).json({
      success: false,
      message: "mediaId is required",
    });
  }

  const media = await mediaModel.findById(mediaId).populate("eventId");

  if (!media) {
    return res.status(404).json({
      success: false,
      message: "Media not found",
    });
  }

  const event = media.eventId;

  if (req.user?.userType === "User" && String(event?.userId) !== String(req.user._id)) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to update this media",
    });
  }

  if (req.user?.userType === "Admin") {
    const assignedClient = await userModel.findOne({
      _id: event?.userId,
      userType: "User",
      ownerAdminId: req.user._id,
    });

    if (!assignedClient) {
      return res.status(403).json({
        success: false,
        message: "You can only update media for your own assigned clients",
      });
    }
  }

  // Update Thumbnail
  if (req.files?.thumbnail?.length) {
    if (media.thumbnailPublicId) {
      await deleteFromCloudinary(media.thumbnailPublicId, "image");
    }

    const thumbnailUpload = await uploadToCloudinary(
      req.files.thumbnail[0],
      "eventThumbnail",
    );

    if (thumbnailUpload) {
      media.thumbnail = thumbnailUpload.secure_url;
      media.thumbnailPublicId = thumbnailUpload.public_id;
    }
  }

  // Update Media File
  if (req.files?.mediaFile?.length) {
    await deleteFromCloudinary(
      media.publicId,
      media.videosOrImageUrlType === "Video" ? "video" : "image",
    );

    const uploadResult = await uploadToCloudinary(
      req.files.mediaFile[0],
      "eventMedia",
    );

    if (uploadResult) {
      media.videosOrImageUrl = uploadResult.secure_url;
      media.publicId = uploadResult.public_id;
      media.videosOrImageUrlType = req.files.mediaFile[0].mimetype.startsWith(
        "video/",
      )
        ? "Video"
        : "Image";
      media.fileSizeBytes = req.files.mediaFile[0].size || req.files.mediaFile[0].buffer?.length || 0;
    }
  }

  if (isDownloadable !== undefined) {
    media.isDownloadable = isDownloadable === "true" || isDownloadable === true;
  }

  if (isActive !== undefined) {
    media.isActive = isActive === "true" || isActive === true;
  }

  await media.save();

  res.status(200).json({
    success: true,
    message: "Media updated successfully",
    data: media,
  });
});

export const iSdownload = asyncHandler(async (req, res) => {
  const mediaId = req.body?.mediaId || req.query?.mediaId;

  if (!mediaId) {
    return res.status(400).json({
      success: false,
      message: "mediaId is required",
    });
  }

  const accessCheck = await ensureMediaAccess(req, mediaId);

  if (!accessCheck.media) {
    return res.status(404).json({
      success: false,
      message: "Media not found",
    });
  }

  if (!accessCheck.allowed) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to update this media",
    });
  }

  const media = accessCheck.media;

  media.isDownloadable = !media.isDownloadable;

  await media.save();

  res.status(200).json({
    success: true,
    message: `Media ${
      media.isDownloadable ? "download enabled" : "download disabled"
    } successfully`,
    data: media,
  });
});

export const toggleMediaActive = asyncHandler(async (req, res) => {
  const mediaId = req.body?.mediaId || req.query?.mediaId;

  if (!mediaId) {
    return res.status(400).json({
      success: false,
      message: "mediaId is required",
    });
  }

  const accessCheck = await ensureMediaAccess(req, mediaId);

  if (!accessCheck.media) {
    return res.status(404).json({
      success: false,
      message: "Media not found",
    });
  }

  if (!accessCheck.allowed) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to update this media",
    });
  }

  const media = accessCheck.media;

  media.isActive = !media.isActive;
  await media.save();

  res.status(200).json({
    success: true,
    message: `Media ${media.isActive ? "activated" : "deactivated"} successfully`,
    data: media,
  });
});

export const getMediaById = asyncHandler(async (req, res) => {
  const { mediaId } = req.query;

  if (!mediaId) {
    return res.status(400).json({
      success: false,
      message: "mediaId is required",
    });
  }

  const accessCheck = await ensureMediaAccess(req, mediaId);

  if (!accessCheck.media) {
    return res.status(404).json({
      success: false,
      message: "Media not found",
    });
  }

  if (!accessCheck.allowed) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to view this media",
    });
  }

  const media = await mediaModel.findById(mediaId).populate({
    path: "eventId",
    populate: [
      {
        path: "userId",
        select: "name email phoneNumber",
      },
      {
        path: "eventSubCategoryId",
        select: "name description categoryId",
        populate: {
          path: "categoryId",
          select: "name description",
        },
      },
    ],
  });

  res.status(200).json({
    success: true,
    message: "Media fetched successfully",
    data: media,
  });
});

export const getMediaByFilter = asyncHandler(async (req, res) => {
  const {
    search,
    eventId,
    userId,
    eventSubCategoryId,
    categoryId,
    mediaType,
    isDownloadable,
    isActive,
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};

  // User Filter: If regular User, ONLY show media of events they own or are invited to
  if (req.user && req.user.userType === "User") {
    const userInvites = await inviteModel.find({
      $or: [
        ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
        ...(req.user.phoneNumber ? [{ phoneNumber: req.user.phoneNumber }] : []),
      ],
    }).select("eventId");

    const invitedEventIds = userInvites.map((inv) => inv.eventId).filter(Boolean);

    const allowedEvents = await eventModel.find({
      $or: [
        { userId: req.user._id },
        { _id: { $in: invitedEventIds } },
      ],
    }).select("_id");

    filter.eventId = {
      $in: allowedEvents.map((item) => item._id),
    };
  } else if (req.user && req.user.userType === "Admin") {
    const assignedUsers = await userModel
      .find({ userType: "User", ownerAdminId: req.user._id })
      .select("_id");

    const assignedUserIds = assignedUsers.map((item) => item._id);

    if (userId) {
      if (!assignedUserIds.some((id) => String(id) === String(userId))) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to that client",
        });
      }

      const userEvents = await eventModel.find({ userId }).select("_id");
      filter.eventId = {
        $in: userEvents.map((item) => item._id),
      };
    } else {
      const adminEvents = await eventModel
        .find({ userId: { $in: assignedUserIds } })
        .select("_id");

      filter.eventId = {
        $in: adminEvents.map((item) => item._id),
      };
    }
  } else if (userId) {
    const userEvents = await eventModel.find({ userId }).select("_id");
    filter.eventId = {
      $in: userEvents.map((item) => item._id),
    };
  }

  // Event Filter
  if (eventId) {
    filter.eventId = eventId;
  }

  if (eventSubCategoryId) {
    const events = await eventModel.find({ eventSubCategoryId }).select("_id");

    filter.eventId = {
      $in: events.map((item) => item._id),
    };
  }

  if (categoryId) {
    const events = await eventModel
      .find()
      .populate({
        path: "eventSubCategoryId",
        match: { categoryId },
        select: "_id",
      })
      .select("_id eventSubCategoryId");

    filter.eventId = {
      $in: events
        .filter((item) => item.eventSubCategoryId)
        .map((item) => item._id),
    };
  }

  // Media Type Filter
  if (mediaType) {
    filter.videosOrImageUrlType = mediaType;
  }

  // Download Permission Filter
  if (isDownloadable !== undefined) {
    filter.isDownloadable = isDownloadable === "true";
  }

  // Active Status Filter
  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  // Search
  if (search) {
    const escapedSearch = escapeRegex(search);
    filter.$or = [
      {
        videosOrImageUrlType: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const media = await mediaModel
    .find(filter)
    .populate({
      path: "eventId",
      select: "brideName groomName location status eventDate",
      populate: [
        {
          path: "userId",
          select: "name email phoneNumber ownerAdminId",
          populate: {
            path: "ownerAdminId",
            select: "name email phoneNumber",
          },
        },
        {
          path: "eventSubCategoryId",
          select: "name description categoryId",
          populate: {
            path: "categoryId",
            select: "name",
          },
        },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalRecords = await mediaModel.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: "Media fetched successfully",
    data: media,
    totalRecords,
    currentPage: Number(page),
    totalPages: Math.ceil(totalRecords / Number(limit)),
  });
});

export const deleteMedia = asyncHandler(async (req, res) => {
  const mediaId = req.body?.mediaId || req.query?.mediaId;

  if (!mediaId) {
    return res.status(400).json({
      success: false,
      message: "mediaId is required",
    });
  }

  const accessCheck = await ensureMediaAccess(req, mediaId);

  if (!accessCheck.media) {
    return res.status(404).json({
      success: false,
      message: "Media not found",
    });
  }

  if (!accessCheck.allowed) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to delete this media",
    });
  }

  const media = accessCheck.media;

  // Delete Media File from Cloudinary
  if (media.publicId) {
    await deleteFromCloudinary(
      media.publicId,
      media.videosOrImageUrlType === "Video" ? "video" : "image",
    );
  }

  // Check if thumbnail is used by another media
  if (media.thumbnailPublicId) {
    const thumbnailUsed = await mediaModel.countDocuments({
      thumbnailPublicId: media.thumbnailPublicId,
      _id: { $ne: media._id },
    });

    if (thumbnailUsed === 0) {
      await deleteFromCloudinary(media.thumbnailPublicId, "image");
    }
  }

  await media.deleteOne();

  res.status(200).json({
    success: true,
    message: "Media deleted successfully",
  });
});
