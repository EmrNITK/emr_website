import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, FileVideo, CheckCircle, AlertCircle, Images } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import heic2any from 'heic2any';

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
          const fileNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
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

// --- Helper: Detect Video from URL ---
const isVideoUrl = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
};

// --- Helper: Detect HEIC File ---
const isHeic = (file) => {
  return file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic');
};

const MediaUploader = ({ onUpload, currentMedia, width = 800, multiple = false }) => {
  const [status, setStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const [activeType, setActiveType] = useState('image'); 
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles?.length) return;

    // Enforce single file if not in multiple mode
    const filesToProcess = multiple ? acceptedFiles : [acceptedFiles[0]];

    try {
      // Determine what type of files we are processing for the loading text
      const hasVideo = filesToProcess.some(f => f.type.startsWith('video/'));
      const hasImage = filesToProcess.some(f => !f.type.startsWith('video/'));
      setActiveType(hasVideo && hasImage ? 'mixed' : hasVideo ? 'video' : 'image');
      
      setStatus('processing');
      setProgress(0);
      
      // 1. Process all files (HEIC conversion + WebP compression for images)
      const processedFiles = await Promise.all(filesToProcess.map(async (file) => {
        const isVideo = file.type.startsWith('video/');
        if (isVideo) return file;

        let fileToUpload = file;

        if (isHeic(file)) {
          const convertedBlob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.8 });
          const singleBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          fileToUpload = new File([singleBlob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg', lastModified: Date.now() });
        }

        if (fileToUpload.type.startsWith('image/')) {
          fileToUpload = await processImage(fileToUpload, width);
        }
        
        return fileToUpload;
      }));

      setStatus('uploading');
      const token = localStorage.getItem('token');
      
      // Track upload progress for all files simultaneously
      const uploadProgresses = new Array(processedFiles.length).fill(0);

      // 2. Upload all files concurrently
      const uploadPromises = processedFiles.map((fileToUpload, index) => {
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        return axios.post(`${API_URL}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            uploadProgresses[index] = progressEvent.loaded / progressEvent.total;
            const totalProgress = Math.round((uploadProgresses.reduce((a, b) => a + b, 0) / processedFiles.length) * 100);
            setProgress(totalProgress);
          }
        }).then(res => res.data.url);
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // 3. Pass data back to parent
      if (multiple) {
        onUpload(uploadedUrls); // Returns an array of URLs
      } else {
        onUpload(uploadedUrls[0]); // Returns a single string URL
      }

      setStatus('success');
      toast.success(multiple && uploadedUrls.length > 1 ? `Uploaded ${uploadedUrls.length} files successfully!` : "Uploaded successfully!");
      
      setTimeout(() => setStatus('idle'), 1200);

    } catch (err) {
      console.error(err);
      setStatus('error');
      toast.error(err.message?.includes('HEIC') ? "Failed to process Apple image" : "Upload failed");
    }
  }, [onUpload, width, API_URL, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    multiple,
    accept: { 
      'image/*': ['.jpeg', '.png', '.webp', '.jpg', '.heic', '.HEIC'], 
      'video/*': [] 
    },
    disabled: status === 'processing' || status === 'uploading'
  });

  const renderContent = () => {
    if (status === 'processing') {
      return (
        <div className="flex flex-col items-center justify-center space-y-3 animate-pulse">
          {activeType === 'video' ? <FileVideo className="w-10 h-10 text-yellow-500" /> : 
           activeType === 'mixed' ? <Images className="w-10 h-10 text-yellow-500" /> :
           <FileImage className="w-10 h-10 text-yellow-500" />}
          <p className="text-sm font-medium text-yellow-500">
            {activeType === 'video' ? 'Preparing Video...' : 
             activeType === 'mixed' ? 'Preparing Media...' : 
             'Optimizing & Converting...'}
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

    // Existing Media Previews
    if (currentMedia && currentMedia.length > 0) {
      const mediaArray = Array.isArray(currentMedia) ? currentMedia : [currentMedia];

      // Multiple Preview Grid
      if (multiple && mediaArray.length > 0) {
        return (
          <div className="relative group w-full h-full p-3 overflow-y-auto custom-scrollbar">
             <div className="grid grid-cols-3 gap-2">
               {mediaArray.map((url, idx) => (
                 <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-black/40">
                   {isVideoUrl(url) ? (
                     <video src={url} className="w-full h-full object-cover" />
                   ) : (
                     <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                   )}
                 </div>
               ))}
             </div>
             <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
               <Upload className="text-white mb-2" />
               <span className="text-white text-xs font-bold uppercase tracking-widest">Add More Media</span>
             </div>
          </div>
        );
      }

      // Single Preview
      if (!multiple && mediaArray[0]) {
        return (
          <div className="relative group w-full h-full">
             {isVideoUrl(mediaArray[0]) ? (
               <video src={mediaArray[0]} className="w-full h-full object-cover rounded-xl bg-black" controls muted />
             ) : (
               <img src={mediaArray[0]} alt="Current Media" className="w-full h-full object-cover rounded-xl" />
             )}
             <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl">
               <Upload className="text-white mb-2" />
               <span className="text-white text-xs font-bold uppercase tracking-widest">Change Media</span>
             </div>
          </div>
        );
      }
    }

    // Default Idle State
    return (
      <div className={`flex flex-col items-center transition-colors ${isDragActive ? 'text-blue-400' : 'text-zinc-400'}`}>
        <div className="flex space-x-2 mb-3">
            <FileImage className="w-6 h-6" />
            {multiple && <Images className="w-6 h-6" />}
            <FileVideo className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">Click or Drag {multiple ? 'Files' : 'Image / Video'}</p>
        <p className="text-xs text-zinc-600 mt-1">
          Supports JPG, PNG, HEIC, and Video
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
        {multiple ? 'Media Upload (Multiple)' : 'Media Upload'}
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