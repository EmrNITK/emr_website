import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Link as LinkIcon, Lock, Unlock, UploadCloud, Loader2, Code2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
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
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';
  
  const fields = [
    { name: 'title', label: 'Title', type: 'text', placeholder: 'Project Name' },
    { name: 'slug', label: 'Project URL (Slug)', type: 'slug', placeholder: 'project-url-slug' },
    { name: 'status', label: 'Status', type: 'select', options: ['ongoing', 'completed'] },
    // Removed image from here to handle manually, removed description to handle manually
    { name: 'githubLink', label: 'GitHub Link', type: 'text' },
    { name: 'demoLink', label: 'Demo Link', type: 'text' }
  ];

  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [isEditorUploading, setIsEditorUploading] = useState(false);
  
  // NEW: State for the Tech Stack input field
  const [techInput, setTechInput] = useState("");

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/${endpoint}`, { withCredentials: true });
      setItems(res.data);
    } catch (err) { toast.error("Failed to fetch data"); }
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

  // --- NEW: Tech Stack Handlers ---
  const handleAddTech = () => {
    if (!techInput.trim()) return;
    const currentStack = formData.techStack || [];
    // Prevent duplicates
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
  // -------------------------------

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
      toast.error("Image upload failed");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API_URL}/${endpoint}/${editingItem._id}`, formData, { headers,
          withCredentials: true  });
        toast.success("Updated successfully");
      } else {
        await axios.post(`${API_URL}/${endpoint}`, formData, { headers ,
          withCredentials: true });
        toast.success("Created successfully");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
      setTechInput(""); // Clear tech input
      fetchItems();
    } catch (err) { toast.error("Operation failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers ,
          withCredentials: true });
      toast.success("Deleted");
      fetchItems();
    } catch (err) { toast.error("Delete failed"); }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    // Initialize techStack as empty array if creating new or if existing item has none
    setFormData(item || { status: 'ongoing', techStack: [] });
    setTechInput("");
    setIsSlugLocked(!item);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 ml-64 min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-white">{title}</h2>
          <p className="text-zinc-400 mt-2">Manage your projects content</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-all font-bold shadow-lg">
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div layout key={item._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-600 transition-all shadow-xl flex flex-col">
             <div className="h-52 overflow-hidden relative bg-zinc-950">
               <img src={item.image || item.posterImg} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt="" />
               <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => openModal(item)} className="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white hover:text-black transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 bg-red-500/10 backdrop-blur rounded-full hover:bg-red-600 text-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
               </div>
             </div>
             <div className="p-5 flex flex-col flex-1">
               <h3 className="font-bold text-xl text-white">{item.title}</h3>
               {item.slug && <div className="text-xs text-zinc-500 font-mono mt-1 mb-3">/p/{item.slug}</div>}
               
               {/* Tech Stack Preview in Card */}
               {item.techStack && item.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.techStack.slice(0, 3).map(tech => (
                      <span key={tech} className="text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-zinc-300">
                        {tech}
                      </span>
                    ))}
                    {item.techStack.length > 3 && <span className="text-[10px] text-zinc-500">+{item.techStack.length - 3}</span>}
                  </div>
               )}

               <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-800/50">
                 <span className={`text-xs font-bold px-2 py-1 rounded border ${item.status === 'completed' ? "bg-green-900/30 border-green-800 text-green-400" : "bg-amber-900/30 border-amber-800 text-amber-400"}`}>
                   {item.status ? item.status.toUpperCase() : 'ONGOING'}
                 </span>
               </div>
             </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
              
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-950/95 backdrop-blur z-20">
                <h3 className="text-xl font-bold text-white">{editingItem ? 'Edit Project' : 'New Project'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-400 hover:text-white" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Render Standard Fields */}
                    {fields.map((field) => (
                      <div key={field.name} className={`${field.type === 'slug' || field.name === 'title' ? 'col-span-1' : ''} space-y-2`}>
                        <label className="text-xs font-bold text-zinc-500 uppercase">{field.label}</label>
                        {field.type === 'select' ? (
                          <div className="relative">
                            <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 appearance-none focus:border-blue-500 focus:outline-none text-white"
                              value={formData[field.name] || ''} onChange={(e) => handleInputChange(field.name, e.target.value)}>
                              <option value="" disabled>Select Status</option>
                              {field.options.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-500">▼</div>
                          </div>
                        ) : field.type === 'slug' ? (
                          <div className="flex gap-2">
                             <div className="relative flex-1">
                                <span className="absolute inset-y-0 left-3 flex items-center text-zinc-500 font-mono text-sm">/p/</span>
                                <input type="text" readOnly={isSlugLocked} className={`w-full bg-zinc-900 border ${isSlugLocked ? 'border-zinc-800 text-zinc-500' : 'border-blue-900 text-white'} rounded-lg p-3 pl-9 font-mono text-sm focus:outline-none`}
                                  required value={formData[field.name] || ''} onChange={(e) => handleInputChange(field.name, e.target.value)} />
                             </div>
                             <button type="button" onClick={() => setIsSlugLocked(!isSlugLocked)} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white">
                                {isSlugLocked ? <Lock size={18}/> : <Unlock size={18}/>}
                             </button>
                          </div>
                        ) : (
                          <input type="text" placeholder={field.placeholder} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                            value={formData[field.name] || ''} onChange={(e) => handleInputChange(field.name, e.target.value)} />
                        )}
                      </div>
                    ))}

                    {/* --- NEW: Tech Stack Input Section --- */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                          <Code2 size={12} /> Tech Stack
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            onKeyDown={handleTechKeyDown}
                            placeholder="Type tech (e.g. React) and press Enter" 
                            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                          />
                          <button type="button" onClick={handleAddTech} className="px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white font-medium transition-colors">
                            Add
                          </button>
                        </div>
                        
                        {/* Tags Display Area */}
                        <div className="flex flex-wrap gap-2 mt-3 min-h-[40px] p-2 border border-dashed border-zinc-800 rounded-lg bg-zinc-900/50">
                           {(!formData.techStack || formData.techStack.length === 0) && (
                              <span className="text-zinc-600 text-sm py-1 px-2 italic">No technologies added yet.</span>
                           )}
                           {formData.techStack && formData.techStack.map((tech, index) => (
                              <span key={index} className="inline-flex items-center gap-1 bg-blue-900/20 border border-blue-800 text-blue-300 px-3 py-1 rounded-full text-sm">
                                {tech}
                                <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:text-white transition-colors">
                                  <X size={14} />
                                </button>
                              </span>
                           ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-zinc-500 uppercase">Cover Image</label>
                   <ImageUploader currentImage={formData.image} onUpload={(url) => setFormData({...formData, image: url})} />
                </div>

                {/* Markdown Editor */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-zinc-500 uppercase">Project Blog</label>
                    {isEditorUploading && <span className="flex items-center gap-2 text-xs text-blue-400 animate-pulse"><Loader2 size={12} className="animate-spin"/> Uploading image...</span>}
                  </div>
                  <div className="border border-zinc-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-600/50 transition-all">
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

                <div className="flex justify-end pt-6 border-t border-zinc-800 gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-semibold text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 shadow-lg flex items-center gap-2">
                     <UploadCloud size={20} /> {editingItem ? 'Update' : 'Publish'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DARK MODE OVERRIDES FOR MARKDOWN EDITOR --- */}
      <style jsx global>{`
        /* Main Container */
        .rc-md-editor { 
            background-color: #09090b !important; 
            border: none !important; 
            color: #fff !important;
        }
        
        /* Toolbar */
        .rc-md-editor .rc-md-navigation { 
            background-color: #18181b !important; 
            border-bottom: 1px solid #27272a !important; 
        }
        .rc-md-editor .rc-md-navigation .button-wrap .button {
            color: #a1a1aa !important; 
        }
        .rc-md-editor .rc-md-navigation .button-wrap .button:hover {
            color: #fff !important;
            background-color: #27272a !important;
        }

        /* Editing Area */
        .rc-md-editor .editor-container .section { 
            background-color: #09090b !important; 
        }
        .rc-md-editor .section-container .input { 
            color: #e4e4e7 !important; 
            background-color: #09090b !important; 
            font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
            line-height: 1.6;
        }

        /* Preview Area */
        .rc-md-editor .custom-html-style {
            padding: 20px;
            color: #d4d4d8; 
        }
        .rc-md-editor .custom-html-style h1, 
        .rc-md-editor .custom-html-style h2, 
        .rc-md-editor .custom-html-style h3 {
            color: #fff;
            border-bottom: 1px solid #27272a;
            padding-bottom: 0.5rem;
        }
        .rc-md-editor .custom-html-style a { color: #60a5fa; text-decoration: underline; }
        .rc-md-editor .custom-html-style code { background-color: #27272a; padding: 2px 4px; rounded: 4px; color: #f472b6; }
        .rc-md-editor .custom-html-style pre { background-color: #18181b; padding: 10px; border-radius: 8px; border: 1px solid #27272a; }
        .rc-md-editor .custom-html-style blockquote { border-left: 4px solid #3f3f46; padding-left: 1rem; color: #a1a1aa; }

        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #09090b; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
};

export default Projects;