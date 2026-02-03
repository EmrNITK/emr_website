import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Link as LinkIcon, Calendar, Trophy, ScrollText } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader'; // Ensure this path is correct

const Events = () => {
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';
  const title = "Events";
  const endpoint = "events";

  // --- CONFIGURATION ---
  const fields = [
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'tagline', label: 'Tagline', type: 'text' },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select', 
      options: ['upcoming', 'LIVE', 'completed'] 
    },

    { name: 'targetDate', label: 'Event Date & Time', type: 'datetime-local' },
    { name: 'posterUrl', label: 'Poster Image', type: 'image' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'regLink', label: 'Registration Link', type: 'text' },
    { name: 'rulebooklink', label: 'Rulebook Link', type: 'text' },
    
    // New Dynamic List Types
    { name: 'rules', label: 'Rules List', type: 'array-string' },
    { name: 'prizes', label: 'Prizes List', type: 'array-string' },
  ];

  // --- STATE ---
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem('token');
  const headers = { Authorization: token };

  // --- FETCHING ---
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/${endpoint}`, { withCredentials: true });
      setItems(res.data);
    } catch (err) { toast.error("Failed to fetch data"); }
  };

  // --- FORM HANDLERS ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API_URL}/${endpoint}/${editingItem._id}`, formData, { headers,
          withCredentials: true 
         });
        toast.success("Updated successfully");
      } else {
        await axios.post(`${API_URL}/${endpoint}`, formData, { headers ,
          withCredentials: true });
        toast.success("Created successfully");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
      fetchItems();
    } catch (err) { toast.error("Operation failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${endpoint}/${id}`, { headers,
          withCredentials: true  });
      toast.success("Deleted");
      fetchItems();
    } catch (err) { toast.error("Delete failed"); }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    
    // Initialize empty arrays for dynamic fields if they don't exist
    const initialData = item || {};
    if (!initialData.rules) initialData.rules = [];
    if (!initialData.prizes) initialData.prizes = [];
    
    setFormData(initialData);
    setIsModalOpen(true);
  };

  // --- DYNAMIC ARRAY HELPERS ---
  const handleArrayChange = (fieldName, index, value) => {
    const updatedArray = [...(formData[fieldName] || [])];
    updatedArray[index] = value;
    setFormData({ ...formData, [fieldName]: updatedArray });
  };

  const addArrayItem = (fieldName) => {
    setFormData({ 
      ...formData, 
      [fieldName]: [...(formData[fieldName] || []), ""] 
    });
  };

  const removeArrayItem = (fieldName, index) => {
    const updatedArray = [...(formData[fieldName] || [])];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [fieldName]: updatedArray });
  };

  return (
    <div className="p-8 ml-64 min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-zinc-400 mt-1">Manage your {title.toLowerCase()}</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-all font-semibold shadow-lg shadow-white/10">
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div layout key={item._id || item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-600 transition-all relative">
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3 z-10">
               <span className={`text-xs font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide
                 ${item.status === 'LIVE' ? 'bg-red-600 text-white animate-pulse' : 
                   item.status === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-zinc-700 text-zinc-300'}`}>
                 {item.status}
               </span>
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(item)} className="p-2 bg-black/60 backdrop-blur rounded-full hover:bg-blue-600 text-white"><Edit2 size={16} /></button>
              <button onClick={() => handleDelete(item._id || item.id)} className="p-2 bg-black/60 backdrop-blur rounded-full hover:bg-red-600 text-white"><Trash2 size={16} /></button>
            </div>

            {/* Poster */}
            <div className="h-48 overflow-hidden bg-zinc-800">
              {item.posterUrl ? (
                <img src={item.posterUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600"><Calendar size={40} /></div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-xl mb-1 text-white leading-tight">{item.title}</h3>
              <p className="text-blue-400 text-sm font-medium mb-3">{item.tagline}</p>
              
              <div className="text-zinc-400 text-xs space-y-2 mb-4">
                 <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {item.targetDate ? new Date(item.targetDate).toLocaleString() : 'Date TBA'}
                 </div>
                 {item.prizes && item.prizes.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-yellow-500"/>
                        <span>{item.prizes[0]}</span>
                    </div>
                 )}
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800">
                 {item.regLink && <a href={item.regLink} target="_blank" className="text-xs bg-white text-black px-3 py-1.5 rounded font-bold hover:bg-zinc-200">Register</a>}
                 {item.rulebooklink && <a href={item.rulebooklink} target="_blank" className="text-xs border border-zinc-600 text-zinc-300 px-3 py-1.5 rounded hover:bg-zinc-800 flex items-center gap-1"><ScrollText size={12}/> Rules</a>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-blue-900/10"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-950 z-20">
                <h3 className="text-xl font-bold text-white">{editingItem ? 'Edit Event' : 'Create Event'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-400 hover:text-white" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    
                    {/* 1. Image Handler */}
                    {field.type === 'image' ? (
                      <ImageUploader
                        currentImage={formData[field.name]}
                        width={800}
                        onUpload={(url) => setFormData({ ...formData, [field.name]: url })}
                      />
                    
                    /* 2. Textarea Handler */
                    ) : field.type === 'textarea' ? (
                      <>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{field.label}</label>
                        <textarea
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none min-h-[100px]"
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        />
                      </>

                    /* 3. Array String Handler (Rules & Prizes) */
                    ) : field.type === 'array-string' ? (
                      <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-3">
                         <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{field.label}</label>
                            <button type="button" onClick={() => addArrayItem(field.name)} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300">
                               <Plus size={14}/> Add Line
                            </button>
                         </div>
                         {(formData[field.name] || []).map((item, idx) => (
                             <div key={idx} className="flex gap-2">
                                <input 
                                  className="flex-1 bg-black border border-zinc-700 rounded-lg p-2 text-sm text-white focus:border-blue-500 outline-none"
                                  value={item}
                                  placeholder={`Add ${field.label.slice(0, -5)}...`}
                                  onChange={(e) => handleArrayChange(field.name, idx, e.target.value)}
                                />
                                <button type="button" onClick={() => removeArrayItem(field.name, idx)} className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors">
                                   <Trash2 size={16} />
                                </button>
                             </div>
                         ))}
                         {(formData[field.name] || []).length === 0 && (
                            <p className="text-xs text-zinc-600 italic text-center py-2">No items added yet.</p>
                         )}
                      </div>

                    /* 4. Select Dropdown */
                    ) : field.type === 'select' ? (
                      <>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{field.label}</label>
                        <div className="relative">
                          <select
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                            value={formData[field.name] || ''}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          >
                            <option value="" disabled>Select Status</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt} className="bg-zinc-900">
                                {opt.toUpperCase()}
                              </option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-zinc-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </>

                    /* 5. Default Input (Text, Date, Link) */
                    ) : (
                      <>
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{field.label}</label>
                        <input
                          type={field.type || 'text'}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        />
                      </>
                    )}
                  </div>
                ))}

                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all mt-6 shadow-lg shadow-blue-900/20">
                  {editingItem ? 'Save Changes' : 'Create Event'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;