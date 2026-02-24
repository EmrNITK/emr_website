import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
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
            toast.error("Failed to load forms");
            setIsLoading(false);
        }
    };

    const deleteForm = async (e, id) => {
        e.preventDefault(); // Prevent navigating to the builder when clicking delete
        if (!window.confirm("Are you sure you want to delete this form?")) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: token } , withCredentials: true });
            setForms(forms.filter(f => f._id !== id));
            toast.success("Form deleted");
        } catch (error) {
            toast.error("Failed to delete form");
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-black"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">My Forms</h1>
                    <button 
                        onClick={() => navigate('/admin/form')}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
                    >
                        <Plus size={20} /> <span>Create New Form</span>
                    </button>
                </div>

                {/* Forms Grid */}
                {forms.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
                        <FileText size={48} className="mx-auto text-zinc-600 mb-4" />
                        <h3 className="text-xl font-medium text-zinc-300">No forms yet</h3>
                        <p className="text-zinc-500 mt-2">Create your first form to start collecting responses.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map(form => (
                            <Link key={form._id} to={`/admin/form/${form._id}`} className="group block bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                                
                                {/* Cover Photo Thumbnail */}
                                <div className="h-32 bg-zinc-800 relative">
                                    {form.coverPhoto ? (
                                        <img src={form.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-900/40 to-purple-900/40 flex items-center justify-center">
                                            <FileText size={32} className="text-blue-500/50" />
                                        </div>
                                    )}
                                    {/* Status Pill */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full backdrop-blur-md ${form.settings?.acceptingResponses ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                            {form.settings?.acceptingResponses ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-white truncate mb-1">{form.title || "Untitled Form"}</h3>
                                    
                                    <div className="flex items-center space-x-4 mt-4 text-xs font-medium text-zinc-500">
                                        <span className="flex items-center"><Calendar size={14} className="mr-1.5" /> Updated {new Date(form.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="h-px bg-zinc-800 my-4"></div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300 transition-colors">Edit Form &rarr;</span>
                                        <div>
                                            <Link to={'/sheets/'+form._id} className="p-2 mr-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Sheet size={18} />
                                        </Link>
                                        <button onClick={(e) => deleteForm(e, form._id)} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button></div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}