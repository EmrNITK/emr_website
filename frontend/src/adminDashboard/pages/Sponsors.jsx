import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, Upload, Trophy, Globe, Search,
  Calendar, Award, ChevronDown, FileText, Loader2
} from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

// --- VISUAL CONFIGURATION ---
const TIER_STYLES = {
  platinum: { 
    rank: 1, 
    label: 'Platinum', 
    color: 'text-[#58a6ff]', // Cyan/Blue
    bg: 'bg-[#58a6ff]/10', 
    border: 'border-[#58a6ff]/30',
    icon: Trophy 
  },
  gold: { 
    rank: 2, 
    label: 'Gold', 
    color: 'text-[#e3b341]', // Gold
    bg: 'bg-[#e3b341]/10', 
    border: 'border-[#e3b341]/30',
    icon: Award 
  },
  silver: { 
    rank: 3, 
    label: 'Silver', 
    color: 'text-white/70', // Silver
    bg: 'bg-white/5', 
    border: 'border-white/20',
    icon: Award 
  },
  bronze: { 
    rank: 4, 
    label: 'Bronze', 
    color: 'text-[#d97736]', // Bronze
    bg: 'bg-[#d97736]/10', 
    border: 'border-[#d97736]/30',
    icon: Award 
  }
};

const SponsorsPage = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
  const ENDPOINT = "sponsors";

  // --- STATE ---
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isCustomYear, setIsCustomYear] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auth Token
  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // Reusable input class
  const inputClass = "w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20";

  // --- API FETCHING ---
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/${ENDPOINT}`, { withCredentials: true });
      setItems(res.data);
    } catch (err) {
      toast.error("Failed to load sponsors", { style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }});
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
      description: '',
      year: forcedYear || new Date().getFullYear().toString() 
    };
    
    setFormData(initialData);
    setIsCustomYear(false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm("Remove this sponsor?")) {
        try {
            await axios.delete(`${API_URL}/${ENDPOINT}/${id}`, { headers, withCredentials: true });
            setItems(prev => prev.filter(i => i._id !== id));
            toast.success("Sponsor removed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
        } catch (err) {
            toast.error("Failed to delete", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }});
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
          const res = await axios.put(`${API_URL}/${ENDPOINT}/${editingItem._id}`, formData, { headers, withCredentials: true });
          setItems(prev => prev.map(i => i._id === editingItem._id ? res.data : i));
          toast.success("Sponsor updated", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
        } else {
          // CREATE
          const res = await axios.post(`${API_URL}/${ENDPOINT}`, formData, { headers, withCredentials: true });
          setItems(prev => [...prev, res.data]);
          toast.success("Sponsor added", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
        }
        setIsModalOpen(false);
        fetchItems();
    } catch (err) {
        toast.error("Operation failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }});
        console.error(err);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative z-10 w-full">
      <Toaster position="bottom-right" />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Sponsors</h2>
          <p className="text-white/60 mt-1 text-sm">Manage partners and sponsorship tiers.</p>
        </div>
        <div className="flex flex-wrap gap-3">
             <button 
                onClick={() => {
                    const nextYear = (new Date().getFullYear() + 1).toString();
                    handleOpenModal(null, nextYear);
                    setIsCustomYear(true);
                }} 
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black border border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-all text-sm font-medium whitespace-nowrap"
            >
                <Plus size={16} /> Add Year Group
            </button>
            <button 
                onClick={() => handleOpenModal()} 
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#51b749]/80 hover:bg-[#38984c] text-white transition-all font-medium text-sm shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] active:scale-95 whitespace-nowrap"
            >
                <Plus size={18} /> Add Sponsor
            </button>
        </div>
      </div>

      {/* --- MAIN CONTENT (Grouped by Year) --- */}
      <div className="space-y-12">
        {loading ? (
             <div className="flex items-center justify-center py-20 text-white/40 gap-2">
                 <Loader2 className="animate-spin text-[#51b749]" /> Loading sponsors...
             </div>
        ) : groupedSponsors.length === 0 ? (
           <div className="w-full text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 mt-6">
              <Trophy className="mx-auto text-white/20 mb-4" size={48} />
              <p className="text-white/40">No sponsors found.</p>
           </div>
        ) : (
           groupedSponsors.map((group) => (
            <section key={group.year} className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Year Header */}
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4 sticky top-0 bg-[#111111]/80 backdrop-blur-md z-10 pt-4">
                    <div className="flex items-baseline gap-4">
                        <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
                            {group.year}
                        </h3>
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                            {group.items.length} Partners
                        </span>
                    </div>
                    <button 
                        onClick={() => handleOpenModal(null, group.year)}
                        className="text-xs flex items-center gap-1 text-[#51b749] hover:text-[#38984c] font-bold uppercase tracking-wider bg-[#13703a]/20 px-3 py-1.5 rounded-full border border-[#51b749]/30 hover:border-[#51b749]/50 transition-all"
                    >
                        <Plus size={14} /> Add to {group.year}
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {group.items.map((sponsor) => {
                        const style = TIER_STYLES[sponsor.tier] || TIER_STYLES.bronze;
                        const Icon = style.icon;

                        return (
                            <motion.div 
                                layout
                                key={sponsor._id}
                                className="group relative bg-[#111111] border border-white/5 rounded-xl overflow-hidden hover:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)] transition-all duration-300 flex flex-col"
                            >
                                {/* Tier Badge */}
                                <div className={`absolute top-0 right-0 z-10 px-3 py-1 rounded-bl-xl border-b border-l ${style.border} ${style.bg} backdrop-blur-md flex items-center gap-1.5`}>
                                    <Icon size={12} className={style.color} />
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${style.color}`}>
                                        {style.label}
                                    </span>
                                </div>

                                {/* Logo Area */}
                                <div className="h-36 bg-black flex items-center justify-center p-6 relative overflow-hidden border-b border-white/5">
                                    {sponsor.logo ? (
                                        <img src={sponsor.logo} alt={sponsor.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                                    ) : (
                                        <div className="text-2xl font-bold text-white/20 select-none">
                                            {sponsor.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    {/* Edit/Delete Overlay */}
                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 translate-y-2 group-hover:translate-y-0">
                                        <button onClick={() => handleOpenModal(sponsor)} className="p-2 bg-white/10 rounded-lg hover:bg-[#51b749]/20 hover:text-[#51b749] border border-transparent hover:border-[#51b749]/50 text-white transition-all"><Edit2 size={16}/></button>
                                        <button onClick={() => handleDelete(sponsor._id)} className="p-2 bg-white/10 rounded-lg hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/50 text-white transition-all"><Trash2 size={16}/></button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h4 className="font-bold text-lg text-white mb-2 group-hover:text-[#51b749] transition-colors">{sponsor.name}</h4>
                                    
                                    {sponsor.description && (
                                        <p className="text-xs text-white/50 line-clamp-2 mb-4 leading-relaxed flex-1">
                                            {sponsor.description}
                                        </p>
                                    )}

                                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-white/5">
                                        {sponsor.website ? (
                                            <a href={sponsor.website} target="_blank" rel="noreferrer" className="text-xs font-medium text-white/40 hover:text-[#51b749] flex items-center gap-1.5 transition-colors">
                                                <Globe size={14} /> Visit Website
                                            </a>
                                        ) : <span className="text-xs font-medium text-white/20">No URL Provided</span>}
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={() => setIsModalOpen(false)}
                />
                <motion.div 
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                    <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#111111] sticky top-0 z-20">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            {editingItem ? 'Edit Sponsor' : 'Add New Sponsor'}
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        
                        {/* 1. Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Company Name</label>
                            <input 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Acme Corp"
                                className={inputClass}
                            />
                        </div>

                        {/* 2. Year (Smart Selection) */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Sponsorship Year</label>
                                <button 
                                    type="button" 
                                    onClick={() => setIsCustomYear(!isCustomYear)}
                                    className="text-[10px] text-[#51b749] hover:text-[#38984c] uppercase font-bold transition-colors"
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
                                    className={inputClass}
                                    autoFocus
                                />
                            ) : (
                                <div className="relative">
                                    <select 
                                        value={formData.year}
                                        onChange={(e) => setFormData({...formData, year: e.target.value})}
                                        className={`${inputClass} appearance-none cursor-pointer`}
                                    >
                                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                                        {availableYears.length === 0 && <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3.5 text-white/40 pointer-events-none" size={16} />
                                </div>
                            )}
                        </div>

                        {/* 3. Tier */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Tier</label>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.keys(TIER_STYLES).map((tierKey) => {
                                    const style = TIER_STYLES[tierKey];
                                    const isSelected = formData.tier === tierKey;
                                    return (
                                        <button
                                            key={tierKey}
                                            type="button"
                                            onClick={() => setFormData({...formData, tier: tierKey})}
                                            className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-300 ${
                                                isSelected 
                                                ? `${style.bg} ${style.border} shadow-[0_0_15px_rgba(255,255,255,0.05)]`
                                                : 'bg-black border-white/5 hover:border-white/20 hover:bg-white/5 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-current' : 'bg-white/20'} ${isSelected ? style.color : ''}`} />
                                            <span className={`text-sm font-bold uppercase tracking-wider ${isSelected ? 'text-white' : 'text-white/50'}`}>{style.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 4. Logo Upload */}
                        <div className="pt-2">
                           <label className="text-xs font-semibold text-white/70 uppercase tracking-wider block mb-2">Company Logo</label>
                           <ImageUploader 
                             currentMedia={formData.logo} 
                             width={300}
                             onUpload={(url) => setFormData({ ...formData, logo: url })} 
                           />
                        </div>

                        {/* 5. Website */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Website URL</label>
                            <input 
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({...formData, website: e.target.value})}
                                placeholder="https://"
                                className={inputClass}
                            />
                        </div>

                        {/* 6. Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Description</label>
                            <textarea 
                                value={formData.description || ''}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}                               
                                placeholder="Brief description of the sponsor..."
                                className={`${inputClass} min-h-[80px] resize-none`}
                            />
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <button 
                              type="submit" 
                              className="w-full bg-[#51b749]/80 text-white font-medium py-3 rounded-lg hover:bg-[#38984c] shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95"
                            >
                                {editingItem ? 'Save Changes' : 'Add Sponsor'}
                            </button>
                        </div>

                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Custom Scrollbar for Modal */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(81,183,73,0.5); }
      `}</style>
    </div>
  );
};

export default SponsorsPage;