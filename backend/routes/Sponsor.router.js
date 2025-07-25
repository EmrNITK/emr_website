import express from "express";
import {
  addSponsor,
  getSponsorById,
  updateSponsorById,
  deleteSponsorById,
  getAllSponsor,
} from "../controllers/Sponsor.controller.js";
import {
  upload,
  processBase64Files,
} from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middlewares.js";
import { validateAddSponsor } from "../middlewares/validate.middlewares.js";

const sponsorRouter = express.Router();

sponsorRouter.post(
  "/",
  processBase64Files([
    { name: "sponsorlogo", filename: "sponsorlogo.jpg" }, // Required
    { name: "qrCode", filename: "qrCode.jpg" }, // Optional
  ]),
  upload.fields([
    { name: "sponsorlogo", maxCount: 1 },
    { name: "qrCode", maxCount: 1 },
  ]), // Multer will now process the newly created files
  validateAddSponsor,
  verifyJwt,
  addSponsor
);

sponsorRouter.get("/", verifyJwt, getAllSponsor);
sponsorRouter.get("/:sponsorId", verifyJwt, getSponsorById);
sponsorRouter.put("/:sponsorId", verifyJwt , updateSponsorById);
sponsorRouter.delete("/:sponsorId", verifyJwt , deleteSponsorById);

export default sponsorRouter;
