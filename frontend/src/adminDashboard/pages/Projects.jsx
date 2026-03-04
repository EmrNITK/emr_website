import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Link as LinkIcon, Lock, Unlock, UploadCloud, Loader2, Code2 } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader'; 

// Markdown Imports
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

// Initialize Markdown Parser
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const Projects = () => {
  // Configuration
  const title = "Projects";
  const endpoint = "projects"; 
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
  
  const fields = [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Project Name' },
    { name: 'slug', label: 'Project URL (Slug)', type: 'slug', placeholder: 'project-url-slug' },
    { name: 'status', label: 'Status', type: 'select', options: ['ongoing', 'completed'] },
    { name: 'githubLink', label: 'GitHub Link', type: 'text', placeholder: 'https://github.com/...' },
    { name: 'demoLink', label: 'Demo Link', type: 'text', placeholder: 'https://...' }
  ];

  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [isEditorUploading, setIsEditorUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State for the Tech Stack input field
  const [techInput, setTechInput] = useState("");

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // Reusable input class
  const inputClass = "w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-[#51b749] focus:ring-1 focus:ring-[#51b749] outline-none transition-all placeholder:text-white/20";

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/${endpoint}`, { withCredentials: true });
      setItems(res.data);
    } catch (err) { 
      toast.error("Failed to fetch data", { style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }});
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };

  const handleInputChange = (field, value) => {
    let newData = { ...formData, [field]: value };
    if (field === 'title' && !editingItem && isSlugLocked) newData['slug'] = generateSlug(value);
    if (field === 'slug') newData['slug'] = generateSlug(value);
    setFormData(newData);
  };

  // --- Tech Stack Handlers ---
  const handleAddTech = () => {
    if (!techInput.trim()) return;
    const currentStack = formData.techStack || [];
    if (!currentStack.includes(techInput.trim())) {
      setFormData({ ...formData, techStack: [...currentStack, techInput.trim()] });
    }
    setTechInput("");
  };

  const handleRemoveTech = (techToRemove) => {
    const currentStack = formData.techStack || [];
    setFormData({ 
      ...formData, 
      techStack: currentStack.filter(t => t !== techToRemove) 
    });
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech();
    }
  };

  const handleEditorImageUpload = async (file) => {
    setIsEditorUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/upload`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: token }, 
        withCredentials: true
      });
      setIsEditorUploading(false);
      return res.data.url; 
    } catch (err) {
      console.error(err);
      setIsEditorUploading(false);
      toast.error("Image upload failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }});
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API_URL}/${endpoint}/${editingItem._id}`, formData, { headers, withCredentials: true });
        toast.success("Updated successfully", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      } else {
        await axios.post(`${API_URL}/${endpoint}`, formData, { headers, withCredentials: true });
        toast.success("Created successfully", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
      setTechInput(""); 
      fetchItems();
    } catch (err) { 
      toast.error("Operation failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers, withCredentials: true });
      toast.success("Deleted", { style: { background: '#111', color: '#fff', border: '1px solid rgba(81,183,73,0.3)' }});
      fetchItems();
    } catch (err) { 
      toast.error("Delete failed", { style: { background: '#111', color: '#fff', border: '1px solid rgba(239,68,68,0.3)' }}); 
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || { status: 'ongoing', techStack: [] });
    setTechInput("");
    setIsSlugLocked(!item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 min-h-screen relative z-10 w-full">
      <Toaster position="bottom-right" />

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 border-b border-white/10 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
          <p className="text-white/60 mt-1">Manage your projects content</p>
        </div>
        <button 
          onClick={() => openModal()} 
          className="flex items-center gap-2 bg-[#51b749]/80 hover:bg-[#38984c] text-white px-5 py-2.5 rounded-lg font-medium shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-white/40 gap-2">
            <Loader2 className="animate-spin text-[#51b749]" /> Loading projects...
        </div>
      ) : items.length === 0 ? (
        <div className="w-full text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5 mt-6">
            <Code2 className="mx-auto text-white/20 mb-4" size={48}/>
            <h3 className="text-xl font-bold text-white/60">No projects found</h3>
            <p className="text-white/40 mt-2">Click "Add Project" to create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => (
            <motion.div 
              layout 
              key={item._id} 
              className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden hover:border-[#51b749]/50 hover:shadow-[0_0_20px_-5px_rgba(81,183,73,0.3)] transition-all duration-300 flex flex-col group"
            >
               <div className="h-52 overflow-hidden relative bg-black border-b border-white/5">
                 <img src={item.image || item.posterImg} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={item.title} />
                 <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button onClick={() => openModal(item)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-[#51b749]/20 hover:text-[#51b749] hover:border-[#51b749]/50 transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all"><Trash2 size={16} /></button>
                 </div>
               </div>
               <div className="p-5 flex flex-col flex-1">
                 <h3 className="font-bold text-xl text-white group-hover:text-[#51b749] transition-colors">{item.title}</h3>
                 {item.slug && <div className="text-xs text-white/40 font-mono mt-1 mb-4">/p/{item.slug}</div>}
                 
                 {/* Tech Stack Preview in Card */}
                 {item.techStack && item.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.techStack.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[10px] font-medium bg-black border border-white/10 px-2 py-1 rounded-md text-white/60">
                          {tech}
                        </span>
                      ))}
                      {item.techStack.length > 3 && <span className="text-[10px] text-white/40 flex items-center">+{item.techStack.length - 3}</span>}
                    </div>
                 )}

                 <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                   <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border tracking-wider ${item.status === 'completed' ? "bg-white/5 border-white/10 text-white/40" : "bg-[#13703a]/20 border-[#51b749]/30 text-[#51b749]"}`}>
                     {item.status ? item.status.toUpperCase() : 'ONGOING'}
                   </span>
                 </div>
               </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* --- MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.8)] custom-scrollbar flex flex-col"
            >
              
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111111] z-20">
                <h3 className="text-xl font-bold text-white tracking-tight">{editingItem ? 'Edit Project' : 'New Project'}</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Render Standard Fields */}
                    {fields.map((field) => (
                      <div key={field.name} className={`${field.type === 'slug' || field.name === 'title' ? 'col-span-1' : ''} space-y-2`}>
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">{field.label}</label>
                        {field.type === 'select' ? (
                          <div className="relative">
                            <select 
                              className={`${inputClass} appearance-none cursor-pointer`}
                              value={formData[field.name] || ''} 
                              onChange={(e) => handleInputChange(field.name, e.target.value)}
                            >
                              <option value="" disabled className="bg-black text-white/50">Select Status</option>
                              {field.options.map(opt => <option key={opt} value={opt} className="bg-black text-white">{opt.toUpperCase()}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white/40">▼</div>
                          </div>
                        ) : field.type === 'slug' ? (
                          <div className="flex gap-2">
                             <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-3 flex items-center text-white/40 font-mono text-sm">/p/</span>
                                <input 
                                  type="text" 
                                  readOnly={isSlugLocked} 
                                  className={`w-full bg-black border ${isSlugLocked ? 'border-white/5 text-white/40' : 'border-[#51b749]/50 text-white focus:ring-1 focus:ring-[#51b749]'} rounded-lg p-3 pl-10 font-mono text-sm outline-none transition-all`}
                                  required 
                                  value={formData[field.name] || ''} 
                                  onChange={(e) => handleInputChange(field.name, e.target.value)} 
                                />
                             </div>
                             <button 
                                type="button" 
                                onClick={() => setIsSlugLocked(!isSlugLocked)} 
                                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
                             >
                                {isSlugLocked ? <Lock size={18}/> : <Unlock size={18}/>}
                             </button>
                          </div>
                        ) : (
                          <input 
                            type="text" 
                            placeholder={field.placeholder} 
                            className={inputClass}
                            value={formData[field.name] || ''} 
                            onChange={(e) => handleInputChange(field.name, e.target.value)} 
                          />
                        )}
                      </div>
                    ))}

                    {/* --- NEW: Tech Stack Input Section --- */}
                    <div className="col-span-1 md:col-span-2 space-y-2 pt-2 border-t border-white/5">
                        <label className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2 mt-4">
                          <Code2 size={14} className="text-[#51b749]" /> Tech Stack
                        </label>
                        <div className="flex gap-3">
                          <input 
                            type="text" 
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={handleTechKeyDown}
                            placeholder="Type tech (e.g. React) and press Enter" 
                            className={`${inputClass} flex-1`}
                          />
                          <button 
                            type="button" 
                            onClick={handleAddTech} 
                            className="px-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        
                        {/* Tags Display Area */}
                        <div className="flex flex-wrap gap-2 mt-3 min-h-[44px] p-3 border border-dashed border-white/10 rounded-lg bg-black">
                           {(!formData.techStack || formData.techStack.length === 0) && (
                              <span className="text-white/30 text-sm italic">No technologies added yet.</span>
                           )}
                           {formData.techStack && formData.techStack.map((tech, index) => (
                              <span key={index} className="inline-flex items-center gap-1.5 bg-[#13703a]/20 border border-[#51b749]/30 text-[#51b749] px-3 py-1 rounded-full text-sm font-medium">
                                {tech}
                                <button type="button" onClick={() => handleRemoveTech(tech)} className="text-[#51b749]/70 hover:text-[#51b749] transition-colors">
                                  <X size={14} />
                                </button>
                              </span>
                           ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Cover Image</label>
                   <ImageUploader 
                     currentMedia={formData.image} 
                     mediaType={'image'} 
                     onUpload={(url) => setFormData({ ...formData, image: url })} 
                   />
                </div>

                {/* Markdown Editor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Project Blog / Details</label>
                    {isEditorUploading && <span className="flex items-center gap-2 text-xs text-[#51b749] animate-pulse"><Loader2 size={12} className="animate-spin"/> Uploading image...</span>}
                  </div>
                  <div className="border border-white/10 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#51b749] focus-within:border-[#51b749] transition-all">
                    <MdEditor 
                      style={{ height: '500px' }} 
                      renderHTML={text => mdParser.render(text)}
                      value={formData.description || ''}
                      onChange={({ text }) => setFormData({ ...formData, description: text })}
                      onImageUpload={handleEditorImageUpload} 
                      view={{ menu: true, md: true, html: false }}
                      placeholder="Write your blog here... Drag & drop images directly onto this area."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/10 gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-6 py-2.5 rounded-lg text-white/50 hover:bg-white/5 hover:text-white font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-2.5 bg-[#51b749]/80 text-white font-medium rounded-lg hover:bg-[#38984c] shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)] transition-all active:scale-95 flex items-center gap-2"
                  >
                     <UploadCloud size={18} /> {editingItem ? 'Update Project' : 'Publish Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DARK MODE OVERRIDES FOR MARKDOWN EDITOR & SCROLLBAR --- */}
      <style jsx global>{`
        /* Main Container */
        .rc-md-editor { 
            background-color: #111111 !important; 
            border: none !important; 
            color: #fff !important;
        }
        
        /* Toolbar */
        .rc-md-editor .rc-md-navigation { 
            background-color: rgba(255,255,255,0.03) !important; 
            border-bottom: 1px solid rgba(255,255,255,0.05) !important; 
        }
        .rc-md-editor .rc-md-navigation .button-wrap .button {
            color: rgba(255,255,255,0.4) !important; 
        }
        .rc-md-editor .rc-md-navigation .button-wrap .button:hover {
            color: #51b749 !important;
            background-color: rgba(81,183,73,0.1) !important;
            border-radius: 4px;
        }

        /* Editing Area */
        .rc-md-editor .editor-container .section { 
            background-color: #000000 !important; 
        }
        .rc-md-editor .section-container .input { 
            color: rgba(255,255,255,0.9) !important; 
            background-color: #000000 !important; 
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            line-height: 1.6;
            padding: 16px !important;
        }

        /* Preview Area */
        .rc-md-editor .custom-html-style {
            padding: 20px;
            color: rgba(255,255,255,0.8); 
        }
        .rc-md-editor .custom-html-style h1, 
        .rc-md-editor .custom-html-style h2, 
        .rc-md-editor .custom-html-style h3 {
            color: #fff;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            padding-bottom: 0.5rem;
        }
        .rc-md-editor .custom-html-style a { color: #51b749; text-decoration: underline; }
        .rc-md-editor .custom-html-style code { background-color: rgba(255,255,255,0.05); padding: 2px 4px; border-radius: 4px; color: #51b749; }
        .rc-md-editor .custom-html-style pre { background-color: #000000; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
        .rc-md-editor .custom-html-style blockquote { border-left: 4px solid #51b749; padding-left: 1rem; color: rgba(255,255,255,0.5); }

        /* Custom Scrollbar for Modal */
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(81,183,73,0.5); }
      `}</style>
    </div>
  );
};

export default Projects;