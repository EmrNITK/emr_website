import { v2 as cloudinary } from 'cloudinary';
import fs  from "fs"   // fs => file system (by default in node)

const uploadOnCloudinary = async(localFilePath) => {
   try {
      if(!localFilePath) return null;
      //upload the file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type: "auto",
      })
      
      fs.unlinkSync(localFilePath)
      return response;
   } catch (error) {
      fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload operation got failed
      return null
   }
}

// Helper function to extract public_id from Cloudinary URL
const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    // Extract public_id from URL like: https://res.cloudinary.com/filer12/image/upload/v1234567890/public_id.jpg
    const parts = url.split('/');
    // Extract the filename from the URL path (last part after '/')
    const filename = parts[parts.length - 1];
    return filename.split('.')[0]; // Remove file extension
};

const deleteFromCloudinary = async(imageUrl) => {
    try {
        if (!imageUrl) return null;
        
        const publicId = getPublicIdFromUrl(imageUrl);
        if (!publicId) return null;
        
        const response = await cloudinary.uploader.destroy(publicId);
        console.log(`Image deleted from Cloudinary: ${publicId}`);
        return response;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        return null;
    }
}

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

export {uploadOnCloudinary, deleteFromCloudinary}