import express from "express";
import {
  createEvent,
  getEventById,
  updateEventById,
  deleteEventById,
  getAllEvent,
} from "../controllers/Event.controller.js";
import {
  upload,
  processBase64Files,
} from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { validateCreateEvent } from "../middlewares/validate.middlewares.js";

const eventRouter = express.Router();

eventRouter.post(
  "/",
  processBase64Files([
    { name: "poster", filename: "poster.jpg" }, // Required
    { name: "qrCode", filename: "qrCode.jpg" }, // Optional
  ]),
  upload.fields([
    { name: "poster", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
  ]), // Multer will now process the newly created files
  validateCreateEvent,
  verifyJwt,
  createEvent
);

eventRouter.get("/", verifyJwt, getAllEvent);
eventRouter.get("/:eventId", verifyJwt, getEventById);
eventRouter.put("/:eventId", verifyJwt, updateEventById);
eventRouter.delete("/:eventId", verifyJwt, deleteEventById);

export default eventRouter;
