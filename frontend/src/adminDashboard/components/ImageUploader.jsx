import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, FileVideo, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

// --- Helper: Resize & Convert to WebP (IMAGES ONLY) ---
const processImage = (file, targetWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > targetWidth) {
          height = Math.round((height * targetWidth) / width);
          width = targetWidth;
        } 

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Conversion failed'));
          const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
          const newFileName = `${fileNameWithoutExt}.webp`;
          
          const newFile = new File([blob], newFileName, { 
            type: 'image/webp',
            lastModified: Date.now()
          });
          resolve(newFile);
        }, 'image/webp', quality);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const MediaUploader = ({ onUpload, currentMedia, mediaType = 'image', width = 800 }) => {
  const [status, setStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setStatus('processing');
      setProgress(0);
      
      let fileToUpload = file;

      // Only run the heavy image processing if it's actually an image
      if (mediaType === 'image' && file.type.startsWith('image/')) {
        fileToUpload = await processImage(file, width);
      }

      setStatus('uploading');
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);

      const token = localStorage.getItem('token');

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data', 
          Authorization: token 
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      onUpload(res.data.url);
      setStatus('success');
      toast.success("Uploaded successfully!");
      
      setTimeout(() => setStatus('idle'), 2000);

    } catch (err) {
      console.error(err);
      setStatus('error');
      toast.error("Upload failed");
    }
  }, [onUpload, width, API_URL, mediaType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    // Dynamically accept only the selected media type
    accept: mediaType === 'video' ? { 'video/*': [] } : { 'image/*': [] },
    disabled: status === 'processing' || status === 'uploading'
  });

  const renderContent = () => {
    if (status === 'processing') {
      return (
        <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
          {mediaType === 'video' ? <FileVideo className="w-10 h-10 text-yellow-500" /> : <FileImage className="w-10 h-10 text-yellow-500" />}
          <p className="text-sm font-medium text-yellow-500">
            {mediaType === 'video' ? 'Preparing Video...' : 'Optimizing & Converting...'}
          </p>
        </div>
      );
    }

    if (status === 'uploading') {
      return (
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between text-xs font-semibold text-blue-400">
            <span>Uploading</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <div className="flex flex-col items-center text-green-500 animate-in fade-in zoom-in duration-300">
          <CheckCircle className="w-10 h-10 mb-2" />
          <p className="font-semibold">Done!</p>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="flex flex-col items-center text-red-500">
          <AlertCircle className="w-10 h-10 mb-2" />
          <p className="text-sm">Try Again</p>
        </div>
      );
    }

    // Default Idle / Preview State
    if (currentMedia) {
      return (
        <div className="relative group w-full h-40">
           {mediaType === 'video' ? (
             <video src={currentMedia} className="w-full h-full object-cover rounded-lg bg-black" controls muted />
           ) : (
             <img src={currentMedia} alt="Current" className="w-full h-full object-cover rounded-lg" />
           )}
           <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg">
             <Upload className="text-white mb-2" />
             <span className="text-white text-xs font-bold uppercase tracking-widest">Change Media</span>
           </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-center transition-colors ${isDragActive ? 'text-blue-400' : 'text-zinc-400'}`}>
        <Upload className="w-8 h-8 mb-3" />
        <p className="text-sm font-medium">Click or Drag {mediaType === 'video' ? 'Video' : 'Image'}</p>
        <p className="text-xs text-zinc-600 mt-1">
          {mediaType === 'video' ? 'Upload raw video file' : 'Auto-converted to WebP'}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
        {mediaType === 'video' ? 'Video File' : 'Image / Poster'}
      </label>
      
      <div 
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl h-48 flex items-center justify-center overflow-hidden transition-all duration-300
          ${status === 'error' ? 'border-red-500/50 bg-red-500/5' : ''}
          ${isDragActive ? 'border-blue-500 bg-blue-500/5 scale-[0.99]' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'}
        `}
      >
        <input {...getInputProps()} />
        {renderContent()}
      </div>
    </div>
  );
};

export default MediaUploader;