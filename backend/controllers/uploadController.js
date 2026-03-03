import cloudinary from '../config/cloudinary.js';

export const uploadFile = async (req, res) => {
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
      // "auto" allows images, videos, and raw files (PDF, DOCX, etc.)
      resource_type: "auto", 
      // Removing 'format: "webp"' allows the file to keep its original extension
      // and removing 'transformation' ensures raw files aren't processed as images
    });

    res.json({ 
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      resource_type: result.resource_type 
    });
  } catch (err) {
    console.error("Cloudinary Upload Error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
};