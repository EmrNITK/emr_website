import mongoose from 'mongoose';
import User from './User.model.js';

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ['Farewell', 'Workshop', 'Techspradha', 'Freshers', 'Memories', 'Others'] // Expandable
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  year: {
    type: String, // Example: "2k26"
    required: true,
  },
},
{
  timestamps: true,
});

const Gallery = mongoose.model("Gallery", GallerySchema);
export default Gallery;

