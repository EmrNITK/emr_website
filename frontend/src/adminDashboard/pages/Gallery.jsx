import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Search, Filter, Loader } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

const Gallery = () => {
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';
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

  // Main Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Infinite Scroll Observer
  const observer = useRef();
  
  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // --- INITIAL DATA FETCHING ---
  useEffect(() => {
    fetchOptions();
  }, []);

  // Effect: When filters change, reset list and fetch page 1
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    fetchItems(1, true); // true = reset
  }, [filters.search, filters.category, filters.year]);

  // Effect: When page changes (and not 1), fetch more
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
      setHasMore(res.data.data.length === 50); // If < 50 items returned, we reached end
    } catch (err) { 
      toast.error("Failed to fetch data"); 
    } finally {
      setLoading(false);
    }
  };

  // --- INFINITE SCROLL HANDLER ---
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
        await axios.put(`${API_URL}/${endpoint}/${editingItem._id}`, formData, { headers ,
          withCredentials: true });
        toast.success("Updated successfully");
        // Update local state directly to avoid re-fetch flickers
        setItems(items.map(i => i._id === editingItem._id ? { ...i, ...formData } : i));
      } else {
        const res = await axios.post(`${API_URL}/${endpoint}`, formData, { headers ,
          withCredentials: true });
        toast.success("Created successfully");
        setItems([res.data, ...items]); // Prepend new item
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
    } catch (err) { toast.error("Operation failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers ,
          withCredentials: true });
      toast.success("Deleted");
      setItems(items.filter(i => i._id !== id));
    } catch (err) { toast.error("Delete failed"); }
  };

  // --- NEW OPTION CREATION HANDLER ---
  const handleCreateOption = async () => {
    if(!newOptionData.value) return;
    try {
      await axios.post(`${API_URL}/options`, newOptionData, { headers,
          withCredentials: true  });
      toast.success(`Added ${newOptionData.type}`);
      fetchOptions(); // Refresh lists
      setFormData({...formData, [newOptionData.type]: newOptionData.value}); // Auto-select the new value
      setIsOptionModalOpen(false);
      setNewOptionData({ type: 'category', value: '' });
    } catch(err) { toast.error(err.response?.data?.error || "Failed"); }
  };

  return (
    <div className="p-8 ml-64 min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-zinc-400 mt-1">Manage your {title.toLowerCase()} content</p>
        </div>
        <button onClick={() => { setEditingItem(null); setFormData({}); setIsModalOpen(true); }} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-all font-semibold shadow-lg shadow-white/10">
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" placeholder="Search title, description..." 
            className="w-full bg-black border border-zinc-700 rounded-lg pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        
        <select 
          className="bg-black border border-zinc-700 rounded-lg px-4 py-2 min-w-[150px] focus:border-blue-500 outline-none cursor-pointer"
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          {options.categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select 
          className="bg-black border border-zinc-700 rounded-lg px-4 py-2 min-w-[120px] focus:border-blue-500 outline-none cursor-pointer"
          value={filters.year}
          onChange={(e) => setFilters({...filters, year: e.target.value})}
        >
          <option value="">All Years</option>
          {options.years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        
        {/* Reset Filters */}
        {(filters.search || filters.category || filters.year) && (
          <button onClick={() => setFilters({search:'', category:'', year:''})} className="text-sm text-zinc-400 hover:text-white underline">
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => {
          // Check if this is the last item to attach the ref
          const isLast = items.length === index + 1;
          return (
            <motion.div 
              ref={isLast ? lastItemRef : null}
              layout 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={item._id} 
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition-all"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={item.src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }} className="p-2 bg-black/70 backdrop-blur rounded-full hover:bg-blue-600 text-white"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 bg-black/70 backdrop-blur rounded-full hover:bg-red-600 text-white"><Trash2 size={16} /></button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs text-white">
                    {item.year}
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

      {/* Loading & Empty States */}
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
                <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-400 hover:text-white" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Title</label>
                  <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                    value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>

                {/* Category Select with Add Button */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase flex justify-between">
                    Category 
                    <button type="button" onClick={() => { setNewOptionData({type:'category', value:''}); setIsOptionModalOpen(true); }} className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1">
                      <Plus size={10} /> ADD NEW
                    </button>
                  </label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                    value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} required >
                    <option value="" disabled>Select Category</option>
                    {options.categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Year Select with Add Button */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase flex justify-between">
                    Year
                    <button type="button" onClick={() => { setNewOptionData({type:'year', value:''}); setIsOptionModalOpen(true); }} className="text-blue-400 hover:text-blue-300 text-[10px] flex items-center gap-1">
                      <Plus size={10} /> ADD NEW
                    </button>
                  </label>
                  <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none"
                    value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} required >
                    <option value="" disabled>Select Year</option>
                    {options.years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Image</label>
                  <ImageUploader currentImage={formData.src} onUpload={(url) => setFormData({ ...formData, src: url })} />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase">Description</label>
                  <textarea className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none min-h-[100px]"
                    value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
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
                onChange={e => setNewOptionData({...newOptionData, value: e.target.value})}
              />
              <div className="flex gap-2">
                <button onClick={() => setIsOptionModalOpen(false)} className="flex-1 py-2 rounded-lg hover:bg-zinc-800">Cancel</button>
                <button onClick={handleCreateOption} className="flex-1 bg-white text-black py-2 rounded-lg font-bold hover:bg-zinc-200">Add</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;