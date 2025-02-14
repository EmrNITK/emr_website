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

// Middleware to process base64 files dynamically
const processBase64Files =
  (fileFields = []) =>
  async (req, res, next) => {
    try {
      if (!fileFields.length) return next(); // Skip if no fields are defined

      req.files = req.files || {}; // Ensure req.files is defined

      // Helper function to save base64-encoded files
      const saveBase64File = (base64String, filename, fieldName) => {
        if (!base64String) return;

        const base64Data = base64String.split(",")[1]; // Remove metadata
        const buffer = Buffer.from(base64Data, "base64");
        const filePath = path.join("./public/temp", filename);

        fs.writeFileSync(filePath, buffer);

        req.files[fieldName] = [
          {
            path: filePath,
            originalname: filename,
            mimetype: base64String.split(";")[0].split(":")[1], // Extract MIME type
          },
        ];
      };

      // Process only fields that exist in req.body
      fileFields.forEach(({ name, filename }) => {
        if (req.body[name]) saveBase64File(req.body[name], filename, name);
      });

      next();
    } catch (error) {
      console.error("Error processing base64 files:", error);
      return res.status(500).json({ error: "Error processing files" });
    }
  };

export { upload, processBase64Files };
