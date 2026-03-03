import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Search, Loader, Play } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ReactPlayer from 'react-player';
import MediaUploader from '../components/ImageUploader';

// --- NEW HELPER: Smart Video Detection ---
// This ensures that even if 'mediaType' is missing in your database, 
// .mov, .mp4, and Cloudinary video URLs are still properly treated as videos.
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
      toast.error("Failed to fetch data");
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
        await axios.put(`${API_URL}/${endpoint}/${editingItem._id}`, formData, {
          headers,
          withCredentials: true
        });
        toast.success("Updated successfully");
        setItems(items.map(i => i._id === editingItem._id ? { ...i, ...formData } : i));
      } else {
        const res = await axios.post(`${API_URL}/${endpoint}`, formData, {
          headers,
          withCredentials: true
        });
        toast.success("Created successfully");
        setItems([res.data, ...items]);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
    } catch (err) { toast.error("Operation failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`, {
        headers,
        withCredentials: true
      });
      toast.success("Deleted");
      setItems(items.filter(i => i._id !== id));
    } catch (err) { toast.error("Delete failed"); }
  };

  const handleCreateOption = async () => {
    if (!newOptionData.value) return;
    try {
      await axios.post(`${API_URL}/options`, newOptionData, {
        headers,
        withCredentials: true
      });
      toast.success(`Added ${newOptionData.type}`);
      fetchOptions();
      setFormData({ ...formData, [newOptionData.type]: newOptionData.value });
      setIsOptionModalOpen(false);
      setNewOptionData({ type: 'category', value: '' });
    } catch (err) { toast.error(err.response?.data?.error || "Failed"); }
  };

  return (
    <div className="p-8 min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-zinc-400 mt-1">Manage your {title.toLowerCase()} content</p>
        </div>
        <button onClick={() => { setEditingItem(null); setFormData({ mediaType: 'image' }); setIsModalOpen(true); }} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-all font-semibold shadow-lg shadow-white/10">
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center">
        {/* <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text" placeholder="Search title, description..."
            className="w-full bg-black border border-zinc-700 rounded-lg pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div> */}

        <select
          className="bg-black border border-zinc-700 rounded-lg px-4 py-2 min-w-[150px] focus:border-blue-500 outline-none cursor-pointer"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {options.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="bg-black border border-zinc-700 rounded-lg px-4 py-2 min-w-[120px] focus:border-blue-500 outline-none cursor-pointer"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">All Years</option>
          {options.years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Reset Filters */}
        {(filters.search || filters.category || filters.year) && (
          <button onClick={() => setFilters({ search: '', category: '', year: '' })} className="text-sm text-zinc-400 hover:text-white underline">
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          const isLast = items.length === index + 1;
          const isVideo = isVideoMedia(item); // Using the smart detection

          return (
            <motion.div
              ref={isLast ? lastItemRef : null}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={item._id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition-all"
            >
              <div 
                className="h-48 overflow-hidden relative bg-black flex items-center justify-center cursor-pointer"
                onClick={() => isVideo && setPlayingVideo(item)}
              >
                {isVideo ? (
                  <>
                    <video
                      src={item.src}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      muted loop autoPlay playsInline
                    />
                    <div className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur p-2.5 rounded-full text-white shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform z-10">
                      <Play size={18} fill="currentColor" className="ml-0.5" />
                    </div>
                  </>
                ) : (
                  <img
                    src={item.src}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={item.title}
                  />
                )}

                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setEditingItem(item); 
                      // Fix formData so it opens as a video in the modal if it really is one
                      setFormData({ ...item, mediaType: isVideo ? 'video' : 'image' }); 
                      setIsModalOpen(true); 
                    }} 
                    className="p-2 bg-black/70 backdrop-blur rounded-full hover:bg-blue-600 text-white"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} 
                    className="p-2 bg-black/70 backdrop-blur rounded-full hover:bg-red-600 text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded flex gap-2 text-xs text-white z-10">
                  {isVideo && <span className="text-blue-400 font-bold uppercase tracking-wider">Video</span>}
                  <span>{item.year}</span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-xl mb-1 truncate">{item.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-blue-900/30 border border-blue-800 text-blue-300">
                    {item.category}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center p-8"><Loader className="animate-spin text-zinc-500" /></div>
      )}
      {!loading && items.length === 0 && (
        <div className="text-center py-20 text-zinc-500">No items found matching your filters.</div>
      )}

      {/* --- ADD/EDIT ITEM MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-950 z-10">
                <h3 className="text-xl font-bold">{editingItem ? 'Edit' : 'Create'} Gallery Item</h3>
                <button type="button" onClick={() => setIsModalOpen(false)}><X className="text-zinc-400 hover:text-white" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Title</label>
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                    value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase flex justify-between">
                    Category
                    <button type="button" onClick={() => { setNewOptionData({ type: 'category', value: '' }); setIsOptionModalOpen(true); }} className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1">
                      <Plus size={10} /> ADD NEW
                    </button>
                  </label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                    value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} required >
                    <option value="" disabled>Select Category</option>
                    {options.categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase flex justify-between">
                    Year
                    <button type="button" onClick={() => { setNewOptionData({ type: 'year', value: '' }); setIsOptionModalOpen(true); }} className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1">
                      <Plus size={10} /> ADD NEW
                    </button>
                  </label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                    value={formData.year || ''} onChange={e => setFormData({ ...formData, year: e.target.value })} required >
                    <option value="" disabled>Select Year</option>
                    {options.years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase block mb-2">Media Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer bg-zinc-900 px-4 py-2 border border-zinc-800 rounded-lg hover:border-zinc-700">
                      <input 
                        type="radio" 
                        name="mediaType"
                        checked={formData.mediaType === 'image' || !formData.mediaType} 
                        onChange={() => setFormData({...formData, mediaType: 'image', src: ''})} 
                        className="accent-blue-500"
                      />
                      Image
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer bg-zinc-900 px-4 py-2 border border-zinc-800 rounded-lg hover:border-zinc-700">
                      <input 
                        type="radio" 
                        name="mediaType"
                        checked={formData.mediaType === 'video'} 
                        onChange={() => setFormData({...formData, mediaType: 'video', src: ''})} 
                        className="accent-blue-500"
                      />
                      Video
                    </label>
                  </div>
                </div>

                <MediaUploader 
                  currentMedia={formData.src} 
                  mediaType={formData.mediaType || 'image'} 
                  width={1500} 
                  onUpload={(url) => setFormData({ ...formData, src: url })} 
                />

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Description</label>
                  <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none min-h-[100px]"
                    value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>

                <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all">
                  Save Changes
                </button>
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
            className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
          >
            <motion.div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-sm">
              <h4 className="text-lg font-bold mb-4">Add New {newOptionData.type === 'category' ? 'Category' : 'Year'}</h4>
              <input
                autoFocus
                className="w-full bg-black border border-zinc-700 rounded-lg p-3 mb-4 focus:border-blue-500 outline-none"
                placeholder={`Enter new ${newOptionData.type}...`}
                value={newOptionData.value}
                onChange={e => setNewOptionData({ ...newOptionData, value: e.target.value })}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsOptionModalOpen(false)} className="flex-1 py-2 rounded-lg hover:bg-zinc-800">Cancel</button>
                <button type="button" onClick={handleCreateOption} className="flex-1 bg-white text-black py-2 rounded-lg font-bold hover:bg-zinc-200">Add</button>
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
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 md:p-12"
            onClick={() => setPlayingVideo(null)}
          >
            <button 
              className="absolute top-6 right-6 p-3 bg-zinc-800/80 rounded-full text-white hover:bg-zinc-700 transition-colors z-10"
              onClick={() => setPlayingVideo(null)}
            >
              <X size={24} />
            </button>
            
            <div 
              className="w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 relative"
              onClick={e => e.stopPropagation()}
            >
              <ReactPlayer
                src={playingVideo.src}
                width="100%"
                height="100%"
                controls={true}
                playing={true} 
              />
            </div>
            
            <div className="mt-6 text-center max-w-3xl">
              <h3 className="text-2xl font-bold text-white mb-2">{playingVideo.title}</h3>
              {playingVideo.description && (
                <p className="text-zinc-400">{playingVideo.description}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;