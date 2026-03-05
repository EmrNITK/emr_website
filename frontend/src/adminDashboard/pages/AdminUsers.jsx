import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Trash2, Edit2, Search, Loader2, User as UserIcon, X, Plus } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/admin';

const AdminPage = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('admin');

    const searchTimeoutRef = useRef(null);
    const token = localStorage.getItem('token');
    const headers = { Authorization: token };
    const inputClass = "w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20";

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL, { headers, withCredentials: true });
            setAdmins(res.data);
        } catch (err) {
            toast.error("Failed to load admins");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        if (query.trim().length > 1) {
            searchTimeoutRef.current = setTimeout(async () => {
                try {
                    const res = await axios.get(`${API_URL}/search?q=${query}`, { headers, withCredentials: true });
                    setSuggestions(res.data);
                    setShowDropdown(true);
                } catch (err) {
                    toast.error("Search failed");
                }
            }, 300);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    };

    const openMakeAdminModal = (user) => {
        setSelectedUser(user);
        setSelectedRole('admin');
        setIsEditing(false);
        setShowDropdown(false);
        setIsModalOpen(true);
        setSearchQuery('');
    };

    const openEditModal = (admin) => {
        setSelectedUser(admin);
        setSelectedRole(admin.userType);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSubmitRole = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`${API_URL}/${selectedUser._id}`, { role: selectedRole }, { headers, withCredentials: true });
            
            setAdmins(prev => {
                const exists = prev.find(a => a._id === selectedUser._id);
                let newList = exists 
                    ? prev.map(a => a._id === selectedUser._id ? res.data : a)
                    : [...prev, res.data];
                return newList.sort((a, b) => (a.userType === 'super-admin' ? -1 : 1));
            });

            setIsModalOpen(false);
            setSelectedUser(null);
            setIsEditing(false);
            toast.success(`${res.data.name} is now ${selectedRole}`, { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' } });
        } catch (err) {
            toast.error("Operation failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' } });
        }
    };

    const handleRemoveAdmin = async (id, name) => {
        if (!window.confirm(`Remove admin rights for ${name}?`)) return;
        try {
            await axios.put(`${API_URL}/remove/${id}`, {}, { headers, withCredentials: true });
            setAdmins(prev => prev.filter(a => a._id !== id));
            toast.success("Admin rights removed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' } });
        } catch (err) {
            toast.error("Remove failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' } });
        }
    };

    return (
        <div className="p-4 md:p-8 min-h-screen relative z-10 w-full">
            <Toaster position="bottom-right" />

            <div className="flex flex-col mb-8 gap-4 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Admin Management</h2>
                    <p className="text-white/60 mt-1">Assign and manage admin and super-admin roles.</p>
                </div>

                <div className="relative z-30 w-full max-w-md mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-white/40" size={16} />
                        <input
                            className={`${inputClass} pl-10`}
                            placeholder="Search users to make admin..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>

                    {showDropdown && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111111] border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden overflow-y-auto max-h-60 custom-scrollbar z-[1000]">
                            {suggestions.map(user => (
                                <button
                                    key={user._id}
                                    onClick={() => openMakeAdminModal(user)}
                                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center justify-between group border-b border-white/5 last:border-0"
                                >
                                    <div>
                                        <div className="font-medium text-white group-hover:text-[#51b749] transition-colors">{user.name}</div>
                                        <div className="text-xs text-white/40">{user.email}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {user.rollNo && <div className="text-xs font-mono bg-black border border-white/10 px-2 py-1 rounded-md text-white/50">{user.rollNo}</div>}
                                        <Plus size={16} className="text-[#51b749] opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 text-white/40 gap-2">
                    <Loader2 className="animate-spin text-[#51b749]" /> Loading admins...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {admins.map((admin) => (
                            <motion.div
                                layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                key={admin._id}
                                className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden group hover:border-[#51b749]/50 transition-all duration-300 relative flex flex-col p-5"
                            >
                                <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => openEditModal(admin)}
                                        className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-[#51b749]/20 hover:text-[#51b749] hover:border-[#51b749]/50 transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleRemoveAdmin(admin._id, admin.name)}
                                        className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-black border border-white/10 flex-shrink-0">
                                        {admin.profilePhoto ? (
                                            <img src={admin.profilePhoto} className="w-full h-full object-cover" alt={admin.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white/10"><UserIcon size={24} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="font-bold text-lg text-white truncate">{admin.name}</h3>
                                        <div className={`text-xs inline-flex items-center gap-1 mt-1 px-2 py-1 rounded-md border ${
                                            admin.userType === 'super-admin'
                                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                                : 'bg-[#51b749]/10 border-[#51b749]/30 text-[#51b749]'
                                        }`}>
                                            {admin.userType === 'super-admin' ? <ShieldAlert size={12} /> : <Shield size={12} />}
                                            <span className="capitalize">{admin.userType.replace('-', ' ')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 text-sm text-white/50">
                                    <p className="truncate">{admin.email}</p>
                                    {admin.rollNo && <p className="font-mono mt-1 text-xs">{admin.rollNo}</p>}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="relative bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white tracking-tight">
                                    {isEditing ? 'Edit Admin Role' : 'Assign Admin Role'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitRole} className="p-6 space-y-6">
                                <div className="flex items-center gap-4 p-4 bg-black rounded-lg border border-white/5">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5">
                                        {selectedUser.profilePhoto ? <img src={selectedUser.profilePhoto} className="w-full h-full object-cover" alt="" /> : <UserIcon className="w-full h-full p-2 text-white/20" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{selectedUser.name}</p>
                                        <p className="text-xs text-white/50">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Select Role</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRole('admin')}
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                                                selectedRole === 'admin' ? 'bg-[#51b749]/20 border-[#51b749] text-white' : 'bg-black border-white/10 text-white/50 hover:border-white/30'
                                            }`}
                                        >
                                            <Shield size={24} className={selectedRole === 'admin' ? 'text-[#51b749]' : ''} />
                                            <span className="font-medium">Admin</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRole('super-admin')}
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                                                selectedRole === 'super-admin' ? 'bg-purple-500/20 border-purple-500 text-white' : 'bg-black border-white/10 text-white/50 hover:border-white/30'
                                            }`}
                                        >
                                            <ShieldAlert size={24} className={selectedRole === 'super-admin' ? 'text-purple-400' : ''} />
                                            <span className="font-medium">Super Admin</span>
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-[#51b749]/80 text-white font-medium py-3 rounded-lg hover:bg-[#38984c] transition-all">
                                    {isEditing ? 'Update Role' : 'Confirm Assignment'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(81,183,73,0.5); }
            `}</style>
        </div>
    );
};

export default AdminPage;