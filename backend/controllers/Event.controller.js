import asyncHandler from "../utils/asyncHandler.js";
import Event from "../models/Event.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/User.model.js";

export const createEvent = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to create an event" });
  }

  const { name } = req.body;

  const existedEvent = await Event.findOne({ name: name });
  if (existedEvent) {
    return res
      .status(400)
      .json({ success: false, message: "Event already exists" });
  }

  const posterLocalPath = req?.files?.poster[0]?.path;

  if (!posterLocalPath) {
    return res.status(400).json({ message: "poster is required" });
  }

  const cloudinaryPosterPath = await uploadOnCloudinary(posterLocalPath);
  let qrCodeLocalPath;
  if (req.files?.qrCode) {
    qrCodeLocalPath = req?.files?.qrCode[0]?.path;
  }

  const cloudinaryQrCodePath = await uploadOnCloudinary(qrCodeLocalPath);

  const event = await Event.create({
    poster: cloudinaryPosterPath?.url,
    qrCode: cloudinaryQrCodePath?.url || "",
    ...req.body,
  });

  const registerEvent = await event.save();
  return res.status(201).json(registerEvent);
});

export const getAllEvent = asyncHandler(async (req, res) => {
  const events = await Event.find({});

  if (events.length === 0) {
    return res.status(404).json({ message: "No events found" });
  }

  res.status(200).json({ message: "Event Found", events });
});

export const getEventById = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.status(200).json({ message: "Event found", event });
});

export const updateEventById = async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.userId;
  const user = await User.findById(userId);

  if (!user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to update this event" });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const eventData = req.body;

  // checking if event name alrady exist in databse (as it is unique)
  if (eventData.name) {
    const ifExisted = await Event.findOne({ name: eventData.name });
    if (ifExisted) {
      return res.status(409).json({
        message: "Event name already exists try using differnt event name",
      });
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, {
    new: true,
  });
  if (updatedEvent) {
    return res
      .status(200)
      .json({ message: "Event updated successfully", updatedEvent });
  }

  if (modifiedCount === 0) {
    return res.status(500).json({ message: "Unable to update event" });
  }
};

export const deleteEventById = async (req, res) => {
  const userId = req.userId;
  const eventId = req.params.eventId;

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const user = await User.findById(userId);

  if (!user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this event" });
  }

  const deletedEvent = await Event.findByIdAndDelete(eventId);
  if (deletedEvent) {
    return res
      .status(200)
      .json({ message: "Event deleted successfully", deletedEvent });
  } else {
    return res.status(500).json({ message: "Unable to delete event" });
  }
};
