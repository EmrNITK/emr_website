import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Loader2, Play, ChevronDown, Image as ImageIcon, Film } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ReactPlayer from 'react-player';
import MediaUploader from '../components/ImageUploader';

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

const isVideoUrl = (url) => {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
};

const Gallery = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
  const title = "Gallery";
  const endpoint = "gallery";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', year: '' });

  const [options, setOptions] = useState({ categories: [], years: [] });
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [newOptionData, setNewOptionData] = useState({ type: 'category', value: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [globalData, setGlobalData] = useState({ category: '', year: '' });
  const [batchItems, setBatchItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [playingVideo, setPlayingVideo] = useState(null);

  const observer = useRef();

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  const inputClass = "w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20";

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
    } catch (err) {}
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

  const handleUploadUrls = (urls) => {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    
    const newBatchItems = urlArray.map(url => ({
      src: url,
      title: '',
      description: '',
      mediaType: isVideoUrl(url) ? 'video' : 'image'
    }));

    setBatchItems(prev => [...prev, ...newBatchItems]);
  };

  const updateBatchItem = (index, field, value) => {
    const updated = [...batchItems];
    updated[index][field] = value;
    setBatchItems(updated);
  };

  const removeBatchItem = (index) => {
    setBatchItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (batchItems.length === 0) {
      return toast.error("Please upload at least one media item");
    }

    if (!globalData.category || !globalData.year) {
      return toast.error("Please select a global category and year");
    }

    setIsSubmitting(true);

    try {
      if (editingItem) {
        const itemData = { ...batchItems[0], category: globalData.category, year: globalData.year };
        await axios.put(`${API_URL}/${endpoint}/${editingItem._id}`, itemData, { headers, withCredentials: true });
        setItems(items.map(i => i._id === editingItem._id ? { ...i, ...itemData } : i));
        toast.success("Updated successfully", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      } else {
        const promises = batchItems.map(item => {
          const payload = {
            ...item,
            category: globalData.category,
            year: globalData.year,
            title: item.title || 'Untitled'
          };
          return axios.post(`${API_URL}/${endpoint}`, payload, { headers, withCredentials: true });
        });

        const results = await Promise.all(promises);
        const newCreatedItems = results.map(res => res.data);
        setItems([...newCreatedItems, ...items]);
        toast.success(`Created ${newCreatedItems.length} items successfully`, { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      }

      setIsModalOpen(false);
      resetModalState();
    } catch (err) { 
      toast.error("Operation failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModalState = () => {
    setEditingItem(null);
    setBatchItems([]);
    setGlobalData({ category: '', year: '' });
  };

  const openCreateModal = () => {
    resetModalState();
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setGlobalData({ category: item.category || '', year: item.year || '' });
    setBatchItems([{
      src: item.src,
      title: item.title || '',
      description: item.description || '',
      mediaType: item.mediaType || (isVideoMedia(item) ? 'video' : 'image')
    }]);
    setIsModalOpen(true);
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
      setGlobalData({ ...globalData, [newOptionData.type]: newOptionData.value });
      setIsOptionModalOpen(false);
      setNewOptionData({ type: 'category', value: '' });
    } catch (err) { 
      toast.error(err.response?.data?.error || "Failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    }
  };

  const handleDeleteOption = async (type, value) => {
    if (!window.confirm(`Are you sure you want to delete the ${type} "${value}"?`)) return;
    try {
      await axios.delete(`${API_URL}/options/${type}/${value}`, { headers, withCredentials: true });
      toast.success(`Deleted ${type}`, { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      fetchOptions();
      if (globalData[type] === value) setGlobalData({ ...globalData, [type]: '' });
      if (filters[type] === value) setFilters({ ...filters, [type]: '' });
    } catch (err) {
      toast.error("Failed to delete option", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }});
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative z-10 w-full selection:bg-[#51b749]/30 selection:text-[#51b749]">
      <Toaster position="bottom-right" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
          <p className="text-white/60 mt-1">Manage your {title.toLowerCase()} content</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="flex items-center gap-2 bg-[#51b749]/80 hover:bg-[#38984c] text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95"
        >
          <Plus size={20} /> Add New
        </button>
      </div>

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

        {(filters.search || filters.category || filters.year) && (
          <button 
            onClick={() => setFilters({ search: '', category: '', year: '' })} 
            className="text-sm text-white/40 hover:text-white underline px-2 transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

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
                      openEditModal(item);
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

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] custom-scrollbar flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111111] z-30">
                <h3 className="text-xl font-bold text-white tracking-tight">{editingItem ? 'Edit' : 'Batch Upload'} Gallery</h3>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-bold text-white mb-1">Global Settings</h4>
                    <p className="text-xs text-white/50 mb-4">These settings will be applied to all uploaded media in this batch.</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex justify-between items-center mb-1.5">
                      Apply Category
                      <div className="flex items-center gap-3">
                        {globalData.category && (
                          <button type="button" onClick={() => handleDeleteOption('category', globalData.category)} className="text-red-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                        <button type="button" onClick={() => { setNewOptionData({ type: 'category', value: '' }); setIsOptionModalOpen(true); }} className="text-[#51b749] hover:text-[#38984c] text-[10px] flex items-center gap-1 font-bold transition-colors">
                          <Plus size={12} /> ADD NEW
                        </button>
                      </div>
                    </label>
                    <div className="relative">
                      <select 
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={globalData.category} onChange={e => setGlobalData({ ...globalData, category: e.target.value })} required 
                      >
                        <option value="" disabled className="bg-black text-white/50">Select Category for All</option>
                        {options.categories.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 text-white/40 pointer-events-none" size={16} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex justify-between items-center mb-1.5">
                      Apply Year
                      <div className="flex items-center gap-3">
                        {globalData.year && (
                          <button type="button" onClick={() => handleDeleteOption('year', globalData.year)} className="text-red-400 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        )}
                        <button type="button" onClick={() => { setNewOptionData({ type: 'year', value: '' }); setIsOptionModalOpen(true); }} className="text-[#51b749] hover:text-[#38984c] text-[10px] flex items-center gap-1 font-bold transition-colors">
                          <Plus size={12} /> ADD NEW
                        </button>
                      </div>
                    </label>
                    <div className="relative">
                      <select 
                        className={`${inputClass} appearance-none cursor-pointer`}
                        value={globalData.year} onChange={e => setGlobalData({ ...globalData, year: e.target.value })} required 
                      >
                        <option value="" disabled className="bg-black text-white/50">Select Year for All</option>
                        {options.years.map(y => <option key={y} value={y} className="bg-black text-white">{y}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-3.5 text-white/40 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>

                {!editingItem && (
                  <div>
                    <MediaUploader 
                      multiple={true}
                      width={1500} 
                      onUpload={handleUploadUrls} 
                    />
                  </div>
                )}

                {batchItems.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2">
                      Media Details ({batchItems.length})
                    </h4>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {batchItems.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-4 bg-black/50 p-4 rounded-xl border border-white/10 relative group">
                          
                          <div className="w-full sm:w-32 h-32 rounded-lg overflow-hidden bg-black shrink-0 relative border border-white/5">
                            {item.mediaType === 'video' ? (
                              <video src={item.src} className="w-full h-full object-cover" />
                            ) : (
                              <img src={item.src} alt="Preview" className="w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              {!editingItem && (
                                <button type="button" onClick={() => removeBatchItem(index)} className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500">
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div>
                              <input 
                                placeholder="Title (e.g. Campus Event)"
                                className={`${inputClass} py-2 text-sm`}
                                value={item.title} 
                                onChange={e => updateBatchItem(index, 'title', e.target.value)} 
                              />
                            </div>
                            <div>
                              <textarea 
                                placeholder="Description (Optional)"
                                className={`${inputClass} py-2 text-sm min-h-[60px] resize-none`}
                                value={item.description} 
                                onChange={e => updateBatchItem(index, 'description', e.target.value)} 
                              />
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 sticky bottom-0 bg-[#111111] pb-2 z-20">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#51b749]/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-lg hover:bg-[#38984c] shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : `Upload ${batchItems.length} Items`}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(81,183,73,0.5); }
      `}</style>
    </div>
  );
};

export default Gallery;