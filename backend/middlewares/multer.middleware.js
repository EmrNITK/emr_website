import multer from "multer";
import fs from "fs";
import path from "path";

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize Multer
const upload = multer({ storage: storage });

// Helper function to save a base64 file to disk
const saveBase64File = (base64String, filename, fieldName, shouldReturn = false) => {
  if (!base64String) return;

  const base64Data = base64String.split(",")[1]; // remove "data:image/jpeg;base64,"
  const buffer = Buffer.from(base64Data, "base64");
  const filePath = path.join("./public/temp", filename);

  fs.writeFileSync(filePath, buffer);

  const fileObj = {
    path: filePath,
    originalname: filename,
    mimetype: base64String.split(";")[0].split(":")[1], // extract "image/jpeg" etc
  };

  return shouldReturn ? fileObj : undefined;
};

// Middleware to process base64 files
const processBase64Files =
  (fileFields = []) =>
  async (req, res, next) => {
    try {
      if (!fileFields.length) return next();

      req.files = req.files || {};

      fileFields.forEach(({ name, filename }) => {
        const input = req.body[name];

        if (!input) return;

        if (Array.isArray(input)) {
          // Multiple base64 images (for gallery uploads)
          req.files[name] = input.map((base64Str, idx) => {
            const uniqueFilename = `${Date.now()}-${idx}-${filename}`;
            return saveBase64File(base64Str, uniqueFilename, name, true);
          });
        } else {
          // Single base64 image
          const fileObj = saveBase64File(input, filename, name, true);
          req.files[name] = [fileObj];
        }
      });

      next();
    } catch (error) {
      console.error("Error processing base64 files:", error);
      return res.status(500).json({ error: "Error processing files" });
    }
  };

export { upload, processBase64Files };
