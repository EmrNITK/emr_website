import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, UploadCloud, Loader2, 
  Calendar, Trophy, Lock, Unlock, Link as LinkIcon, List 
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
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

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`, { withCredentials: true });
      setItems(res.data);
    } catch (err) { toast.error("Failed to fetch events"); }
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
        toast.success("Event Updated");
      } else {
        await axios.post(`${API_URL}/events`, payload, { headers, withCredentials: true });
        toast.success("Event Created");
      }
      setIsModalOpen(false);
      fetchItems();
    } catch (err) { toast.error("Operation failed"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API_URL}/events/${id}`, { headers, withCredentials: true });
      fetchItems();
      toast.success("Deleted");
    } catch (err) { toast.error("Delete failed"); }
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
    <div className="p-8 min-h-screen bg-black text-white font-sans">
      <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <div><h2 className="text-4xl font-bold">Events</h2><p className="text-zinc-400 mt-2">Manage competitions & hackathons</p></div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold hover:bg-zinc-200"><Plus size={20}/> New Event</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div layout key={item._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 transition-all flex flex-col group relative">
             <div className="absolute top-3 left-3 z-10"><span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${item.status === 'LIVE' ? 'bg-red-600 border-red-500 text-white animate-pulse' : 'bg-black border-zinc-700 text-zinc-400'}`}>{item.status}</span></div>
             <div className="h-48 overflow-hidden relative">
               <img src={item.image || item.posterUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" alt="" />
               <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => openModal(item)} className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white hover:text-black"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/10 backdrop-blur rounded-full text-red-500 hover:bg-red-600 hover:text-white"><Trash2 size={16}/></button>
               </div>
             </div>
             <div className="p-5 flex flex-col flex-1">
               <h3 className="font-bold text-lg text-white mb-1">{item.title}</h3>
               <p className="text-xs text-[#51b749] mb-3 font-medium">{item.tagline}</p>
               <div className="mt-auto flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar size={12}/> {new Date(item.targetDate).toLocaleDateString()}
               </div>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
              
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-950 sticky top-0 z-10">
                <h3 className="text-xl font-bold">{editingItem ? 'Edit Event' : 'New Event'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-500 hover:text-white"/></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                
                {/* --- BASIC INFO --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Title</label>
                        <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-[#51b749]"
                            value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} required />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Slug</label>
                        <div className="flex gap-2">
                           <div className="relative flex-1">
                             <span className="absolute left-3 top-3 text-zinc-600 font-mono text-sm">/e/</span>
                             <input type="text" readOnly={isSlugLocked} className={`w-full bg-zinc-900 border ${isSlugLocked?'border-zinc-800 text-zinc-500':'border-blue-900'} rounded-lg p-3 pl-9 font-mono text-sm outline-none`}
                                value={formData.slug || ''} onChange={(e) => handleInputChange('slug', e.target.value)} />
                           </div>
                           <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white">{isSlugLocked ? <Lock size={18}/> : <Unlock size={18}/>}</button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Tagline</label>
                        <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-[#51b749]"
                            value={formData.tagline || ''} onChange={(e) => handleInputChange('tagline', e.target.value)} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Status</label>
                            <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none"
                                value={formData.status || 'upcoming'} onChange={(e) => handleInputChange('status', e.target.value)}>
                                <option value="upcoming">Upcoming</option>
                                <option value="LIVE">LIVE NOW</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Event Date</label>
                            <input type="datetime-local" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-[#51b749]"
                                value={formData.targetDate ? new Date(formData.targetDate).toISOString().slice(0, 16) : ''} 
                                onChange={(e) => handleInputChange('targetDate', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* --- LINKS & MEDIA --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Registration Link</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-[#51b749]"
                                value={formData.regLink || ''} onChange={(e) => handleInputChange('regLink', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Rulebook URL</label>
                            <input type="text" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none focus:border-[#51b749]"
                                value={formData.rulebooklink || ''} onChange={(e) => handleInputChange('rulebooklink', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Cover Poster</label>
                        <ImageUploader currentMedia={formData.image || formData.posterUrl} onUpload={(url) => setFormData({...formData, image: url, posterUrl: url})} />
                    </div>
                </div>

                {/* --- LISTS (PRIZES & RULES) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><Trophy size={12}/> Prizes</label>
                            <button type="button" onClick={() => addListItem('prizes')} className="text-xs text-blue-400 hover:text-blue-300">+ Add Prize</button>
                        </div>
                        <div className="space-y-2">
                            {formData.prizes?.map((p, i) => (
                                <div key={i} className="flex gap-2">
                                    <input className="flex-1 bg-black border border-zinc-800 rounded p-2 text-sm text-white outline-none" 
                                        value={p} onChange={(e) => handleListChange('prizes', i, e.target.value)} placeholder={`Prize #${i+1}`}/>
                                    <button type="button" onClick={() => removeListItem('prizes', i)} className="text-red-500 hover:bg-zinc-800 p-2 rounded"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2"><List size={12}/> Quick Rules</label>
                            <button type="button" onClick={() => addListItem('rules')} className="text-xs text-blue-400 hover:text-blue-300">+ Add Rule</button>
                        </div>
                        <div className="space-y-2">
                            {formData.rules?.map((r, i) => (
                                <div key={i} className="flex gap-2">
                                    <input className="flex-1 bg-black border border-zinc-800 rounded p-2 text-sm text-white outline-none" 
                                        value={r} onChange={(e) => handleListChange('rules', i, e.target.value)} placeholder="Rule..."/>
                                    <button type="button" onClick={() => removeListItem('rules', i)} className="text-red-500 hover:bg-zinc-800 p-2 rounded"><Trash2 size={14}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- DESCRIPTIONS --- */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Short Description</label>
                    <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white outline-none h-20 resize-none focus:border-[#51b749]"
                        value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase">Detailed Content (Markdown)</label>
                   <div className="border border-zinc-800 rounded-xl overflow-hidden h-[400px]">
                      <MdEditor style={{ height: '100%' }} renderHTML={text => mdParser.render(text)}
                        value={formData.content || ''} onChange={({ text }) => setFormData({ ...formData, content: text })}
                        view={{ menu: true, md: true, html: false }} />
                   </div>
                </div>

                {/* --- FOOTER --- */}
                <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-lg text-zinc-400 hover:text-white font-medium">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-white text-black font-bold rounded-lg hover:bg-zinc-200 flex items-center gap-2">
                     <UploadCloud size={18}/> {editingItem ? 'Save Changes' : 'Publish Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .rc-md-editor { background-color: #09090b !important; border: none !important; color: #fff; }
        .rc-md-editor .rc-md-navigation { background-color: #18181b !important; border-bottom: 1px solid #27272a !important; }
        .rc-md-editor .editor-container .section { background-color: #09090b !important; }
      `}</style>
    </div>
  );
};

export default Events;