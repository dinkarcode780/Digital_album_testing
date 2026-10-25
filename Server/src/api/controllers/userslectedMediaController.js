import asyncHandler from "../../utils/asyncHandler.js";
import UserselectedMedia from "../../models/userslectedMediaModel.js";
import mediaModel from "../../models/mediaModel.js";
import eventModel from "../../models/eventModel.js";

// 1. Save or Update bulk media selection for an event
export const saveUserSelectedMedia = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { eventId, selectedMedia } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: "eventId is required",
    });
  }

  // Verify event exists
  const event = await eventModel.findById(eventId);
  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  // Format selectedMedia input (support array of mediaIds or array of objects with {mediaId, comment})
  let formattedSelectedMedia = [];
  if (Array.isArray(selectedMedia)) {
    formattedSelectedMedia = selectedMedia.map((item) => {
      if (typeof item === "string" || item instanceof String) {
        return { mediaId: item, comment: "" };
      }
      return {
        mediaId: item.mediaId || item._id,
        comment: item.comment || "",
      };
    }).filter((item) => Boolean(item.mediaId));
  }

  // Check if user already has a selection for this event
  let userSelection = await UserselectedMedia.findOne({ userId, eventId });

  if (userSelection) {
    if (userSelection.isLocked) {
      return res.status(400).json({
        success: false,
        message: "This selection is locked and submitted. Cannot be modified.",
      });
    }

    userSelection.selectedMedia = formattedSelectedMedia;
    await userSelection.save();
  } else {
    userSelection = await UserselectedMedia.create({
      userId,
      eventId,
      selectedMedia: formattedSelectedMedia,
      status: "Pending",
      isLocked: false,
    });
  }

  const populatedData = await UserselectedMedia.findById(userSelection._id)
    .populate({
      path: "selectedMedia.mediaId",
      select: "videosOrImageUrl videosOrImageUrlType thumbnail isDownloadable isActive",
    })
    .populate({
      path: "eventId",
      select: "brideName groomName location eventDate status eventSubCategoryId",
      populate: {
        path: "eventSubCategoryId",
        select: "name",
      },
    });

  res.status(200).json({
    success: true,
    message: "Selected media saved successfully",
    data: populatedData,
  });
});

// 2. Toggle Favorite / Select Single Media
export const toggleMediaSelection = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  let { eventId, mediaId, comment } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  if (!mediaId) {
    return res.status(400).json({
      success: false,
      message: "mediaId is required",
    });
  }

  // If eventId is not provided, look up the media item to find eventId
  const mediaItem = await mediaModel.findById(mediaId);
  if (!mediaItem) {
    return res.status(404).json({
      success: false,
      message: "Media item not found",
    });
  }

  if (!eventId) {
    eventId = mediaItem.eventId;
  }

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: "Could not determine eventId for the specified media",
    });
  }

  let userSelection = await UserselectedMedia.findOne({ userId, eventId });
  let isSelected = false;

  if (userSelection) {
    if (userSelection.isLocked) {
      return res.status(400).json({
        success: false,
        message: "This selection is locked and submitted. Cannot be modified.",
      });
    }

    const existingIndex = userSelection.selectedMedia.findIndex(
      (item) => item.mediaId?.toString() === mediaId.toString()
    );

    if (existingIndex > -1) {
      // Remove from selection (unfavorite)
      userSelection.selectedMedia.splice(existingIndex, 1);
      isSelected = false;
    } else {
      // Add to selection (favorite)
      userSelection.selectedMedia.push({
        mediaId,
        comment: comment || "",
      });
      isSelected = true;
    }

    await userSelection.save();
  } else {
    // Create new selection document
    userSelection = await UserselectedMedia.create({
      userId,
      eventId,
      selectedMedia: [{ mediaId, comment: comment || "" }],
      status: "Pending",
      isLocked: false,
    });
    isSelected = true;
  }

  const populatedData = await UserselectedMedia.findById(userSelection._id)
    .populate({
      path: "selectedMedia.mediaId",
      select: "videosOrImageUrl videosOrImageUrlType thumbnail isDownloadable isActive",
    })
    .populate({
      path: "eventId",
      select: "brideName groomName location eventDate status eventSubCategoryId",
      populate: {
        path: "eventSubCategoryId",
        select: "name",
      },
    });

  res.status(200).json({
    success: true,
    message: isSelected ? "Added to favorites / selection" : "Removed from favorites / selection",
    isSelected,
    totalSelected: userSelection.selectedMedia.length,
    data: populatedData,
  });
});

// 3. Get Logged-in User's Selected Media / Favorites (Frontend Favorites & Album Selection)
export const getMySelectedMedia = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { eventId, status, type, search } = req.query;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const filter = { userId };
  if (eventId) filter.eventId = eventId;
  if (status) filter.status = status;

  const selections = await UserselectedMedia.find(filter)
    .populate({
      path: "selectedMedia.mediaId",
      select: "videosOrImageUrl videosOrImageUrlType thumbnail isDownloadable isActive createdAt",
    })
    .populate({
      path: "eventId",
      select: "brideName groomName location eventDate status eventSubCategoryId",
      populate: {
        path: "eventSubCategoryId",
        select: "name",
      },
    })
    .sort({ updatedAt: -1 });

  // Extract a flattened favorites list for easy frontend rendering
  let favoritesList = [];
  selections.forEach((sel) => {
    const eventInfo = sel.eventId || {};
    const eventTitle =
      [eventInfo.brideName, eventInfo.groomName].filter(Boolean).join(" & ") ||
      eventInfo.eventSubCategoryId?.name ||
      eventInfo.location ||
      "Album Event";

    sel.selectedMedia.forEach((item) => {
      if (item.mediaId) {
        favoritesList.push({
          selectionId: sel._id,
          selectionStatus: sel.status,
          isLocked: sel.isLocked,
          comment: item.comment,
          mediaId: item.mediaId._id,
          url: item.mediaId.videosOrImageUrl,
          thumbnail: item.mediaId.thumbnail || item.mediaId.videosOrImageUrl,
          type: item.mediaId.videosOrImageUrlType || "Image",
          isDownloadable: item.mediaId.isDownloadable,
          eventId: eventInfo._id,
          eventTitle,
          eventDate: eventInfo.eventDate,
          location: eventInfo.location,
          createdAt: item.mediaId.createdAt,
        });
      }
    });
  });

  // Apply optional filtering on flattened favorites
  if (type && type !== "All") {
    if (type === "Photos" || type === "Image") {
      favoritesList = favoritesList.filter((f) => f.type === "Image");
    } else if (type === "Videos" || type === "Video") {
      favoritesList = favoritesList.filter((f) => f.type === "Video");
    }
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    favoritesList = favoritesList.filter(
      (f) =>
        f.eventTitle?.toLowerCase().includes(q) ||
        f.location?.toLowerCase().includes(q) ||
        f.comment?.toLowerCase().includes(q)
    );
  }

  res.status(200).json({
    success: true,
    message: "User selected media retrieved successfully",
    count: favoritesList.length,
    data: selections,
    favorites: favoritesList,
  });
});

// 4. Submit / Finalize Selection (Lock for Admin Review)
export const submitUserSelectedMedia = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { eventId, selectionId } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const query = selectionId ? { _id: selectionId, userId } : { eventId, userId };
  const userSelection = await UserselectedMedia.findOne(query);

  if (!userSelection) {
    return res.status(404).json({
      success: false,
      message: "Selection not found",
    });
  }

  if (userSelection.selectedMedia.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot submit empty selection. Please select at least one media item.",
    });
  }

  userSelection.isLocked = true;
  userSelection.status = "Pending";
  userSelection.submittedAt = new Date();
  await userSelection.save();

  res.status(200).json({
    success: true,
    message: "Media selection submitted and locked successfully",
    data: userSelection,
  });
});

// 5. Remove Single Media from Selection
export const removeMediaFromSelection = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { eventId, mediaId } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  if (!eventId || !mediaId) {
    return res.status(400).json({
      success: false,
      message: "eventId and mediaId are required",
    });
  }

  const userSelection = await UserselectedMedia.findOne({ userId, eventId });
  if (!userSelection) {
    return res.status(404).json({
      success: false,
      message: "Selection not found for this event",
    });
  }

  if (userSelection.isLocked) {
    return res.status(400).json({
      success: false,
      message: "Selection is locked and cannot be modified",
    });
  }

  userSelection.selectedMedia = userSelection.selectedMedia.filter(
    (item) => item.mediaId?.toString() !== mediaId.toString()
  );

  await userSelection.save();

  res.status(200).json({
    success: true,
    message: "Media removed from selection",
    totalSelected: userSelection.selectedMedia.length,
    data: userSelection,
  });
});

// 6. Clear Selection for an Event
export const clearUserSelectedMedia = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { eventId } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: "eventId is required",
    });
  }

  const userSelection = await UserselectedMedia.findOne({ userId, eventId });
  if (!userSelection) {
    return res.status(404).json({
      success: false,
      message: "Selection not found for this event",
    });
  }

  if (userSelection.isLocked) {
    return res.status(400).json({
      success: false,
      message: "Selection is locked and cannot be modified",
    });
  }

  userSelection.selectedMedia = [];
  await userSelection.save();

  res.status(200).json({
    success: true,
    message: "Selection cleared successfully",
    data: userSelection,
  });
});

// ==================== ADMIN CONTROLLERS ====================

// 7. Get All User Selected Media (Admin)
export const getAllUserSelectedMedia = asyncHandler(async (req, res) => {
  const { eventId, userId, status, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (eventId) filter.eventId = eventId;
  if (userId) filter.userId = userId;
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const total = await UserselectedMedia.countDocuments(filter);
  const selections = await UserselectedMedia.find(filter)
    .populate({
      path: "userId",
      select: "name email phoneNumber profileImage",
    })
    .populate({
      path: "eventId",
      select: "brideName groomName location eventDate status eventSubCategoryId",
      populate: {
        path: "eventSubCategoryId",
        select: "name",
      },
    })
    .populate({
      path: "selectedMedia.mediaId",
      select: "videosOrImageUrl videosOrImageUrlType thumbnail isDownloadable isActive",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    message: "All user selected media fetched successfully",
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    data: selections,
  });
});

// 8. Get Single User Selection By ID (Admin or User)
export const getUserSelectedMediaById = asyncHandler(async (req, res) => {
  const { selectionId, id } = req.query;
  const targetId = selectionId || id;

  if (!targetId) {
    return res.status(400).json({
      success: false,
      message: "Selection ID is required",
    });
  }

  const selection = await UserselectedMedia.findById(targetId)
    .populate({
      path: "userId",
      select: "name email phoneNumber profileImage",
    })
    .populate({
      path: "eventId",
      select: "brideName groomName location eventDate status eventSubCategoryId",
      populate: {
        path: "eventSubCategoryId",
        select: "name",
      },
    })
    .populate({
      path: "selectedMedia.mediaId",
      select: "videosOrImageUrl videosOrImageUrlType thumbnail isDownloadable isActive",
    });

  if (!selection) {
    return res.status(404).json({
      success: false,
      message: "Selection not found",
    });
  }

  const isOwner = selection.userId && selection.userId._id.toString() === req.user._id.toString();
  const isSuperAdmin = req.user.userType === "SuperAdmin";
  const isAdmin = req.user.userType === "Admin";
  if (!isOwner && !isAdmin && !isSuperAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized to view this selection" });
  }

  res.status(200).json({
    success: true,
    message: "Selection details fetched successfully",
    data: selection,
  });
});

// 9. Update Selection Status & Admin Notes (Admin)
export const updateSelectionStatus = asyncHandler(async (req, res) => {
  const { selectionId, status, adminNotes, isLocked } = req.body;

  if (!selectionId) {
    return res.status(400).json({
      success: false,
      message: "selectionId is required",
    });
  }

  const selection = await UserselectedMedia.findById(selectionId);
  if (!selection) {
    return res.status(404).json({
      success: false,
      message: "Selection not found",
    });
  }

  if (status) {
    const validStatuses = ["Pending", "Reviewed", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }
    selection.status = status;
  }

  if (adminNotes !== undefined) {
    selection.adminNotes = adminNotes;
  }

  if (isLocked !== undefined) {
    selection.isLocked = Boolean(isLocked);
  }

  await selection.save();

  const updatedSelection = await UserselectedMedia.findById(selectionId)
    .populate({
      path: "userId",
      select: "name email phoneNumber profileImage",
    })
    .populate({
      path: "eventId",
      select: "brideName groomName location eventDate status",
    })
    .populate({
      path: "selectedMedia.mediaId",
      select: "videosOrImageUrl videosOrImageUrlType thumbnail isDownloadable isActive",
    });

  res.status(200).json({
    success: true,
    message: "Selection status updated successfully",
    data: updatedSelection,
  });
});

// 10. Delete User Selected Media (Admin)
export const deleteUserSelectedMedia = asyncHandler(async (req, res) => {
  const { selectionId, id } = req.query.selectionId || req.query.id ? req.query : req.body;
  const targetId = selectionId || id;

  if (!targetId) {
    return res.status(400).json({
      success: false,
      message: "selectionId is required",
    });
  }

  const selection = await UserselectedMedia.findById(targetId);

  if (!selection) {
    return res.status(404).json({
      success: false,
      message: "Selection not found",
    });
  }

  if (req.user.userType !== "SuperAdmin") {
    const isOwner = String(selection.userId) === String(req.user._id);
    if (!isOwner) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this selection" });
    }
  }

  await selection.deleteOne();

  res.status(200).json({
    success: true,
    message: "Selection deleted successfully",
  });
});