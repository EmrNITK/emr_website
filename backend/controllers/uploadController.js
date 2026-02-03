import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Convert buffer to Base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    // Construct Data URI
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const result = await cloudinary.uploader.upload(dataURI, { 
      folder: "emr_dashboard",
      resource_type: "image",
      format: "webp", // <--- FORCE WEBP EXTENSION ON CLOUDINARY
      transformation: [
        { quality: "auto" } // Optional: Cloudinary smart compression
      ]
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};