import express from "express";
import {
  uploadImage,
  getAllImages,
  getImageById,
  deleteImageById,
  getImagesByCategory,
  getImagesByYear,
  getImagesByCategoryAndYear,
} from "../controllers/Gallery.controller.js";
import {
  upload,
  processBase64Files,
} from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { validateCreateGallery } from "../middlewares/validate.middlewares.js";

const galleryRouter = express.Router();

// Upload image (admin only)
galleryRouter.post(
  "/",
  processBase64Files([{ name: "image", filename: "gallery.jpg" }]),
  upload.fields([{ name: "image" }]),
  verifyJwt,
  validateCreateGallery, 
  uploadImage
);


// Public routes
galleryRouter.get("/", getAllImages);
galleryRouter.get("/year/:year", getImagesByYear);
galleryRouter.get("/:title/:year", getImagesByCategoryAndYear);
galleryRouter.get("/:title", getImagesByCategory);


// Delete image (admin only)
galleryRouter.delete("/:imageId", verifyJwt, deleteImageById);

export default galleryRouter;
