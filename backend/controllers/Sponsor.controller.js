import asyncHandler from "../utils/asyncHandler.js";
import Sponsor from "../models/Sponsor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/User.model.js";

//Adding Sponsor
export const addSponsor = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to create an event" });
  }

  const { name } = req.body;

  const existedSponsor = await Sponsor.findOne({ name: name });
  if (existedSponsor) {
    return res
      .status(400)
      .json({ success: false, message: "Sponsor already exists" });
  }

  const logoLocalPath = req?.files?.path;

  if (!logoLocalPath) {
    return res.status(400).json({ message: "Logo is required" });
  }

  const cloudinaryLogoPath = await uploadOnCloudinary(logoLocalPath);
  let qrCodeLocalPath;
  if (req.files?.qrCode) {
    qrCodeLocalPath = req?.files?.qrCode[0]?.path;
  }

  const cloudinaryQrCodePath = await uploadOnCloudinary(qrCodeLocalPath);

  const newsponsor = await Sponsor.create({
    logo: cloudinaryLogoPath?.url,
    qrCode: cloudinaryQrCodePath?.url || "",
    ...req.body,
  });

  res
  .status(201)
  .json({ message: "Sponsor added successfully", sponsor: newsponsor });
});


//Get All Sponsors
export const getAllSponsor = asyncHandler(async (req, res) => {
  const sponsors = await Sponsor.find({});

  if (sponsors.length === 0) {
    return res.status(404).json({ message: "No sponsors found" });
  }

  res.status(200).json({ message: "Sponsor Found", sponsors });
});

//Get Sponsor Using Id
export const getSponsorById = asyncHandler(async (req, res) => {
  const sponsorId = req.params.sponsorId;

  const sponsor = await Event.findById(sponsorId);
  if (!sponsor) {
    return res.status(404).json({ message: "Sponsor not found" });
  }
  res.status(200).json({ message: "Sponsor found", sponsor });
});


//Update Sponsor Using Id
export const updateSponsorById = async (req, res) => {
  const sponsorId = req.params.sponsorId;
  const userId = req.userId;
  const user = await User.findById(userId);

  if (!user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to update this event" });
  }

  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) {
    return res.status(404).json({ message: "Sponsor not found" });
  }

  const SponsorData = req.body;


  const updatedSponsor = await Sponsor.findByIdAndUpdate(sponsorId, SponsorData, {
    new: true,
  });
  if (updatedSponsor) {
    return res
      .status(200)
      .json({ message: "Sponsor updated successfully", updatedSponsor });
  }

  return res.status(500).json({ message: "Unable to update sponsor" });
};


//Delete Sponsor Using Id
export const deleteSponsorById = async (req, res) => {
  const userId = req.userId;
  const sponsorId = req.params.sponsorId;

  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) {
    return res.status(404).json({ message: "Sponsor not found" });
  }

  const user = await User.findById(userId);

  if (!user.isAdmin) {
    return res
      .status(403)
      .json({ message: "You do not have permission to delete this sponsor" });
  }

  const deletedSponsor = await Sponsor.findByIdAndDelete(sponsorId);
  if (deletedSponsor) {
    return res
      .status(200)
      .json({ message: "Sponsor deleted successfully", deletedSponsor });
  } else {
    return res.status(500).json({ message: "Unable to delete sponsor" });
  }
};
