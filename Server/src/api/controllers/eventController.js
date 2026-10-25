import asyncHandler from "../../utils/asyncHandler.js";
import eventModel from "../../models/eventModel.js";
import subcategoryModel from "../../models/subCategoryModel.js";
import inviteModel from "../../models/inviteModel.js";
import userModel from "../../models/userModel.js";
import { escapeRegex } from "../../utils/escapeRegex.js";

const ensureEventAccess = async (req, eventId) => {
  const event = await eventModel.findById(eventId);

  if (!event) {
    return { event: null, allowed: false };
  }

  if (req.user?.userType === "SuperAdmin") {
    return { event, allowed: true };
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

    return { event, allowed: isOwner || !!inviteMatch };
  }

  if (req.user?.userType === "Admin") {
    const client = await userModel.findOne({
      _id: event.userId,
      userType: "User",
      ownerAdminId: req.user._id,
    });

    return { event, allowed: !!client };
  }

  return { event, allowed: false };
};

export const createEvent = asyncHandler(async (req, res) => {
  const {
    userId,
    eventSubCategoryId,
    eventDate,
    location,
    status,
    brideName,
    groomName,
  } = req.body;
  if (!userId || !eventSubCategoryId || !eventDate || !location) {
    return res.status(400).json({
      success: false,
      message:
        "userId, eventSubCategoryId, eventDate and location are required",
    });
  }

  if (req.user?.userType === "User" && String(req.user._id) !== String(userId)) {
    return res.status(403).json({
      success: false,
      message: "You can only create events for your own profile",
    });
  }

  if (req.user?.userType === "Admin") {
    const client = await userModel.findOne({
      _id: userId,
      userType: "User",
      ownerAdminId: req.user._id,
    });

    if (!client) {
      return res.status(403).json({
        success: false,
        message: "This client is not assigned to your studio",
      });
    }
  }

  const event = await eventModel.create({
    userId,
    adminId: req.user?.userType === "Admin" ? req.user._id : null,
    eventSubCategoryId,
    eventDate,
    location,
    status,
    brideName,
    groomName,
  });

  return res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: event,
  });
});

export const updateEvent = asyncHandler(async (req, res) => {
  // const { eventId } = req.params;
  const {
    eventId,
    userId,
    eventSubCategoryId,
    eventDate,
    eventEndDate,
    location,
    status,
    brideName,
    groomName,
  } = req.body;

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

  if (
    req.user?.userType === "User" &&
    String(event.userId) !== String(req.user._id)
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to update this event",
    });
  }

  if (req.user?.userType === "Admin") {
    const client = await userModel.findOne({
      _id: event.userId,
      userType: "User",
      ownerAdminId: req.user._id,
    });

    if (!client) {
      return res.status(403).json({
        success: false,
        message: "You can only update events from your assigned clients",
      });
    }
  }

  if (userId) {
    if (req.user?.userType === "User") {
      return res.status(403).json({
        success: false,
        message: "You cannot change the owner of an event",
      });
    }

    const targetClient = await userModel.findOne({
      _id: userId,
      userType: "User",
      ownerAdminId: req.user?.userType === "Admin" ? req.user._id : null,
    });

    if (req.user?.userType === "Admin" && !targetClient) {
      return res.status(403).json({
        success: false,
        message: "You can only assign this event to your own client",
      });
    }

    event.userId = userId;
  }

  if (eventSubCategoryId) {
    event.eventSubCategoryId = eventSubCategoryId;
  }

  if (eventDate) {
    event.eventDate = eventDate;
  }

  if (eventEndDate) {
    event.eventEndDate = eventEndDate;
  }

  if (location) {
    event.location = location;
  }

  if (status) {
    event.status = status;
  }

  if (brideName !== undefined) {
    event.brideName = brideName;
  }

  if (groomName !== undefined) {
    event.groomName = groomName;
  }

  await event.save();

  res.status(200).json({
    success: true,
    message: "Event updated successfully",
    data: event,
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: "eventId is required",
    });
  }

  const accessCheck = await ensureEventAccess(req, eventId);

  if (!accessCheck.event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  if (!accessCheck.allowed) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this event",
    });
  }

  const event = await eventModel
    .findById(eventId)
    .populate("userId", "name email phoneNumber")
    .populate({
      path: "eventSubCategoryId",
      select: "name categoryId",
      populate: {
        path: "categoryId",
        select: "name",
      },
    });

  res.status(200).json({
    success: true,
    message: "Feched event successfully",
    data: event,
  });
});

export const getEventByFilter = asyncHandler(async (req, res) => {
  const {
    search,
    userId,
    categoryId,
    eventSubCategoryId,
    status,
    page = 1,
    limit = 10,
  } = req.query;

  let filter = {};

  // If the logged in user is a regular User, ONLY show their events (owned or invited)
  if (req.user && req.user.userType === "User") {
    const userInvites = await inviteModel.find({
      $or: [
        ...(req.user.email ? [{ email: req.user.email.toLowerCase() }] : []),
        ...(req.user.phoneNumber ? [{ phoneNumber: req.user.phoneNumber }] : []),
      ],
    }).select("eventId");

    const invitedEventIds = userInvites.map((inv) => inv.eventId).filter(Boolean);

    filter.$or = [
      { userId: req.user._id },
      { _id: { $in: invitedEventIds } },
    ];
  } else if (req.user && req.user.userType === "Admin") {
    const clientUsers = await userModel
      .find({ userType: "User", ownerAdminId: req.user._id })
      .select("_id");

    const assignedClientIds = clientUsers.map((item) => item._id);

    if (userId) {
      if (!assignedClientIds.some((id) => String(id) === String(userId))) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to that client",
        });
      }
      filter.userId = userId;
    } else {
      filter.userId = { $in: assignedClientIds };
    }
  } else if (userId) {
    filter.userId = userId;
  }

  if (categoryId) {
    const subCats = await subcategoryModel.find({ categoryId }).select("_id");
    filter.eventSubCategoryId = { $in: subCats.map((s) => s._id) };
  }

  if (eventSubCategoryId) {
    filter.eventSubCategoryId = eventSubCategoryId;
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    const escapedSearch = escapeRegex(search);
    const searchConditions = [
      { brideName: { $regex: escapedSearch, $options: "i" } },
      { groomName: { $regex: escapedSearch, $options: "i" } },
      { location: { $regex: escapedSearch, $options: "i" } },
    ];

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
      delete filter.$or;
    } else {
      filter.$or = searchConditions;
    }
  }

  const skip = (Number(page) - 1) * Number(limit);
  const events = await eventModel
    .find(filter)
    .populate({
      path: "userId",
      select: "name email phoneNumber ownerAdminId",
      populate: {
        path: "ownerAdminId",
        select: "name email phoneNumber",
      },
    })
    .populate({
      path: "eventSubCategoryId",
      select: "name categoryId",
      populate: {
        path: "categoryId",
        select: "name",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalRecords = await eventModel.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: "All event fetched successfully",
    data: events,
    totalRecords,
    currentPage: Number(page),
    totalPages: Math.ceil(totalRecords / Number(limit)),
  });
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.query;

  if (!eventId) {
    return res.status(400).json({
      success: false,
      message: "eventId is required",
    });
  }

  const accessCheck = await ensureEventAccess(req, eventId);

  if (!accessCheck.event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  if (!accessCheck.allowed) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to delete this event",
    });
  }

  const event = await eventModel.findByIdAndDelete(eventId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
    data: event,
  });
});
