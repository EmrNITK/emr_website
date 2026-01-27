import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, Linkedin, Github, Instagram, 
  User, Loader2 
} from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api/team';

const TeamPage = () => {
  // --- STATE ---
  const [members, setMembers] = useState([]); // Only holds members of *activeYear*
  const [availableYears, setAvailableYears] = useState([]);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // --- INITIALIZATION ---
  useEffect(() => {
    initView();
  }, []);

  const initView = async () => {
    try {
      // 1. Fetch Available Years
      const yearRes = await axios.get(`${API_URL}/years`, { withCredentials: true });
      const years = yearRes.data.sort((a, b) => b - a);
      
      // Ensure current year is always in the list for the "Add" button context
      const currentYear = new Date().getFullYear();
      if (!years.includes(currentYear)) {
          years.unshift(currentYear);
      }
      
      setAvailableYears(years);

      // 2. Determine initial year to load (latest available)
      const initialYear = years.length > 0 ? years[0] : currentYear;
      setActiveYear(initialYear);

      // 3. Fetch Members for that year
      await fetchMembers(initialYear);

    } catch (err) {
      toast.error("Failed to initialize team data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch members specific to a year
  const fetchMembers = async (year) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?year=${year}`, { withCredentials: true });
      // Sort client-side just in case server sort fails (Rank Ascending)
      const sorted = res.data.sort((a, b) => (a.rank || 99) - (b.rank || 99));
      setMembers(sorted);
    } catch (err) {
      toast.error(`Failed to load ${year} team`);
    } finally {
      setLoading(false);
    }
  };

  // Change Tab Handler
  const handleYearChange = (year) => {
    setActiveYear(year);
    fetchMembers(year);
  };

  // --- CRUD HANDLERS ---
  
  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || { 
      name: '', role: '', image: '', 
      linkedin: '', instagram: '', github: '', 
      bio: '', 
      // Auto-suggest rank: put at end of current list
      rank: members.length + 1, 
      year: activeYear 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let savedMember;
      
      if (editingItem) {
        // UPDATE
        const res = await axios.put(`${API_URL}/${editingItem._id}`, formData, { headers ,
          withCredentials: true });
        savedMember = res.data;
        
        // If year didn't change, update UI locally
        if (savedMember.year === activeYear) {
            setMembers(prev => prev.map(m => m._id === editingItem._id ? savedMember : m));
        } else {
            // If moved to another year, remove from current view
            setMembers(prev => prev.filter(m => m._id !== editingItem._id));
            // Refresh years list in case it was a new year
            if (!availableYears.includes(savedMember.year)) {
                setAvailableYears(prev => [...prev, savedMember.year].sort((a,b) => b - a));
            }
        }
        toast.success("Member updated");
      } else {
        // CREATE
        const res = await axios.post(API_URL, formData, { headers ,
          withCredentials: true });
        savedMember = res.data;

        // If added to current active view, show it
        if (savedMember.year === activeYear) {
            setMembers(prev => [...prev, savedMember]);
        } 
        
        // If added to a new year not in tabs, update tabs
        if (!availableYears.includes(savedMember.year)) {
            setAvailableYears(prev => [savedMember.year, ...prev].sort((a,b) => b - a));
        }
        
        toast.success("Member added");
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers ,
          withCredentials: true });
      setMembers(prev => prev.filter(m => m._id !== id));
      toast.success("Member removed");
    } catch (err) { toast.error("Delete failed"); }
  };

  // Quick Rank Update
  const updateRank = async (member, newRank) => {
    // Optimistic Update
    const updated = { ...member, rank: parseInt(newRank) };
    setMembers(prev => prev.map(m => m._id === member._id ? updated : m).sort((a,b) => a.rank - b.rank));

    try {
      await axios.put(`${API_URL}/${member._id}`, updated, { headers,
          withCredentials: true  });
      toast.success("Rank updated", { id: 'rank-update' }); // dedupe toasts
    } catch (err) { 
        toast.error("Failed to save rank");
        fetchMembers(activeYear); // Revert on fail
    }
  };

  return (
    <div className="p-8 ml-64 min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Team Management</h2>
          <p className="text-zinc-400 mt-1">Manage team members, roles, and hierarchy.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-all font-bold shadow-lg shadow-white/10"
        >
          <Plus size={18} /> Add Member to {activeYear}
        </button>
      </div>

      {/* --- YEAR TABS --- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-zinc-800 scrollbar-hide">
        {availableYears.map(year => (
          <button
            key={year}
            onClick={() => handleYearChange(year)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
              activeYear === year 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-blue-900/40' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {year} Team
          </button>
        ))}
      </div>

      {/* --- MEMBERS GRID --- */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-zinc-500 gap-2">
            <Loader2 className="animate-spin" /> Loading {activeYear} data...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode='popLayout'>
            {members.map((member) => (
                <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                key={member._id} 
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-600 transition-all relative flex flex-col"
                >
                
                {/* Rank Badge / Quick Edit */}
                <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Rank</span>
                    <input 
                        type="number" 
                        value={member.rank || 0} 
                        onChange={(e) => updateRank(member, e.target.value)}
                        className="w-8 bg-transparent text-center font-bold text-white outline-none border-b border-transparent focus:border-cyan-500 transition-colors text-sm"
                    />
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(member)} className="p-2 bg-black/60 backdrop-blur rounded-full hover:bg-blue-600 text-white"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(member._id)} className="p-2 bg-black/60 backdrop-blur rounded-full hover:bg-red-600 text-white"><Trash2 size={16} /></button>
                </div>

                {/* Image */}
                <div className="h-64 overflow-hidden relative bg-zinc-800">
                    {member.image ? (
                    <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={member.name} />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600"><User size={48} /></div>
                    )}
                    {/* Social Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-4">
                        {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-blue-500"><Linkedin size={18}/></a>}
                        {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white"><Github size={18}/></a>}
                        {member.instagram && <a href={member.instagram} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-pink-500"><Instagram size={18}/></a>}
                    </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col text-center">
                    <h3 className="font-bold text-xl text-white">{member.name}</h3>
                    <p className="text-cyan-400 text-sm font-medium mb-3">{member.role}</p>
                    {member.bio && <p className="text-zinc-500 text-xs line-clamp-2">{member.bio}</p>}
                </div>

                </motion.div>
            ))}
            </AnimatePresence>
            
            {/* Empty State */}
            {members.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
                <User className="mx-auto text-zinc-600 mb-4" size={48}/>
                <h3 className="text-xl font-bold text-zinc-400">No members in {activeYear}</h3>
                <p className="text-zinc-600 mt-2">Click "Add Member" to get started.</p>
            </div>
            )}
        </div>
      )}

      {/* --- MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-950 z-20">
                <h3 className="text-xl font-bold">{editingItem ? 'Edit Member' : 'New Member'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-400 hover:text-white" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                
                {/* Image Upload */}
                <ImageUploader 
                    currentImage={formData.image} 
                    onUpload={(url) => setFormData({...formData, image: url})} 
                />

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Full Name</label>
                        <input className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Role / Position</label>
                        <input className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Team Year</label>
                        <input type="number" className="input-field" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} required />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Sort Rank (1 = Top)</label>
                        <input type="number" className="input-field" value={formData.rank} onChange={e => setFormData({...formData, rank: parseInt(e.target.value)})} required />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Bio</label>
                    <textarea className="input-field min-h-[100px]" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                </div>

                {/* Socials */}
                <div className="space-y-3 pt-2 border-t border-zinc-800">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Social Links</label>
                    <div className="relative">
                        <Linkedin size={16} className="absolute left-3 top-3 text-zinc-500"/>
                        <input className="input-field pl-10" placeholder="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                    </div>
                    <div className="relative">
                        <Github size={16} className="absolute left-3 top-3 text-zinc-500"/>
                        <input className="input-field pl-10" placeholder="GitHub URL" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
                    </div>
                    <div className="relative">
                        <Instagram size={16} className="absolute left-3 top-3 text-zinc-500"/>
                        <input className="input-field pl-10" placeholder="Instagram URL" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                    </div>
                </div>

                <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all mt-4">
                  Save Member
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .input-field {
            width: 100%;
            background-color: #18181b;
            border: 1px solid #27272a;
            border-radius: 0.5rem;
            padding: 0.75rem;
            color: white;
            outline: none;
        }
        .input-field:focus {
            border-color: #06b6d4;
        }
      `}</style>
    </div>
  );
};

export default TeamPage;