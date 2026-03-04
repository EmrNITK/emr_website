import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, X, Linkedin, Github, Instagram, 
  User as UserIcon, Loader2, Search 
} from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/team';

const TeamPage = () => {
  const [members, setMembers] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Search & Creation Mode State ('select', 'existing', 'new')
  const [creationMode, setCreationMode] = useState('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const searchTimeoutRef = useRef(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // Reusable input class for consistency
  const inputClass = "w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20 disabled:opacity-50 disabled:cursor-not-allowed";

  useEffect(() => {
    initView();
  }, []);

  const initView = async () => {
    try {
      const yearRes = await axios.get(`${API_URL}/years`, { withCredentials: true });
      const years = yearRes.data.sort((a, b) => b - a);
      
      const currentYear = new Date().getFullYear();
      if (!years.includes(currentYear)) years.unshift(currentYear);
      
      setAvailableYears(years);
      const initialYear = years.length > 0 ? years[0] : currentYear;
      setActiveYear(initialYear);
      await fetchMembers(initialYear);
    } catch (err) {
      toast.error("Failed to initialize team data");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (year) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?year=${year}`, { withCredentials: true });
      const sorted = res.data.sort((a, b) => (a.rank || 99) - (b.rank || 99));
      setMembers(sorted);
    } catch (err) {
      toast.error(`Failed to load ${year} team`);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (year) => {
    setActiveYear(year);
    fetchMembers(year);
  };

  // --- Search Logic ---
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFormData(prev => ({ ...prev, name: query }));

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.trim().length > 1) {
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await axios.get(`${API_URL}/search-users?q=${query}`, { headers, withCredentials: true });
          setSuggestions(res.data);
          setShowDropdown(true);
        } catch (err) {
          console.error("Search failed", err);
        }
      }, 300); // 300ms debounce
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const selectExistingUser = (user) => {
    setCreationMode('existing');
    setShowDropdown(false);
    setSearchQuery(user.name);
    setFormData({
      ...formData,
      isExistingUser: true,
      userId: user._id,
      name: user.name,
      image: user.profilePhoto || '',
      // Only keep role, year, rank
      bio: '', linkedin: '', github: '', instagram: ''
    });
  };

  const selectNewUser = () => {
    setCreationMode('new');
    setShowDropdown(false);
    setFormData(prev => ({ ...prev, isExistingUser: false, userId: null }));
  };

  // --- CRUD Handlers ---
  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setCreationMode(item.userId ? 'existing' : 'new');
      setSearchQuery(item.name);
    } else {
      setCreationMode('select');
      setSearchQuery('');
    }
    
    setFormData(item || { 
      name: '', role: '', image: '', 
      linkedin: '', instagram: '', github: '', bio: '', 
      rank: members.length + 1, year: activeYear,
      isExistingUser: false, userId: null
    });
    
    setShowDropdown(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let savedMember;
      
      if (editingItem) {
        const res = await axios.put(`${API_URL}/${editingItem._id}`, formData, { headers, withCredentials: true });
        savedMember = res.data;
        
        if (savedMember.year === activeYear) {
            setMembers(prev => prev.map(m => m._id === editingItem._id ? savedMember : m));
        } else {
            setMembers(prev => prev.filter(m => m._id !== editingItem._id));
            if (!availableYears.includes(savedMember.year)) {
                setAvailableYears(prev => [...prev, savedMember.year].sort((a,b) => b - a));
            }
        }
        toast.success("Member updated", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      } else {
        const res = await axios.post(API_URL, formData, { headers, withCredentials: true });
        savedMember = res.data;

        if (savedMember.year === activeYear) {
            setMembers(prev => [...prev, savedMember]);
        } 
        if (!availableYears.includes(savedMember.year)) {
            setAvailableYears(prev => [savedMember.year, ...prev].sort((a,b) => b - a));
        }
        toast.success("Member added", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Operation failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }});
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers, withCredentials: true });
      setMembers(prev => prev.filter(m => m._id !== id));
      toast.success("Member removed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
    } catch (err) { 
      toast.error("Delete failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    }
  };

  const updateRank = async (member, newRank) => {
    const updated = { ...member, rank: parseInt(newRank) };
    setMembers(prev => prev.map(m => m._id === member._id ? updated : m).sort((a,b) => a.rank - b.rank));

    try {
      await axios.put(`${API_URL}/${member._id}`, updated, { headers, withCredentials: true });
      toast.success("Rank updated", { id: 'rank-update', style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
    } catch (err) { 
        toast.error("Failed to save rank");
        fetchMembers(activeYear);
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative z-10 w-full">
      <Toaster position="bottom-right" />

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Team Management</h2>
          <p className="text-white/60 mt-1">Manage team members, roles, and hierarchy.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 bg-[#51b749]/80 hover:bg-[#38984c] text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} /> Add Member to {activeYear}
        </button>
      </div>

      {/* --- YEAR TABS --- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/5 custom-scrollbar">
        {availableYears.map(year => (
          <button
            key={year}
            onClick={() => handleYearChange(year)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
              activeYear === year 
                ? 'bg-[#13703a]/20 border-[#51b749]/30 text-[#51b749] shadow-[0_0_15px_-3px_rgba(81,183,73,0.2)]' 
                : 'bg-black border-white/5 text-white/50 hover:text-white hover:bg-white/5 hover:border-white/10'
            }`}
          >
            {year} Team
          </button>
        ))}
      </div>

      {/* --- MEMBERS GRID --- */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-white/40 gap-2">
            <Loader2 className="animate-spin text-[#51b749]" /> Loading {activeYear} data...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode='popLayout'>
              {members.map((member) => (
                  <motion.div 
                  layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  key={member._id} 
                  className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden group hover:border-[#51b749]/50 hover:shadow-[0_0_20px_-5px_rgba(81,183,73,0.3)] transition-all duration-300 relative flex flex-col"
                  >
                  
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white/40 uppercase">Rank</span>
                      <input 
                          type="number" 
                          value={member.rank || 0} 
                          onChange={(e) => updateRank(member, e.target.value)}
                          className="w-8 bg-transparent text-center font-bold text-white outline-none border-b border-transparent focus:border-[#51b749] transition-colors text-sm"
                      />
                  </div>

                  {/* Actions */}
                  <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <button 
                        onClick={() => handleOpenModal(member)} 
                        className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-[#51b749]/20 hover:text-[#51b749] hover:border-[#51b749]/50 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(member._id)} 
                        className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                  </div>

                  {/* Image */}
                  <div className="h-64 overflow-hidden relative bg-black border-b border-white/5">
                      {member.image ? (
                        <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" alt={member.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10"><UserIcon size={48} /></div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center gap-4">
                          {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="text-white/40 hover:text-[#51b749] transition-colors"><Linkedin size={18}/></a>}
                          {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white transition-colors"><Github size={18}/></a>}
                          {member.instagram && <a href={member.instagram} target="_blank" rel="noreferrer" className="text-white/40 hover:text-[#51b749] transition-colors"><Instagram size={18}/></a>}
                      </div>
                  </div>

                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col text-center">
                      <h3 className="font-bold text-xl text-white group-hover:text-[#51b749] transition-colors">{member.name}</h3>
                      <p className="text-[#51b749] text-sm font-medium mb-3">{member.role}</p>
                      {member.bio && <p className="text-white/50 text-xs line-clamp-2 leading-relaxed">{member.bio}</p>}
                  </div>

                  </motion.div>
              ))}
              </AnimatePresence>
          </div>
            
          {members.length === 0 && (
          <div className="w-full py-20 text-center border border-dashed border-white/10 rounded-2xl bg-white/5 mt-6">
              <UserIcon className="mx-auto text-white/20 mb-4" size={48}/>
              <h3 className="text-xl font-bold text-white/60">No members in {activeYear}</h3>
              <p className="text-white/40 mt-2">Click "Add Member" to get started.</p>
          </div>
          )}
        </>
      )}

      {/* --- MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] custom-scrollbar"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111111] z-20">
                <h3 className="text-xl font-bold text-white tracking-tight">{editingItem ? 'Edit Member' : 'New Member'}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* 1. Name Search Input */}
                <div className="relative z-30">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Search or Enter Name</label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-3.5 text-white/40" size={16} />
                    <input 
                      className={`${inputClass} pl-10`}
                      placeholder="Type name, roll no, or email..." 
                      value={searchQuery} 
                      onChange={handleSearchChange} 
                      disabled={!!editingItem && creationMode === 'existing'} // Lock name if editing an existing DB user
                      required 
                    />
                  </div>

                  {/* Dropdown Suggestions */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#111111] border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                      <button 
                        type="button"
                        onClick={selectNewUser}
                        className="w-full text-left px-4 py-3 hover:bg-white/5 text-[#51b749] font-medium border-b border-white/10 flex items-center gap-2 transition-colors"
                      >
                        <Plus size={16}/> Create new "{searchQuery}" for Team
                      </button>
                      
                      {suggestions.map(user => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => selectExistingUser(user)}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                        >
                          <div>
                            <div className="font-medium text-white group-hover:text-[#51b749] transition-colors">{user.name}</div>
                            <div className="text-xs text-white/40">{user.email}</div>
                          </div>
                          {user.rollNo && <div className="text-xs font-mono bg-black border border-white/10 px-2 py-1 rounded-md text-white/50">{user.rollNo}</div>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Mode Context Wrapper */}
                {creationMode !== 'select' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    
                    {/* If NEW, show Image Uploader */}
                    {creationMode === 'new' && (
                      <div className="pt-2">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 block">Profile Photo</label>
                        <ImageUploader 
                          currentMedia={formData.image} 
                          width={300}
                          onUpload={(url) => setFormData({...formData, image: url})} 
                        />
                      </div>
                    )}

                    {/* Common Fields: Role, Year, Rank */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Position / Role</label>
                            <input className={inputClass} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required placeholder="e.g. Lead Developer" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Team Year</label>
                            <input type="number" className={inputClass} value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Sort Rank (1 = Top)</label>
                            <input type="number" className={inputClass} value={formData.rank} onChange={e => setFormData({...formData, rank: parseInt(e.target.value)})} required />
                        </div>
                    </div>

                    {/* If NEW, show Bio & Socials */}
                    {creationMode === 'new' && (
                      <>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Bio</label>
                            <textarea className={`${inputClass} min-h-[100px] resize-none`} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Social Links</label>
                            <div className="relative">
                                <Linkedin size={16} className="absolute left-3 top-3.5 text-white/40"/>
                                <input className={`${inputClass} pl-10`} placeholder="LinkedIn URL" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                            </div>
                            <div className="relative">
                                <Github size={16} className="absolute left-3 top-3.5 text-white/40"/>
                                <input className={`${inputClass} pl-10`} placeholder="GitHub URL" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} />
                            </div>
                            <div className="relative">
                                <Instagram size={16} className="absolute left-3 top-3.5 text-white/40"/>
                                <input className={`${inputClass} pl-10`} placeholder="Instagram URL" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                            </div>
                        </div>
                      </>
                    )}

                    <div className="pt-4 border-t border-white/5">
                      <button 
                        type="submit" 
                        className="w-full bg-[#51b749]/80 text-white font-medium py-3 rounded-lg hover:bg-[#38984c] shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95"
                      >
                        Save Member
                      </button>
                    </div>
                  </motion.div>
                )}

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(81,183,73,0.5); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TeamPage;