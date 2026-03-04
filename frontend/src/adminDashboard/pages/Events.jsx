import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, UploadCloud, Loader2, 
  Calendar, Trophy, Lock, Unlock, Link as LinkIcon, List 
} from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader'; 

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';
const mdParser = new MarkdownIt({ html: true, linkify: true, typographer: true });

const Events = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [isEditorUploading, setIsEditorUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // Reusable input class
  const inputClass = "w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20";

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`, { withCredentials: true });
      setItems(res.data);
    } catch (err) { 
      toast.error("Failed to fetch events", { style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }});
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text) => text?.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') || "";

  const handleInputChange = (field, value) => {
    let newData = { ...formData, [field]: value };
    if (field === 'title' && !editingItem && isSlugLocked) newData['slug'] = generateSlug(value);
    setFormData(newData);
  };

  // --- LIST HANDLERS (Rules/Prizes) ---
  const handleListChange = (field, index, value) => {
    const list = [...(formData[field] || [])];
    list[index] = value;
    setFormData({ ...formData, [field]: list });
  };
  const addListItem = (field) => setFormData({ ...formData, [field]: [...(formData[field]||[]), ""] });
  const removeListItem = (field, index) => {
    const list = [...(formData[field] || [])];
    list.splice(index, 1);
    setFormData({ ...formData, [field]: list });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, status: formData.status || 'upcoming' };
      if (editingItem) {
        await axios.put(`${API_URL}/events/${editingItem._id}`, payload, { headers, withCredentials: true });
        toast.success("Event Updated", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      } else {
        await axios.post(`${API_URL}/events`, payload, { headers, withCredentials: true });
        toast.success("Event Created", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) { 
      toast.error("Operation failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API_URL}/events/${id}`, { headers, withCredentials: true });
      fetchItems();
      toast.success("Deleted", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
    } catch (err) { 
      toast.error("Delete failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || { 
        status: 'upcoming', 
        rules: [], 
        prizes: [], 
        content: '', 
        description: '' 
    });
    setIsSlugLocked(!item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative z-10 w-full selection:bg-[#51b749]/30 selection:text-[#51b749]">
      <Toaster position="bottom-right" />

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-white/10 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Events</h2>
          <p className="text-white/60 mt-1">Manage competitions & hackathons</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="flex items-center gap-2 bg-[#51b749]/80 hover:bg-[#38984c] text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={20}/> New Event
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-white/40 gap-2">
            <Loader2 className="animate-spin text-[#51b749]" /> Loading events...
        </div>
      ) : items.length === 0 ? (
        <div className="w-full text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 mt-6">
            <Calendar className="mx-auto text-white/20 mb-4" size={48}/>
            <h3 className="text-xl font-bold text-white/60">No events found</h3>
            <p className="text-white/40 mt-2">Click "New Event" to create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div 
              layout 
              key={item._id} 
              className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden hover:border-[#51b749]/50 hover:shadow-[0_0_20px_-5px_rgba(81,183,73,0.3)] transition-all duration-300 flex flex-col group relative"
            >
               <div className="absolute top-3 left-3 z-10">
                 <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${item.status === 'LIVE' ? 'bg-red-900/80 border-red-500/50 text-red-400 animate-pulse backdrop-blur-md' : 'bg-black/60 border-white/10 text-white/50 backdrop-blur-md'}`}>
                   {item.status}
                 </span>
               </div>
               
               <div className="h-52 overflow-hidden relative bg-black border-b border-white/5">
                 <img src={item.image || item.posterUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={item.title} />
                 <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button onClick={() => openModal(item)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-[#51b749]/20 hover:text-[#51b749] hover:border-[#51b749]/50 transition-all"><Edit2 size={16}/></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all"><Trash2 size={16}/></button>
                 </div>
               </div>
               
               <div className="p-5 flex flex-col flex-1">
                 <h3 className="font-bold text-xl text-white mb-1 group-hover:text-[#51b749] transition-colors">{item.title}</h3>
                 <p className="text-sm text-[#51b749] mb-4 font-medium">{item.tagline}</p>
                 <div className="mt-auto pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-medium text-white/40">
                    <Calendar size={14} className="text-[#51b749]"/> {new Date(item.targetDate).toLocaleDateString()}
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] custom-scrollbar flex flex-col"
            >
              
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111111] sticky top-0 z-20">
                <h3 className="text-xl font-bold text-white tracking-tight">{editingItem ? 'Edit Event' : 'New Event'}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  <X size={20}/>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                
                {/* --- BASIC INFO --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Title</label>
                        <input type="text" className={inputClass}
                            value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} required />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex justify-between items-center">
                          <span>Slug (URL)</span>
                          <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="text-[#51b749] hover:text-[#38984c] flex items-center gap-1 transition-colors">
                            {isSlugLocked ? <><Lock size={12}/> Locked</> : <><Unlock size={12}/> Unlocked</>}
                          </button>
                        </label>
                        <div className="flex gap-2 relative">
                             <span className="absolute left-3 top-3 text-white/40 font-mono text-sm">/e/</span>
                             <input type="text" readOnly={isSlugLocked} className={`w-full bg-black border ${isSlugLocked ? 'border-white/5 text-white/40' : 'border-[#51b749]/50 text-white focus:ring-1 focus:ring-[#51b749]'} rounded-lg p-3 pl-10 font-mono text-sm outline-none transition-all`}
                                value={formData.slug || ''} onChange={(e) => handleInputChange('slug', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Tagline</label>
                        <input type="text" className={inputClass}
                            value={formData.tagline || ''} onChange={(e) => handleInputChange('tagline', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Status</label>
                            <div className="relative">
                              <select className={`${inputClass} appearance-none cursor-pointer`}
                                  value={formData.status || 'upcoming'} onChange={(e) => handleInputChange('status', e.target.value)}>
                                  <option value="upcoming" className="bg-black text-white">Upcoming</option>
                                  <option value="LIVE" className="bg-black text-white">LIVE NOW</option>
                                  <option value="completed" className="bg-black text-white">Completed</option>
                              </select>
                              <div className="absolute right-3 top-3.5 pointer-events-none text-white/40 text-xs">▼</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Event Date & Time</label>
                            <input type="datetime-local" className={`${inputClass} [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert`}
                                value={formData.targetDate ? new Date(formData.targetDate).toISOString().slice(0, 16) : ''} 
                                onChange={(e) => handleInputChange('targetDate', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* --- LINKS & MEDIA --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Registration Link</label>
                            <div className="relative">
                              <LinkIcon size={16} className="absolute left-3 top-3.5 text-white/40" />
                              <input type="text" className={`${inputClass} pl-10`} placeholder="https://"
                                  value={formData.regLink || ''} onChange={(e) => handleInputChange('regLink', e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Rulebook URL</label>
                            <div className="relative">
                              <LinkIcon size={16} className="absolute left-3 top-3.5 text-white/40" />
                              <input type="text" className={`${inputClass} pl-10`} placeholder="https://"
                                  value={formData.rulebooklink || ''} onChange={(e) => handleInputChange('rulebooklink', e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block mb-2">Cover Poster</label>
                        <ImageUploader currentMedia={formData.image || formData.posterUrl} onUpload={(url) => setFormData({...formData, image: url, posterUrl: url})} />
                    </div>
                </div>

                {/* --- LISTS (PRIZES & RULES) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5">
                    <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2"><Trophy size={14} className="text-[#51b749]"/> Prizes</label>
                            <button type="button" onClick={() => addListItem('prizes')} className="text-xs text-[#51b749] hover:text-[#38984c] font-bold">+ Add Prize</button>
                        </div>
                        <div className="space-y-3">
                            {(!formData.prizes || formData.prizes.length === 0) && (
                                <span className="text-white/30 text-sm italic block pb-2">No prizes added yet.</span>
                            )}
                            {formData.prizes?.map((p, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input className={`${inputClass} flex-1 py-2`} 
                                        value={p} onChange={(e) => handleListChange('prizes', i, e.target.value)} placeholder={`Prize #${i+1}`}/>
                                    <button type="button" onClick={() => removeListItem('prizes', i)} className="text-red-400 hover:text-red-300 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2"><List size={14} className="text-[#51b749]"/> Quick Rules</label>
                            <button type="button" onClick={() => addListItem('rules')} className="text-xs text-[#51b749] hover:text-[#38984c] font-bold">+ Add Rule</button>
                        </div>
                        <div className="space-y-3">
                            {(!formData.rules || formData.rules.length === 0) && (
                                <span className="text-white/30 text-sm italic block pb-2">No rules added yet.</span>
                            )}
                            {formData.rules?.map((r, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input className={`${inputClass} flex-1 py-2`} 
                                        value={r} onChange={(e) => handleListChange('rules', i, e.target.value)} placeholder="Rule detail..."/>
                                    <button type="button" onClick={() => removeListItem('rules', i)} className="text-red-400 hover:text-red-300 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- DESCRIPTIONS --- */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Short Description</label>
                    <textarea className={`${inputClass} h-24 resize-none`}
                        value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Detailed Content (Markdown)</label>
                   <div className="border border-white/10 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#51b749] focus-within:border-[#51b749] transition-all h-[500px]">
                      <MdEditor style={{ height: '100%' }} renderHTML={text => mdParser.render(text)}
                        value={formData.content || ''} onChange={({ text }) => setFormData({ ...formData, content: text })}
                        view={{ menu: true, md: true, html: false }} />
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
                    className="px-8 py-2.5 bg-[#51b749]/80 text-white font-medium rounded-lg hover:bg-[#38984c] shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 flex items-center gap-2"
                  >
                     <UploadCloud size={18}/> {editingItem ? 'Save Changes' : 'Publish Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DARK MODE OVERRIDES FOR MARKDOWN EDITOR & SCROLLBAR --- */}
      <style jsx global>{`
        /* Main Container */
        .rc-md-editor { 
            background-color: #111111 !important; 
            border: none !important; 
            color: #fff !important;
        }
        
        /* Toolbar */
        .rc-md-editor .rc-md-navigation { 
            background-color: rgba(255,255,255,0.03) !important; 
            border-bottom: 1px solid rgba(255,255,255,0.05) !important; 
        }
        .rc-md-editor .rc-md-navigation .button-wrap .button {
            color: rgba(255,255,255,0.4) !important; 
        }
        .rc-md-editor .rc-md-navigation .button-wrap .button:hover {
            color: #51b749 !important;
            background-color: rgba(81,183,73,0.1) !important;
            border-radius: 4px;
        }

        /* Editing Area */
        .rc-md-editor .editor-container .section { 
            background-color: #000000 !important; 
        }
        .rc-md-editor .section-container .input { 
            color: rgba(255,255,255,0.9) !important; 
            background-color: #000000 !important; 
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            line-height: 1.6;
            padding: 16px !important;
        }

        /* Preview Area */
        .rc-md-editor .custom-html-style {
            padding: 20px;
            color: rgba(255,255,255,0.8); 
        }
        .rc-md-editor .custom-html-style h1, 
        .rc-md-editor .custom-html-style h2, 
        .rc-md-editor .custom-html-style h3 {
            color: #fff;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 0.5rem;
        }
        .rc-md-editor .custom-html-style a { color: #51b749; text-decoration: underline; }
        .rc-md-editor .custom-html-style code { background-color: rgba(255,255,255,0.05); padding: 2px 4px; border-radius: 4px; color: #51b749; }
        .rc-md-editor .custom-html-style pre { background-color: #000000; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
        .rc-md-editor .custom-html-style blockquote { border-left: 4px solid #51b749; padding-left: 1rem; color: rgba(255,255,255,0.5); }

        /* Custom Scrollbar for Modal */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(81,183,73,0.5); }
      `}</style>
    </div>
  );
};

export default Events;