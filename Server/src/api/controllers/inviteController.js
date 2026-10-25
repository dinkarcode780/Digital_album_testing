import crypto from "crypto";
import asyncHandler from "../../utils/asyncHandler.js";
import inviteModel from "../../models/inviteModel.js";
import eventModel from "../../models/eventModel.js";
import userModel from "../../models/userModel.js";
import { sendInviteEmail } from "../../utils/sendInviteEmail.js";
import { sendSmsInvite } from "../../utils/sendSmsInvite.js";
import { escapeRegex } from "../../utils/escapeRegex.js";

export const inviteUser = asyncHandler(async (req, res) => {
  const { eventId, name, email, phoneNumber } = req.body;

  if (!eventId || !name || (!email && !phoneNumber)) {
    return res.status(400).json({
      success: false,
      message: "Event, Name and Email or Phone Number are required",
    });
  }

  const event = await eventModel.findById(eventId);
  if (!event) {
    return res.status(404).json({ success: false, message: "Event not found" });
  }

  if (req.user.userType === "Admin") {
    const isEventAdmin = String(event.adminId) === String(req.user._id);
    if (!isEventAdmin) {
      const assignedClient = await userModel.findOne({
        _id: event.userId,
        userType: "User",
        ownerAdminId: req.user._id,
      });
      if (!assignedClient) {
        return res.status(403).json({ success: false, message: "Not authorized to invite for this event" });
      }
    }
  }

  const token = crypto.randomBytes(32).toString("hex");

  const invite = await inviteModel.create({
    eventId,
    name,
    email,
    phoneNumber,
    inviteToken: token,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  const inviteLink = `${process.env.CLIENT_URL}/invite/${token}`;

  if (email) {
    await sendInviteEmail(email, inviteLink);
  }

  if (phoneNumber) {
    await sendSmsInvite(phoneNumber, inviteLink);
  }

  res.status(201).json({
    success: true,
    message: "Invite sent successfully.",
    data: invite,
  });
});


export const verifyInvite = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Invite token is required.",
    });
  }

  const invite = await inviteModel
    .findOne({
      inviteToken: token,
    })
    .populate("eventId");

  if (!invite) {
    return res.status(404).json({
      success: false,
      message: "Invalid invitation link.",
    });
  }

  if (!invite.isActive) {
    return res.status(400).json({
      success: false,
      message: "This invitation has been disabled.",
    });
  }

  if (invite.isUsed) {
    return res.status(400).json({
      success: false,
      message: "This invitation has already been used.",
    });
  }

  if (invite.expiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message: "Invitation link has expired.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Invitation verified successfully.",
    data: {
      inviteId: invite._id,
      token: invite.inviteToken,
      eventId: invite.eventId?._id,
      event: invite.eventId,
      name: invite.name,
      email: invite.email,
      phoneNumber: invite.phoneNumber,
      status: invite.status,
    },
  });
});

export const getAllInviteByFilter = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    eventId,
    isActive,
  } = req.query;

  const query = {};

  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { email: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (status) {
    query.status = status;
  }

  if (eventId) {
    query.eventId = eventId;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const totalRecords = await inviteModel.countDocuments(query);

  const invites = await inviteModel
    .find(query)
    .populate("eventId")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res.status(200).json({
    success: true,
    message: "Invites fetched successfully.",
    data: invites,
    pagination: {
      totalRecords,
      currentPage: Number(page),
      totalPages: Math.ceil(totalRecords / limit),
      limit: Number(limit),
      hasNextPage: Number(page) < Math.ceil(totalRecords / limit),
      hasPrevPage: Number(page) > 1,
    },
  });
});