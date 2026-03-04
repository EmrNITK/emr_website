import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Search, Loader2, Play, ChevronDown, Image as ImageIcon, Film } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ReactPlayer from 'react-player';
import MediaUploader from '../components/ImageUploader';

// --- HELPER: Smart Video Detection ---
const isVideoMedia = (item) => {
  if (item?.mediaType === 'video') return true;
  if (item?.src && typeof item.src === 'string') {
    const lowerSrc = item.src.toLowerCase();
    return (
      lowerSrc.endsWith('.mp4') || 
      lowerSrc.endsWith('.mov') || 
      lowerSrc.endsWith('.webm') || 
      lowerSrc.includes('/video/upload/')
    );
  }
  return false;
};

const Gallery = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
  const title = "Gallery";
  const endpoint = "gallery";

  // --- STATE ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', year: '' });

  // Options (Dynamic Categories/Years)
  const [options, setOptions] = useState({ categories: [], years: [] });
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [newOptionData, setNewOptionData] = useState({ type: 'category', value: '' });

  // Main Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Video Player State
  const [playingVideo, setPlayingVideo] = useState(null);

  // Infinite Scroll Observer
  const observer = useRef();

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // Reusable Input Class
  const inputClass = "w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20";

  // --- INITIAL DATA FETCHING ---
  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchItems(1, true);
  }, [filters.search, filters.category, filters.year]);

  useEffect(() => {
    if (page > 1) fetchItems(page, false);
  }, [page]);

  const fetchOptions = async () => {
    try {
      const res = await axios.get(`${API_URL}/options`);
      setOptions({
        categories: res.data.categories.map(c => c.value),
        years: res.data.years.map(y => y.value)
      });
    } catch (err) { console.error("Failed to load options"); }
  };

  const fetchItems = async (pageNum, isReset) => {
    setLoading(true);
    try {
      const params = {
        page: pageNum,
        limit: 50,
        search: filters.search,
        category: filters.category,
        year: filters.year
      };

      const res = await axios.get(`${API_URL}/${endpoint}`, { params, withCredentials: true });

      setItems(prev => isReset ? res.data.data : [...prev, ...res.data.data]);
      setHasMore(res.data.data.length === 50);
    } catch (err) {
      toast.error("Failed to fetch data", { style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }});
    } finally {
      setLoading(false);
    }
  };

  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // --- CRUD HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API_URL}/${endpoint}/${editingItem._id}`, formData, { headers, withCredentials: true });
        toast.success("Updated successfully", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
        setItems(items.map(i => i._id === editingItem._id ? { ...i, ...formData } : i));
      } else {
        const res = await axios.post(`${API_URL}/${endpoint}`, formData, { headers, withCredentials: true });
        toast.success("Created successfully", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
        setItems([res.data, ...items]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
    } catch (err) { 
      toast.error("Operation failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this media?")) return;
    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers, withCredentials: true });
      toast.success("Deleted successfully", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      setItems(items.filter(i => i._id !== id));
    } catch (err) { 
      toast.error("Delete failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    }
  };

  const handleCreateOption = async () => {
    if (!newOptionData.value) return;
    try {
      await axios.post(`${API_URL}/options`, newOptionData, { headers, withCredentials: true });
      toast.success(`Added ${newOptionData.type}`, { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      fetchOptions();
      setFormData({ ...formData, [newOptionData.type]: newOptionData.value });
      setIsOptionModalOpen(false);
      setNewOptionData({ type: 'category', value: '' });
    } catch (err) { 
      toast.error(err.response?.data?.error || "Failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative z-10 w-full selection:bg-[#51b749]/30 selection:text-[#51b749]">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
          <p className="text-white/60 mt-1">Manage your {title.toLowerCase()} content</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setFormData({ mediaType: 'image' }); setIsModalOpen(true); }} 
          className="flex items-center gap-2 bg-[#51b749]/80 hover:bg-[#38984c] text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#111111] border border-white/5 p-4 rounded-xl mb-8 flex flex-wrap gap-4 items-center">
        
        <div className="relative flex-1 min-w-[150px]">
          <select
            className={`${inputClass} appearance-none cursor-pointer py-2.5`}
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="" className="bg-black text-white/50">All Categories</option>
            {options.categories.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-3 text-white/40 pointer-events-none" size={16} />
        </div>

        <div className="relative flex-1 min-w-[150px]">
          <select
            className={`${inputClass} appearance-none cursor-pointer py-2.5`}
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          >
            <option value="" className="bg-black text-white/50">All Years</option>
            {options.years.map(y => <option key={y} value={y} className="bg-black text-white">{y}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-3 text-white/40 pointer-events-none" size={16} />
        </div>

        {/* Reset Filters */}
        {(filters.search || filters.category || filters.year) && (
          <button 
            onClick={() => setFilters({ search: '', category: '', year: '' })} 
            className="text-sm text-white/40 hover:text-white underline px-2 transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, index) => {
          const isLast = items.length === index + 1;
          const isVideo = isVideoMedia(item);

          return (
            <motion.div
              ref={isLast ? lastItemRef : null}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={item._id}
              className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden group hover:border-[#51b749]/50 hover:shadow-[0_0_20px_-5px_rgba(81,183,73,0.3)] transition-all duration-300 flex flex-col"
            >
              <div 
                className="h-48 overflow-hidden relative bg-black flex items-center justify-center cursor-pointer border-b border-white/5"
                onClick={() => isVideo && setPlayingVideo(item)}
              >
                {isVideo ? (
                  <>
                    <video
                      src={item.src}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      muted loop autoPlay playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-[#51b749]/90 backdrop-blur-md p-3 rounded-full text-white shadow-[0_0_20px_rgba(81,183,73,0.5)] transform group-hover:scale-110 transition-transform duration-300 z-10">
                        <Play size={20} fill="currentColor" className="ml-1" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.src}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    alt={item.title}
                  />
                )}

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setEditingItem(item); 
                      setFormData({ ...item, mediaType: isVideo ? 'video' : 'image' }); 
                      setIsModalOpen(true); 
                    }} 
                    className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-[#51b749]/20 hover:text-[#51b749] hover:border-[#51b749]/50 transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} 
                    className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-md flex gap-2 text-[10px] font-bold text-white z-10">
                  {isVideo ? <span className="text-[#51b749] tracking-wider flex items-center gap-1"><Film size={10}/> VIDEO</span> : <span className="text-white/60 tracking-wider flex items-center gap-1"><ImageIcon size={10}/> IMAGE</span>}
                  <span className="text-white/40">|</span>
                  <span className="tracking-wider text-white/80">{item.year}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-white mb-2 truncate group-hover:text-[#51b749] transition-colors">{item.title}</h3>
                <div className="flex flex-wrap gap-2 mt-auto">
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#13703a]/20 border border-[#51b749]/30 text-[#51b749] font-bold tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#51b749] w-8 h-8" /></div>
      )}
      {!loading && items.length === 0 && (
        <div className="w-full text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 mt-6">
            <ImageIcon className="mx-auto text-white/20 mb-4" size={48}/>
            <h3 className="text-xl font-bold text-white/60">No media found</h3>
            <p className="text-white/40 mt-2">Adjust your filters or add new items.</p>
        </div>
      )}

      {/* --- ADD/EDIT ITEM MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] custom-scrollbar flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111111] z-20">
                <h3 className="text-xl font-bold text-white tracking-tight">{editingItem ? 'Edit' : 'Create'} Gallery Item</h3>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Title</label>
                  <input 
                    className={inputClass}
                    value={formData.title || ''} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex justify-between items-center mb-1.5">
                      Category
                      <button type="button" onClick={() => { setNewOptionData({ type: 'category', value: '' }); setIsOptionModalOpen(true); }} className="text-[#51b749] hover:text-[#38984c] text-[10px] flex items-center gap-1 font-bold transition-colors">
                        <Plus size={12} /> ADD NEW
                      </button>
                    </label>
                    <div className="relative">
                      <select 
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} required 
                      >
                        <option value="" disabled className="bg-black text-white/50">Select Category</option>
                        {options.categories.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 text-white/40 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex justify-between items-center mb-1.5">
                      Year
                      <button type="button" onClick={() => { setNewOptionData({ type: 'year', value: '' }); setIsOptionModalOpen(true); }} className="text-[#51b749] hover:text-[#38984c] text-[10px] flex items-center gap-1 font-bold transition-colors">
                        <Plus size={12} /> ADD NEW
                      </button>
                    </label>
                    <div className="relative">
                      <select 
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} required 
                      >
                        <option value="" disabled className="bg-black text-white/50">Select Year</option>
                        {options.years.map(y => <option key={y} value={y} className="bg-black text-white">{y}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 text-white/40 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block mb-2">Media Type</label>
                  <div className="flex gap-4">
                    <label className="flex flex-1 items-center justify-center gap-2 cursor-pointer bg-black px-4 py-3 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-all has-[:checked]:border-[#51b749] has-[:checked]:bg-[#51b749]/10">
                      <input 
                        type="radio" 
                        name="mediaType"
                        checked={formData.mediaType === 'image' || !formData.mediaType} 
                        onChange={() => setFormData({...formData, mediaType: 'image', src: ''})} 
                        className="accent-[#51b749] w-4 h-4"
                      />
                      <span className="font-medium text-white/80"><ImageIcon size={16} className="inline mr-1 mb-0.5 text-[#51b749]"/> Image</span>
                    </label>
                    <label className="flex flex-1 items-center justify-center gap-2 cursor-pointer bg-black px-4 py-3 border border-white/10 rounded-lg hover:border-white/20 hover:bg-white/5 transition-all has-[:checked]:border-[#51b749] has-[:checked]:bg-[#51b749]/10">
                      <input 
                        type="radio" 
                        name="mediaType"
                        checked={formData.mediaType === 'video'} 
                        onChange={() => setFormData({...formData, mediaType: 'video', src: ''})} 
                        className="accent-[#51b749] w-4 h-4"
                      />
                      <span className="font-medium text-white/80"><Film size={16} className="inline mr-1 mb-0.5 text-[#51b749]"/> Video</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <MediaUploader 
                    currentMedia={formData.src} 
                    mediaType={formData.mediaType || 'image'} 
                    width={1500} 
                    onUpload={(url) => setFormData({ ...formData, src: url })} 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Description</label>
                  <textarea 
                    className={`${inputClass} min-h-[100px] resize-none`}
                    value={formData.description || ''} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                  />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button type="submit" className="w-full bg-[#51b749]/80 text-white font-medium py-3 rounded-lg hover:bg-[#38984c] shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95">
                    {editingItem ? 'Save Changes' : 'Upload Media'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SMALL MODAL FOR ADDING CATEGORY/YEAR --- */}
      <AnimatePresence>
        {isOptionModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            >
              <h4 className="text-lg font-bold text-white mb-4">Add New {newOptionData.type === 'category' ? 'Category' : 'Year'}</h4>
              <input
                autoFocus
                className={inputClass}
                placeholder={`Enter new ${newOptionData.type}...`}
                value={newOptionData.value}
                onChange={e => setNewOptionData({ ...newOptionData, value: e.target.value })}
              />
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsOptionModalOpen(false)} className="flex-1 py-2.5 rounded-lg text-white/50 hover:bg-white/5 hover:text-white transition-colors font-medium">Cancel</button>
                <button type="button" onClick={handleCreateOption} className="flex-1 bg-[#51b749]/80 text-white py-2.5 rounded-lg font-medium hover:bg-[#38984c] transition-colors shadow-[0_0_15px_-3px_rgba(81,183,73,0.5)]">Add Option</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- VIDEO PLAYER MODAL --- */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[120] flex flex-col items-center justify-center p-4 md:p-12"
            onClick={() => setPlayingVideo(null)}
          >
            <button 
              className="absolute top-6 right-6 p-3 bg-white/5 border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors z-10"
              onClick={() => setPlayingVideo(null)}
            >
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 relative flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <ReactPlayer
                src={playingVideo.src}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                style={{ backgroundColor: '#000' }}
              />
            </motion.div>
            
            <div className="mt-8 text-center max-w-3xl">
              <h3 className="text-2xl font-bold text-white mb-2">{playingVideo.title}</h3>
              {playingVideo.description && (
                <p className="text-white/60 leading-relaxed">{playingVideo.description}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Custom Scrollbar for Modal & Page */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(81,183,73,0.5); }
      `}</style>
    </div>
  );
};

export default Gallery;