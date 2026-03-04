import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, FileText, Settings, Trash2, Users, Loader2, Calendar, Sheet } from 'lucide-react';

export default function FormDashboard() {
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/forms';

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(API_URL, { headers: { Authorization: token } , withCredentials: true});
            setForms(res.data);
            setIsLoading(false);
        } catch (error) {
            toast.error("Failed to load forms", { style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }});
            setIsLoading(false);
        }
    };

    const deleteForm = async (e, id) => {
        e.preventDefault(); 
        e.stopPropagation();
        
        if (!window.confirm("Are you sure you want to delete this form?")) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: token } , withCredentials: true });
            setForms(forms.filter(f => f._id !== id));
            toast.success("Form deleted", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
        } catch (error) {
            toast.error("Failed to delete form", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }});
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-[#51b749] w-10 h-10" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 min-h-screen relative z-10 w-full selection:bg-[#51b749]/30 selection:text-[#51b749]">
            <Toaster position="bottom-right" />

            {/* --- BACKGROUND GRID --- */}
            <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
                <div 
                    className="absolute inset-0 bg-[linear-gradient(to_right,#51b74915_1px,transparent_1px),linear-gradient(to_bottom,#51b74915_1px,transparent_1px)] bg-[size:40px_40px]"
                    style={{
                        maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)",
                        WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)"
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                
                {/* --- HEADER --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">My Forms</h1>
                        <p className="text-white/60 mt-1">Manage and track your form submissions.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/admin/form')}
                        className="flex items-center gap-2 bg-[#51b749]/80 hover:bg-[#38984c] text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={20} /> <span>Create New Form</span>
                    </button>
                </div>

                {/* --- FORMS GRID --- */}
                {forms.length === 0 ? (
                    <div className="w-full text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 mt-6">
                        <FileText size={48} className="mx-auto text-white/20 mb-4" />
                        <h3 className="text-xl font-bold text-white/60">No forms yet</h3>
                        <p className="text-white/40 mt-2">Create your first form to start collecting responses.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {forms.map(form => (
                            <div key={form._id} className="group flex flex-col bg-[#111111] border border-white/5 hover:border-[#51b749]/50 hover:shadow-[0_0_20px_-5px_rgba(81,183,73,0.3)] rounded-xl overflow-hidden transition-all duration-300">
                                
                                <Link to={`/admin/form/${form._id}`} className="block flex-1 cursor-pointer">
                                    {/* Cover Photo Thumbnail */}
                                    <div className="h-40 bg-black relative border-b border-white/5 overflow-hidden">
                                        {form.coverPhoto ? (
                                            <img src={form.coverPhoto} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-black">
                                                <FileText size={40} className="text-white/10 group-hover:text-[#51b749]/20 transition-colors duration-500" />
                                            </div>
                                        )}
                                        {/* Status Pill */}
                                        <div className="absolute top-3 left-3 z-10">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md backdrop-blur-md flex items-center gap-1.5 ${
                                                form.settings?.acceptingResponses 
                                                    ? 'bg-[#13703a]/80 text-[#51b749] border border-[#51b749]/30' 
                                                    : 'bg-red-900/80 text-red-400 border border-red-500/30'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${form.settings?.acceptingResponses ? 'bg-[#51b749] animate-pulse' : 'bg-red-400'}`}></span>
                                                {form.settings?.acceptingResponses ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-5 pb-0">
                                        <h3 className="text-lg font-bold text-white truncate mb-2 group-hover:text-[#51b749] transition-colors">
                                            {form.title || "Untitled Form"}
                                        </h3>
                                        
                                        <div className="flex items-center space-x-4 text-xs font-medium text-white/40 mb-4">
                                            <span className="flex items-center">
                                                <Calendar size={14} className="mr-1.5 text-[#51b749]" /> 
                                                {new Date(form.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </Link>

                                {/* Footer Actions */}
                                <div className="p-5 pt-4 mt-auto border-t border-white/5 flex justify-between items-center bg-white/5">
                                    <Link 
                                        to={`/admin/form/${form._id}`}
                                        className="text-sm font-medium text-[#51b749] hover:text-[#38984c] transition-colors flex items-center gap-1"
                                    >
                                        Edit Form &rarr;
                                    </Link>
                                    <div className="flex gap-1">
                                        <Link 
                                            to={'/sheets/'+form._id} 
                                            title="View Responses"
                                            className="p-2 text-white/40 hover:text-[#51b749] hover:bg-[#51b749]/10 hover:border-[#51b749]/30 border border-transparent rounded-lg transition-all"
                                        >
                                            <Sheet size={16} />
                                        </Link>
                                        <button 
                                            onClick={(e) => deleteForm(e, form._id)} 
                                            title="Delete Form"
                                            className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}