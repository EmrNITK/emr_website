import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, Upload, Trophy, Globe, Search,
  Calendar, Award, ChevronDown, FileText
} from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader'; // Ensure this path is correct

// --- VISUAL CONFIGURATION ---
const TIER_STYLES = {
  platinum: { 
    rank: 1, 
    label: 'Platinum', 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-950/20', 
    border: 'border-cyan-500/30',
    icon: Trophy 
  },
  gold: { 
    rank: 2, 
    label: 'Gold', 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-950/20', 
    border: 'border-yellow-500/30',
    icon: Award 
  },
  silver: { 
    rank: 3, 
    label: 'Silver', 
    color: 'text-zinc-300', 
    bg: 'bg-zinc-800/50', 
    border: 'border-zinc-600/30',
    icon: Award 
  },
  bronze: { 
    rank: 4, 
    label: 'Bronze', 
    color: 'text-orange-400', 
    bg: 'bg-orange-950/20', 
    border: 'border-orange-600/30',
    icon: Award 
  }
};

const SponsorsPage = () => {
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';
  const ENDPOINT = "sponsors";

  // --- STATE ---
  const [items, setItems] = useState([]); // Initialize empty for API
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isCustomYear, setIsCustomYear] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auth Token
  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // --- API FETCHING ---
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/${ENDPOINT}`, { withCredentials: true });
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to load sponsors");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- DATA PROCESSING (Grouping & Sorting) ---
  const groupedSponsors = useMemo(() => {
    const groups = {};
    
    items.forEach(item => {
      const y = item.year || 'Unspecified';
      if (!groups[y]) groups[y] = [];
      groups[y].push(item);
    });

    const sortedYears = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return sortedYears.map(year => {
      const sortedItems = groups[year].sort((a, b) => {
        const rankA = TIER_STYLES[a.tier]?.rank || 5;
        const rankB = TIER_STYLES[b.tier]?.rank || 5;
        return rankA - rankB;
      });
      return { year, items: sortedItems };
    });
  }, [items]);

  const availableYears = useMemo(() => {
    const years = new Set(items.map(i => i.year).filter(Boolean));
    return Array.from(years).sort().reverse();
  }, [items]);

  // --- HANDLERS ---
  const handleOpenModal = (item = null, forcedYear = null) => {
    setEditingItem(item);
    
    const initialData = item ? { ...item } : { 
      name: '', 
      website: '', 
      tier: 'bronze', 
      logo: '', 
      description: '', // Added description init
      year: forcedYear || new Date().getFullYear().toString() 
    };
    
    setFormData(initialData);
    setIsCustomYear(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Remove this sponsor?")) {
        try {
            await axios.delete(`${API_URL}/${ENDPOINT}/${id}`, { headers ,
          withCredentials: true });
            setItems(prev => prev.filter(i => i._id !== id));
            toast.success("Sponsor removed");
        } catch (err) {
            toast.error("Failed to delete");
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.name || !formData.year) {
        toast.error("Name and Year are required");
        return;
    }

    try {
        if (editingItem) {
          // UPDATE
          const res = await axios.put(`${API_URL}/${ENDPOINT}/${editingItem._id}`, formData, { headers ,
          withCredentials: true });
          setItems(prev => prev.map(i => i._id === editingItem._id ? res.data : i));
          toast.success("Sponsor updated");
        } else {
          // CREATE
          const res = await axios.post(`${API_URL}/${ENDPOINT}`, formData, { headers ,
          withCredentials: true });
          setItems(prev => [...prev, res.data]);
          toast.success("Sponsor added");
        }
        setIsModalOpen(false);
        fetchItems(); // Optional: Refresh to be safe
    } catch (err) {
        toast.error("Operation failed");
        console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-8 ml-0 md:ml-64 min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }}/>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sponsors</h2>
          <p className="text-zinc-400 mt-1 text-sm">Manage partners and sponsorship tiers.</p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => {
                    const nextYear = (new Date().getFullYear() + 1).toString();
                    handleOpenModal(null, nextYear);
                    setIsCustomYear(true);
                }} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all text-sm font-medium"
            >
                <Plus size={16} /> Add Year Group
            </button>
            <button 
                onClick={() => handleOpenModal()} 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-zinc-200 transition-all font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
                <Plus size={18} /> Add Sponsor
            </button>
        </div>
      </div>

      {/* --- MAIN CONTENT (Grouped by Year) --- */}
      <div className="space-y-12">
        {loading ? (
             <div className="text-center py-20 text-zinc-500 animate-pulse">Loading sponsors...</div>
        ) : groupedSponsors.length === 0 ? (
           <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
              <Trophy className="mx-auto text-zinc-600 mb-4" size={48} />
              <p className="text-zinc-500">No sponsors found.</p>
           </div>
        ) : (
           groupedSponsors.map((group) => (
            <section key={group.year} className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Year Header */}
                <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4 sticky top-0 bg-black/80 backdrop-blur-md z-10 pt-4">
                    <div className="flex items-baseline gap-4">
                        <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-600">
                            {group.year}
                        </h3>
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded">
                            {group.items.length} Partners
                        </span>
                    </div>
                    <button 
                        onClick={() => handleOpenModal(null, group.year)}
                        className="text-xs flex items-center gap-1 text-cyan-500 hover:text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/30 px-3 py-1.5 rounded-full border border-cyan-900/50 hover:border-cyan-500/50 transition-all"
                    >
                        <Plus size={14} /> Add to {group.year}
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {group.items.map((sponsor) => {
                        const style = TIER_STYLES[sponsor.tier] || TIER_STYLES.bronze;
                        const Icon = style.icon;

                        return (
                            <motion.div 
                                layout
                                key={sponsor._id}
                                className={`group relative bg-zinc-900 rounded-xl overflow-hidden border ${style.border} hover:border-opacity-100 transition-all duration-300`}
                            >
                                {/* Tier Badge */}
                                <div className={`absolute top-0 right-0 z-10 px-3 py-1 rounded-bl-lg border-b border-l ${style.border} ${style.bg} backdrop-blur-md flex items-center gap-1.5`}>
                                    <Icon size={12} className={style.color} />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${style.color}`}>
                                        {style.label}
                                    </span>
                                </div>

                                {/* Logo Area */}
                                <div className="h-32 bg-zinc-950/50 flex items-center justify-center p-6 relative overflow-hidden">
                                    {sponsor.logo ? (
                                        <img src={sponsor.logo} alt={sponsor.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    ) : (
                                        <div className="text-2xl font-bold text-zinc-700 select-none">
                                            {sponsor.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    {/* Edit/Delete Overlay */}
                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button onClick={() => handleOpenModal(sponsor)} className="p-2 bg-zinc-800 rounded-full hover:bg-cyan-600 text-white transition-colors"><Edit2 size={16}/></button>
                                        <button onClick={() => handleDelete(sponsor._id)} className="p-2 bg-zinc-800 rounded-full hover:bg-red-600 text-white transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 border-t border-white/5">
                                    <h4 className="font-bold text-lg text-white mb-1">{sponsor.name}</h4>
                                    
                                    {/* Show description in card if exists */}
                                    {sponsor.description && (
                                        <p className="text-xs text-zinc-500 line-clamp-2 mb-2">
                                            {sponsor.description}
                                        </p>
                                    )}

                                    <div className="flex justify-between items-center mt-3">
                                        {sponsor.website ? (
                                            <a href={sponsor.website} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                                                <Globe size={12} /> Website
                                            </a>
                                        ) : <span className="text-xs text-zinc-600">No URL</span>}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
           ))
        )}
      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setIsModalOpen(false)}
                />
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center p-6 border-b border-zinc-800 bg-zinc-900/50 sticky top-0 z-10">
                        <h3 className="text-xl font-bold text-white">
                            {editingItem ? 'Edit Sponsor' : 'Add New Sponsor'}
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        
                        {/* 1. Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Company Name</label>
                            <input 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Acme Corp"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>

                        {/* 2. Year (Smart Selection) */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Sponsorship Year</label>
                                <button 
                                    type="button" 
                                    onClick={() => setIsCustomYear(!isCustomYear)}
                                    className="text-[10px] text-cyan-500 hover:underline uppercase font-bold"
                                >
                                    {isCustomYear ? 'Select Existing' : 'Add New Year'}
                                </button>
                            </div>
                            
                            {isCustomYear ? (
                                <input 
                                    type="number"
                                    value={formData.year}
                                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                                    placeholder="Enter Year (e.g. 2026)"
                                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                                    autoFocus
                                />
                            ) : (
                                <div className="relative">
                                    <select 
                                        value={formData.year}
                                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none appearance-none cursor-pointer"
                                    >
                                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                        {availableYears.length === 0 && <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3.5 text-zinc-500 pointer-events-none" size={16} />
                                </div>
                            )}
                        </div>

                        {/* 3. Tier */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Tier</label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.keys(TIER_STYLES).map((tierKey) => {
                                    const style = TIER_STYLES[tierKey];
                                    const isSelected = formData.tier === tierKey;
                                    return (
                                        <button
                                            key={tierKey}
                                            type="button"
                                            onClick={() => setFormData({...formData, tier: tierKey})}
                                            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                                                isSelected 
                                                ? `${style.bg} ${style.border} ring-1 ring-offset-1 ring-offset-black ring-${style.color.split('-')[1]}-500`
                                                : 'bg-zinc-900 border-zinc-800 opacity-50 hover:opacity-100'
                                            }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-current' : 'bg-zinc-600'} ${isSelected ? style.color : ''}`} />
                                            <span className={`text-sm font-bold uppercase ${isSelected ? 'text-white' : 'text-zinc-400'}`}>{style.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 4. Logo Upload */}
                        <ImageUploader 
                            currentImage={formData.logo}
                            onUpload={(url) => setFormData({...formData, logo: url})}
                        />

                        {/* 5. Website */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Website URL</label>
                            <input 
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({...formData, website: e.target.value})}
                                placeholder="https://"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>

                        {/* 6. Description (NEW FIELD) */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                            <input 
                                type="text"
                                value={formData.description || ''}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}                               
                                placeholder="Sponser Desc"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>

                        <button type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-zinc-200 transition-all mt-4">
                            {editingItem ? 'Save Changes' : 'Add Sponsor'}
                        </button>

                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SponsorsPage;