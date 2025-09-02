import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Gallery from "../models/Gallery.model.js";
import User from "../models/User.model.js";

// ✅ Upload multiple images to a category & year
export const uploadImage = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId);

  if (!user?.isAdmin) {
    return res.status(403).json({ message: "Only admins can upload images." });
  }

  const imageFiles = req?.files?.image;
  const { title = "Others", year = "2k26" } = req.body;

  if (!imageFiles || imageFiles.length === 0) {
    return res.status(400).json({ message: "At least one image file is required." });
  }

  // Upload all images to Cloudinary
  const uploadedImages = await Promise.all(
    imageFiles.map(async (file) => {
      const uploaded = await uploadOnCloudinary(file.path);
      return {
        url: uploaded.url,
      };
    })
  );

  // Check if a gallery for the category and year already exists
  let gallery = await Gallery.findOne({ title, year });

  if (gallery) {
    gallery.images.push(...uploadedImages);
    await gallery.save();
  } else {
    gallery = await Gallery.create({
      title,
      year,
      images: uploadedImages,
    });
  }

  res.status(201).json({ message: "Images uploaded successfully", gallery });
});

// ✅ Get all galleries (all categories and years)
export const getAllImages = asyncHandler(async (req, res) => {
  const galleries = await Gallery.find().sort({ createdAt: -1 });
  res.status(200).json({ message: "All galleries fetched", galleries });
});

// ✅ Get single gallery by ID
export const getImageById = asyncHandler(async (req, res) => {
  const galleryId = req.params.imageId;
  const gallery = await Gallery.findById(galleryId);
  if (!gallery) {
    return res.status(404).json({ message: "Gallery not found" });
  }

  res.status(200).json({ message: "Gallery found", gallery });
});

// ✅ Delete entire gallery by ID (admin only)
export const deleteImageById = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const galleryId = req.params.imageId;

  const user = await User.findById(userId);
  if (!user?.isAdmin) {
    return res.status(403).json({ message: "Only admins can delete galleries." });
  }

  const gallery = await Gallery.findById(galleryId);
  if (!gallery) {
    return res.status(404).json({ message: "Gallery not found" });
  }

  await Gallery.findByIdAndDelete(galleryId);

  res.status(200).json({ message: "Gallery deleted successfully", gallery });
});

// ✅ Get galleries by category (title only)
export const getImagesByCategory = asyncHandler(async (req, res) => {
  const { title } = req.params;
  const galleries = await Gallery.find({ title });
  if (!galleries || galleries.length === 0) {
    return res.status(404).json({ message: "No galleries found for this category" });
  }
  res.status(200).json({ message: "Images by category fetched", galleries });
});

// ✅ Get galleries by year only
export const getImagesByYear = asyncHandler(async (req, res) => {
  const { year } = req.params;
  const galleries = await Gallery.find({ year });
  if (!galleries || galleries.length === 0) {
    return res.status(404).json({ message: "No galleries found for this year" });
  }
  res.status(200).json({ message: "Images by year fetched", galleries });
});

// ✅ Get gallery by category and year
export const getImagesByCategoryAndYear = asyncHandler(async (req, res) => {
  const { title, year } = req.params;
  const gallery = await Gallery.findOne({ title, year });
  if (!gallery) {
    return res.status(404).json({ message: "No gallery found for this category and year" });
  }

  res.status(200).json({ message: "Images by category and year fetched", gallery });
});
