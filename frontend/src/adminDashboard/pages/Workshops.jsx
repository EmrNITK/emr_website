import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, UploadCloud, Loader2, 
  Calendar, MapPin, Clock, Lock, Unlock, Layers, Link as LinkIcon 
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

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/workshops`, { withCredentials: true });
      setItems(res.data);
    } catch (err) { 
      toast.error("Failed to fetch workshops", {
        style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      }); 
    }
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
        details: formData.details || { date: '', time: '', venue: '', prereq: '' },
      };

      if (editingItem) {
        await axios.put(`${API_URL}/workshops/${editingItem._id}`, payload, { headers, withCredentials: true });
        toast.success("Workshop Updated", {
          style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }
        });
      } else {
        await axios.post(`${API_URL}/workshops`, payload, { headers, withCredentials: true });
        toast.success("Workshop Created", {
          style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }
        });
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) { 
      toast.error("Operation failed", {
        style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }
      }); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workshop?")) return;
    try {
      await axios.delete(`${API_URL}/workshops/${id}`, { headers, withCredentials: true });
      fetchItems();
      toast.success("Deleted successfully", {
        style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }
      });
    } catch (err) { 
      toast.error("Delete failed", {
        style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }
      }); 
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
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
    <div className="p-4 md:p-8 min-h-screen relative z-10 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-white/10 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Workshops</h2>
          <p className="text-white/60 mt-1">Manage technical sessions</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="flex items-center gap-2 bg-[#51b749]/80 hover:bg-[#38984c] text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95"
        >
          <Plus size={20}/> Add Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div 
            layout 
            key={item._id} 
            className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden hover:border-[#51b749]/50 hover:shadow-[0_0_20px_-5px_rgba(81,183,73,0.3)] transition-all duration-300 flex flex-col group"
          >
             <div className="h-48 overflow-hidden relative border-b border-white/5 bg-black">
               <img src={item.image || "https://via.placeholder.com/400"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={item.title} />
               <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <button 
                    onClick={() => openModal(item)} 
                    className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-[#51b749]/20 hover:text-[#51b749] hover:border-[#51b749]/50 transition-all"
                  >
                    <Edit2 size={16}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)} 
                    className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all"
                  >
                    <Trash2 size={16}/>
                  </button>
               </div>
             </div>
             <div className="p-5 flex flex-col flex-1">
               <h3 className="font-bold text-lg text-white mb-2 group-hover:text-[#51b749] transition-colors">{item.title}</h3>
               <p className="text-white/50 text-sm line-clamp-2 mb-4 leading-relaxed">{item.description}</p>
               <div className="flex gap-4 text-xs text-white/40 mb-4 mt-auto">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#51b749]"/> {item.details?.date || 'TBA'}</span>
               </div>
               <span className={`w-fit text-[10px] font-bold px-2.5 py-1 rounded-md border ${item.status === 'upcoming' ? "bg-[#13703a]/20 border-[#51b749]/30 text-[#51b749]" : "bg-white/5 border-white/10 text-white/40"}`}>
                   {item.status?.toUpperCase() || 'UPCOMING'}
               </span>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col custom-scrollbar"
            >
              
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111111] sticky top-0 z-20">
                <h3 className="text-xl font-bold text-white tracking-tight">{editingItem ? 'Edit Session' : 'New Session'}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  <X size={20}/>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                
                {/* --- SECTION 1: CORE IDENTIFIERS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Title</label>
                        <input type="text" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all"
                            value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} required />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex justify-between">
                          <span>Slug (URL)</span>
                          <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="text-[#51b749] hover:text-[#38984c] flex items-center gap-1">
                            {isSlugLocked ? <><Lock size={12}/> Locked</> : <><Unlock size={12}/> Unlocked</>}
                          </button>
                        </label>
                        <div className="relative flex items-center">
                           <span className="absolute left-3 text-white/40 font-mono text-sm">/w/</span>
                           <input type="text" readOnly={isSlugLocked} className={`w-full bg-black border ${isSlugLocked ? 'border-white/5 text-white/40' : 'border-[#51b749]/50 text-white focus:ring-1 focus:ring-[#51b749]'} rounded-lg p-3 pl-10 font-mono text-sm outline-none transition-all`}
                              value={formData.slug || ''} onChange={(e) => handleInputChange('slug', e.target.value)} />
                        </div>
                    </div>

                    <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Status</label>
                        <select className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all appearance-none"
                            value={formData.status || 'upcoming'} onChange={(e) => handleInputChange('status', e.target.value)}>
                            <option value="upcoming">Upcoming (Open Reg)</option>
                            <option value="completed">Completed (Archived)</option>
                        </select>
                    </div>

                    <div className="col-span-2 md:col-span-1 space-y-2">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Registration Link</label>
                        <div className="relative">
                            <LinkIcon size={16} className="absolute left-3 top-3.5 text-[#51b749]" />
                            <input type="text" className="w-full bg-black border border-white/10 rounded-lg p-3 pl-10 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20"
                                value={formData.regLink || ''} onChange={(e) => handleInputChange('regLink', e.target.value)} placeholder="https://..." />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 2: SHORT INFO --- */}
                <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Short Description (For Cards)</label>
                    <textarea className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none h-24 resize-none transition-all placeholder:text-white/20"
                        value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} 
                        placeholder="A brief summary that appears on the workshop list card..." />
                </div>

                {/* --- SECTION 3: LOGISTICS GRID --- */}
                <div className="p-5 border border-white/5 rounded-xl bg-white/5">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4 block">Event Logistics</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-1.5">
                           <span className="text-[10px] text-white/50 uppercase font-bold flex items-center gap-1.5"><Calendar size={12} className="text-[#51b749]"/> Date</span>
                           <input type="text" placeholder="Oct 24, 2026" className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20"
                              value={formData.details?.date || ''} onChange={(e) => handleDetailsChange('date', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                           <span className="text-[10px] text-white/50 uppercase font-bold flex items-center gap-1.5"><Clock size={12} className="text-[#51b749]"/> Time</span>
                           <input type="text" placeholder="2:00 PM" className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20"
                              value={formData.details?.time || ''} onChange={(e) => handleDetailsChange('time', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                           <span className="text-[10px] text-white/50 uppercase font-bold flex items-center gap-1.5"><MapPin size={12} className="text-[#51b749]"/> Venue</span>
                           <input type="text" placeholder="LAB-2" className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20"
                              value={formData.details?.venue || ''} onChange={(e) => handleDetailsChange('venue', e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                           <span className="text-[10px] text-white/50 uppercase font-bold flex items-center gap-1.5"><Layers size={12} className="text-[#51b749]"/> Prerequisites</span>
                           <input type="text" placeholder="Laptop, Git..." className="w-full bg-black border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20"
                              value={formData.details?.prereq || ''} onChange={(e) => handleDetailsChange('prereq', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* --- SECTION 4: MEDIA --- */}
                <div className="space-y-2">
                   <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Cover Poster</label>
                   <ImageUploader currentMedia={formData.image} onUpload={(url) => setFormData({...formData, image: url})} />
                </div>

                {/* --- SECTION 5: CONTENT EDITOR --- */}
                <div className="space-y-2">
                   <div className="flex justify-between items-center">
                     <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Detailed Content (Markdown)</label>
                     {isEditorUploading && <span className="text-xs text-[#51b749] animate-pulse flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> Uploading...</span>}
                   </div>
                   <div className="border border-white/10 rounded-xl overflow-hidden h-[500px]">
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
                <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 py-2.5 rounded-lg text-white/50 hover:bg-white/5 hover:text-white font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-2.5 bg-[#51b749]/80 text-white font-medium rounded-lg hover:bg-[#38984c] flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95"
                  >
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
        .rc-md-editor { background-color: #111111 !important; border: none !important; color: #fff; }
        .rc-md-editor .rc-md-navigation { background-color: rgba(255,255,255,0.03) !important; border-bottom: 1px solid rgba(255,255,255,0.05) !important; }
        .rc-md-editor .editor-container .section { background-color: #000000 !important; }
        .rc-md-editor .section-container .input { color: rgba(255,255,255,0.9) !important; background-color: #000000 !important; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; padding: 16px !important; }
        .rc-md-editor .button-wrap .button { color: rgba(255,255,255,0.4) !important; }
        .rc-md-editor .button-wrap .button:hover { color: #51b749 !important; background-color: rgba(81,183,73,0.1) !important; border-radius: 4px; }
        
        /* Custom Scrollbar for Modal */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(81,183,73,0.5); }
      `}</style>
    </div>
  );
};

export default Workshops;