import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
// import { API_URL } from '../config';

const ImageUploader = ({ onUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false);
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: token }, withCredentials: true
      });
      onUpload(res.data.url);
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Image / Poster</label>
      <div {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900'
          }`}>
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-blue-400 animate-pulse">Uploading...</p>
        ) : currentImage ? (
          <div className="relative h-40 w-full">
            <img src={currentImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-white font-medium">Click to Change</div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-zinc-400">
            <Upload className="mb-2" />
            <p className="text-sm">Drag & Drop or Click to Upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;