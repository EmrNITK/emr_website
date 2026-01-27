// components/ResourceManager.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import ImageUploader from './ImageUploader';

const ResourceManager = ({ title, endpoint, fields }) => {
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const fetchItems = async () => {
    try {
      // ADDED: withCredentials: true
      const res = await axios.get(`${API_URL}/${endpoint}`, {
        withCredentials: true 
      });
      setItems(res.data);
    } catch (err) { 
      console.error(err);
      toast.error("Failed to fetch data"); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        // REMOVED: { headers }
        // ADDED: { withCredentials: true }
        await axios.put(`${API_URL}/${endpoint}/${editingItem._id}`, formData, { 
          withCredentials: true 
        });
        toast.success("Updated successfully");
      } else {
        await axios.post(`${API_URL}/${endpoint}`, formData, { 
          withCredentials: true 
        });
        toast.success("Created successfully");
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
      fetchItems();
    } catch (err) { 
      console.error(err);
      toast.error("Operation failed"); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      // REMOVED: { headers }
      // ADDED: { withCredentials: true }
      await axios.delete(`${API_URL}/${endpoint}/${id}`, { 
        withCredentials: true 
      });
      toast.success("Deleted");
      fetchItems();
    } catch (err) { 
      toast.error("Delete failed"); 
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 ml-64 min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-zinc-400 mt-1">Manage your {title.toLowerCase()} content</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-200 transition-all font-semibold shadow-lg shadow-white/10">
          <Plus size={18} /> Add New
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div layout key={item._id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-zinc-700 transition-all">
            
            {/* Image Preview */}
             <div className="h-48 overflow-hidden relative">
                <img src={item.posterImg || item.image || item.src || item.logo || "https://via.placeholder.com/300"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button onClick={() => openModal(item)} className="p-2 bg-black/50 backdrop-blur rounded-full hover:bg-blue-600 text-white transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 bg-black/50 backdrop-blur rounded-full hover:bg-red-600 text-white transition-all"><Trash2 size={16} /></button>
                </div>
              </div>

            <div className="p-5">
              <h3 className="font-bold text-xl mb-1">{item.title || item.name}</h3>
              {item.subtitle && <p className="text-sm text-zinc-400 mb-2">{item.subtitle}</p>}
              
              <div className="flex flex-wrap gap-2 mt-3">
                {item.section && <span className={"text-xs px-2 py-1 rounded border border-zinc-700 text-zinc-300 "+(item.section==='upcoming'?"bg-purple-600":"bg-zinc-800")}>{item.section}</span>}
                {item.category && <span className="text-xs px-2 py-1 rounded bg-blue-900/30 border border-blue-800 text-blue-300">{item.category}</span>}
                {item.tier && <span className="text-xs px-2 py-1 rounded bg-yellow-900/30 border border-yellow-800 text-yellow-300">{item.tier}</span>}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center sticky top-0 bg-zinc-950 z-10">
                <h3 className="text-xl font-bold">{editingItem ? 'Edit' : 'Create'} {title}</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="text-zinc-400 hover:text-white" /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-1">
                    {field.type === 'image' ? (
                      <ImageUploader
                        currentImage={formData[field.name]}
                        onUpload={(url) => setFormData({ ...formData, [field.name]: url })}
                      />
                    ) : field.type === 'textarea' ? (
                      <>
                        <label className="text-xs font-semibold text-zinc-400 uppercase">{field.label}</label>
                        <textarea
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none min-h-[100px] text-white"
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        />
                      </>
                    ) : field.type === 'nested' ? (
                      <div className="p-4 border border-zinc-800 rounded-lg space-y-3">
                        <p className="text-sm font-bold text-zinc-300">{field.label}</p>
                        {field.subFields.map(sub => (
                          <input
                            key={sub}
                            placeholder={sub}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-white"
                            value={formData[field.name]?.[sub] || ''}
                            onChange={(e) => setFormData({
                              ...formData,
                              [field.name]: { ...formData[field.name], [sub]: e.target.value }
                            })}
                          />
                        ))}
                      </div>
                    ) : field.type === 'select' ? (
                      <>
                        <label className="text-xs font-semibold text-zinc-400 uppercase">{field.label}</label>
                        <div className="relative">
                          <select
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer"
                            value={formData[field.name] || ''}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          >
                            <option value="" disabled>Select an option</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <label className="text-xs font-semibold text-zinc-400 uppercase">{field.label}</label>
                        <input
                          type={field.type || 'text'}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 focus:border-blue-500 focus:outline-none text-white"
                          value={formData[field.name] || ''}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        />
                      </>
                    )}
                  </div>
                ))}

                <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all mt-4">
                  Save Changes
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceManager;