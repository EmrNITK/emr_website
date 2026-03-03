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
        toast.success("Member updated");
      } else {
        const res = await axios.post(API_URL, formData, { headers, withCredentials: true });
        savedMember = res.data;

        if (savedMember.year === activeYear) {
            setMembers(prev => [...prev, savedMember]);
        } 
        if (!availableYears.includes(savedMember.year)) {
            setAvailableYears(prev => [savedMember.year, ...prev].sort((a,b) => b - a));
        }
        toast.success("Member added");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this member?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { headers, withCredentials: true });
      setMembers(prev => prev.filter(m => m._id !== id));
      toast.success("Member removed");
    } catch (err) { toast.error("Delete failed"); }
  };

  const updateRank = async (member, newRank) => {
    const updated = { ...member, rank: parseInt(newRank) };
    setMembers(prev => prev.map(m => m._id === member._id ? updated : m).sort((a,b) => a.rank - b.rank));

    try {
      await axios.put(`${API_URL}/${member._id}`, updated, { headers, withCredentials: true });
      toast.success("Rank updated", { id: 'rank-update' });
    } catch (err) { 
        toast.error("Failed to save rank");
        fetchMembers(activeYear);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-black text-white font-sans selection:bg-cyan-500 selection:text-black">
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
                layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                key={member._id} 
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-600 transition-all relative flex flex-col"
                >
                
                {/* Rank Badge */}
                <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase">Rank</span>
                    <input 
                        type="number" 
                        value={member.rank || 0} 
                        onChange={(e) => updateRank(member, e.target.value)}
                        className="w-8 bg-transparent text-center font-bold text-white outline-none border-b border-transparent focus:border-cyan-500 transition-colors text-sm"
                    />
                </div>

                {/* Actions */}
                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(member)} className="p-2 bg-black/60 backdrop-blur rounded-full hover:bg-blue-600 text-white"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(member._id)} className="p-2 bg-black/60 backdrop-blur rounded-full hover:bg-red-600 text-white"><Trash2 size={16} /></button>
                </div>

                {/* Image */}
                <div className="h-64 overflow-hidden relative bg-zinc-800">
                    {member.image ? (
                    <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={member.name} />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600"><UserIcon size={48} /></div>
                    )}
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
            
            {members.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
                <UserIcon className="mx-auto text-zinc-600 mb-4" size={48}/>
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
                
                {/* 1. Name Search Input */}
                <div className="relative z-30">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Search or Enter Name</label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-3.5 text-zinc-500" size={16} />
                    <input 
                      className="input-field pl-10" 
                      placeholder="Type name, roll no, or email..." 
                      value={searchQuery} 
                      onChange={handleSearchChange} 
                      disabled={!!editingItem && creationMode === 'existing'} // Lock name if editing an existing DB user
                      required 
                    />
                  </div>

                  {/* Dropdown Suggestions */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                      <button 
                        type="button"
                        onClick={selectNewUser}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-700 text-cyan-400 font-bold border-b border-zinc-700 flex items-center gap-2"
                      >
                        <Plus size={16}/> Create new "{searchQuery}" for Team
                      </button>
                      
                      {suggestions.map(user => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => selectExistingUser(user)}
                          className="w-full text-left px-4 py-3 hover:bg-zinc-700 transition-colors flex items-center justify-between group border-b border-zinc-700/50 last:border-0"
                        >
                          <div>
                            <div className="font-bold text-white group-hover:text-cyan-400">{user.name}</div>
                            <div className="text-xs text-zinc-400">{user.email}</div>
                          </div>
                          {user.rollNo && <div className="text-xs font-mono bg-zinc-900 px-2 py-1 rounded text-zinc-400">{user.rollNo}</div>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Mode Context Wrapper */}
                {creationMode !== 'select' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                    
                    {/* If NEW, show Image Uploader */}
                    {creationMode === 'new' && (
                      <ImageUploader 
                        currentMedia={formData.image} 
                        width={300}
                        onUpload={(url) => setFormData({...formData, image: url})} 
                      />
                    )}

                    {/* Common Fields: Role, Year, Rank */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Position / Role</label>
                            <input className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required placeholder="e.g. Lead Developer" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Team Year</label>
                            <input type="number" className="input-field" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Sort Rank (1 = Top)</label>
                            <input type="number" className="input-field" value={formData.rank} onChange={e => setFormData({...formData, rank: parseInt(e.target.value)})} required />
                        </div>
                    </div>

                    {/* If NEW, show Bio & Socials */}
                    {creationMode === 'new' && (
                      <>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Bio</label>
                            <textarea className="input-field min-h-[100px]" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
                        </div>

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
                      </>
                    )}

                    <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all mt-4">
                      Save Member
                    </button>
                  </motion.div>
                )}

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
        .input-field:focus { border-color: #06b6d4; }
        .input-field:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default TeamPage;