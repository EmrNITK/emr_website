import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, UploadCloud, Loader2, 
  Calendar, MapPin, Clock, Lock, Unlock, Layers, Image as ImageIcon, Link as LinkIcon 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader'; 

// Markdown Imports
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';
const mdParser = new MarkdownIt({ html: true, linkify: true, typographer: true });

const Workshops = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [isEditorUploading, setIsEditorUploading] = useState(false);
  
  // Helper state for Gallery
  const [galleryUploading, setGalleryUploading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/workshops`, { withCredentials: true });
      setItems(res.data);
    } catch (err) { toast.error("Failed to fetch workshops"); }
  };

  const generateSlug = (text) => text?.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') || "";

  // Handle Top-Level Fields
  const handleInputChange = (field, value) => {
    let newData = { ...formData, [field]: value };
    if (field === 'title' && !editingItem && isSlugLocked) newData['slug'] = generateSlug(value);
    setFormData(newData);
  };

  // Handle Nested Details (Date, Time, Venue, Prereq)
  const handleDetailsChange = (field, value) => {
     setFormData({ 
       ...formData, 
       details: { ...formData.details, [field]: value } 
     });
  };
  const handleEditorImageUpload = async (file) => {
    setIsEditorUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);
    try {
      const res = await axios.post(`${API_URL}/upload`, uploadData, { headers: { 'Content-Type': 'multipart/form-data', Authorization: token }, withCredentials: true });
      setIsEditorUploading(false);
      return res.data.url;
    } catch (err) {
      setIsEditorUploading(false);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData, 
        status: formData.status || 'upcoming',
        // Ensure details object exists even if empty
        details: formData.details || { date: '', time: '', venue: '', prereq: '' },
      };

      if (editingItem) {
        await axios.put(`${API_URL}/workshops/${editingItem._id}`, payload, { headers, withCredentials: true });
        toast.success("Workshop Updated");
      } else {
        await axios.post(`${API_URL}/workshops`, payload, { headers, withCredentials: true });
        toast.success("Workshop Created");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) { toast.error("Operation failed"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this workshop?")) return;
    try {
      await axios.delete(`${API_URL}/workshops/${id}`, { headers, withCredentials: true });
      fetchItems();
      toast.success("Deleted");
    } catch (err) { toast.error("Delete failed"); }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    // Initialize all fields to avoid uncontrolled/controlled input warnings
    setFormData(item || { 
      status: 'upcoming', 
      description: '', 
      content: '',
      details: { date: '', time: '', venue: '', prereq: '' } 
    });
    setIsSlugLocked(!item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 ml-64 min-h-screen bg-black text-white font-sans">
      <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <div><h2 className="text-4xl font-bold">Workshops</h2><p className="text-zinc-400 mt-2">Manage technical sessions</p></div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold hover:bg-zinc-200"><Plus size={20}/> Add Session</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div layout key={item._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all flex flex-col group">
             <div className="h-48 overflow-hidden relative">
               <img src={item.image || "https://via.placeholder.com/400"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" alt="" />
               <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => openModal(item)} className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white hover:text-black"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/10 backdrop-blur rounded-full text-red-500 hover:bg-red-600 hover:text-white"><Trash2 size={16}/></button>
               </div>
             </div>
             <div className="p-5 flex flex-col flex-1">
               <h3 className="font-bold text-lg text-white mb-1">{item.title}</h3>
               <p className="text-zinc-500 text-xs line-clamp-2 mb-4">{item.description}</p>
               <div className="flex gap-4 text-xs text-zinc-400 mb-4 mt-auto">
                  <span className="flex items-center gap-1"><Calendar size={12}/> {item.details?.date || 'TBA'}</span>
               </div>
               <span className={`w-fit text-[10px] font-bold px-2 py-1 rounded border ${item.status === 'upcoming' ? "bg-green-900/30 border-green-800 text-green-400" : "bg-zinc-800 border-zinc-700 text-zinc-400"}`}>
                   {item.status?.toUpperCase() || 'UPCOMING'}
               </span>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
              
              {/* Header */}
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 sticky top-0 z-10">
                <h3 className="text-xl font-bold">{editingItem ? 'Edit Session' : 'New Session'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-500 hover:text-white"/></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                
                {/* --- SECTION 1: CORE IDENTIFIERS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Title</label>
                        <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-[#51b749] outline-none"
                            value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} required />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Slug (URL)</label>
                        <div className="flex gap-2">
                           <div className="relative flex-1">
                             <span className="absolute left-3 top-3 text-zinc-600 font-mono text-sm">/w/</span>
                             <input type="text" readOnly={isSlugLocked} className={`w-full bg-zinc-900 border ${isSlugLocked?'border-zinc-800 text-zinc-500':'border-blue-900'} rounded-lg p-3 pl-9 font-mono text-sm outline-none`}
                                value={formData.slug || ''} onChange={(e) => handleInputChange('slug', e.target.value)} />
                           </div>
                           <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white">{isSlugLocked ? <Lock size={18}/> : <Unlock size={18}/>}</button>
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Status</label>
                        <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none"
                            value={formData.status || 'upcoming'} onChange={(e) => handleInputChange('status', e.target.value)}>
                            <option value="upcoming">Upcoming (Open Reg)</option>
                            <option value="completed">Completed (Archived)</option>
                        </select>
                    </div>

                    <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Registration Link</label>
                        <div className="relative">
                            <LinkIcon size={16} className="absolute left-3 top-3.5 text-zinc-600" />
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 pl-10 text-white outline-none focus:border-[#51b749]"
                                value={formData.regLink || ''} onChange={(e) => handleInputChange('regLink', e.target.value)} placeholder="https://..." />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: SHORT INFO --- */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Short Description (For Cards)</label>
                    <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-[#51b749] outline-none h-24 resize-none"
                        value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} 
                        placeholder="A brief summary that appears on the workshop list card..." />
                </div>

                {/* --- SECTION 3: LOGISTICS GRID --- */}
                <div className="p-5 border border-zinc-800 rounded-xl bg-zinc-900/30">
                    <label className="text-xs font-bold text-zinc-500 uppercase mb-4 block">Event Logistics</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1">
                           <span className="text-[10px] text-zinc-500 uppercase font-bold flex gap-1"><Calendar size={10}/> Date</span>
                           <input type="text" placeholder="Oct 24, 2026" className="w-full bg-black border border-zinc-800 rounded-md p-2 text-sm text-white outline-none focus:border-[#51b749]"
                              value={formData.details?.date || ''} onChange={(e) => handleDetailsChange('date', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] text-zinc-500 uppercase font-bold flex gap-1"><Clock size={10}/> Time</span>
                           <input type="text" placeholder="2:00 PM" className="w-full bg-black border border-zinc-800 rounded-md p-2 text-sm text-white outline-none focus:border-[#51b749]"
                              value={formData.details?.time || ''} onChange={(e) => handleDetailsChange('time', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] text-zinc-500 uppercase font-bold flex gap-1"><MapPin size={10}/> Venue</span>
                           <input type="text" placeholder="LAB-2" className="w-full bg-black border border-zinc-800 rounded-md p-2 text-sm text-white outline-none focus:border-[#51b749]"
                              value={formData.details?.venue || ''} onChange={(e) => handleDetailsChange('venue', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                           <span className="text-[10px] text-zinc-500 uppercase font-bold flex gap-1"><Layers size={10}/> Prerequisites</span>
                           <input type="text" placeholder="Laptop, Git installed..." className="w-full bg-black border border-zinc-800 rounded-md p-2 text-sm text-white outline-none focus:border-[#51b749]"
                              value={formData.details?.prereq || ''} onChange={(e) => handleDetailsChange('prereq', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 4: MEDIA --- */}
                <div className="">
                   {/* Cover Image */}
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Cover Poster</label>
                      <ImageUploader currentImage={formData.image} onUpload={(url) => setFormData({...formData, image: url})} />
                   </div>

                   {/* Gallery Manager */}
                  
                </div>

                {/* --- SECTION 5: CONTENT EDITOR --- */}
                <div className="space-y-2">
                   <div className="flex justify-between">
                     <label className="text-xs font-bold text-zinc-500 uppercase">Detailed Content (Markdown)</label>
                     {isEditorUploading && <span className="text-xs text-[#51b749] animate-pulse flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Uploading image...</span>}
                   </div>
                   <div className="border border-zinc-800 rounded-xl overflow-hidden h-[500px]">
                      <MdEditor 
                        style={{ height: '100%' }} renderHTML={text => mdParser.render(text)}
                        value={formData.content || ''} onChange={({ text }) => setFormData({ ...formData, content: text })}
                        onImageUpload={handleEditorImageUpload} 
                        view={{ menu: true, md: true, html: false }}
                        placeholder="Write the full event details here..."
                      />
                   </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg text-zinc-400 hover:text-white font-medium transition-colors">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 flex items-center gap-2 shadow-lg transition-colors">
                     <UploadCloud size={18}/> {editingItem ? 'Save Changes' : 'Publish Workshop'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Markdown Editor Dark Mode Overrides */}
      <style jsx global>{`
        .rc-md-editor { background-color: #09090b !important; border: none !important; color: #fff; }
        .rc-md-editor .rc-md-navigation { background-color: #18181b !important; border-bottom: 1px solid #27272a !important; }
        .rc-md-editor .editor-container .section { background-color: #09090b !important; }
        .rc-md-editor .section-container .input { color: #e4e4e7 !important; background-color: #09090b !important; font-family: monospace; }
        .rc-md-editor .button-wrap .button { color: #a1a1aa !important; }
        .rc-md-editor .button-wrap .button:hover { color: #fff !important; background-color: #27272a !important; }
      `}</style>
    </div>
  );
};

export default Workshops;