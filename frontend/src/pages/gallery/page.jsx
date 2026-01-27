import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { 
  Search, Filter, X, ChevronLeft, ChevronRight, 
  Loader2, Layers, Calendar, ZoomIn, Download, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

// --- UTILITY COMPONENTS ---

const FilterPill = ({ children, active, onClick, icon: Icon }) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border
      ${active 
        ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105" 
        : "bg-zinc-900/50 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300"
      }
    `}
  >
    {Icon && <Icon size={12} />}
    {children}
  </button>
);

const GalleryCard = React.forwardRef(({ item, onOpen, index }, ref) => (
  <motion.div 
    ref={ref}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "100px" }}
    transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
    className="break-inside-avoid mb-6 group relative rounded-xl overflow-hidden bg-zinc-900 border border-white/5 cursor-zoom-in"
    onClick={() => onOpen(item)}
  >
    {/* Image Container */}
    <div className="relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-zinc-800 animate-pulse" /> {/* Placeholder */}
      <img 
        src={item.src} 
        alt={item.title} 
        loading="lazy"
        className="relative z-10 w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:contrast-110"
      />
      
      {/* Overlay - Desktop */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-cyan-400 text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            {item.category}
          </p>
          <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
        </div>
      </div>

      {/* Mobile Icon Hint */}
      <div className="absolute top-3 right-3 z-20 md:hidden bg-black/50 backdrop-blur rounded-full p-2">
        <ZoomIn size={14} className="text-white" />
      </div>
    </div>
  </motion.div>
));

// --- PROFESSIONAL LIGHTBOX ---

const Lightbox = ({ items, currentId, onClose, onChangeItem, hasMore, onLoadMore, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentIndex = items.findIndex(i => i._id === currentId);
  const item = items[currentIndex];

  // Reset expand on slide change
  useEffect(() => { setIsExpanded(false); }, [currentId]);

  // Infinite Scroll Trigger inside Lightbox
  useEffect(() => {
    if (currentIndex >= items.length - 2 && hasMore && !loading) {
      onLoadMore();
    }
  }, [currentIndex, items.length, hasMore, loading, onLoadMore]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && (currentIndex < items.length - 1 || hasMore)) {
         if (currentIndex < items.length - 1) onChangeItem(items[currentIndex + 1]._id);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) onChangeItem(items[currentIndex - 1]._id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items, onClose, onChangeItem, hasMore]);

  if (!item) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center overflow-hidden"
    >
      {/* --- Main Image Area --- */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-10" onClick={onClose}>
        <motion.img 
          key={item._id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          src={item.src} 
          alt={item.title} 
          onClick={(e) => e.stopPropagation()}
          className={`max-w-full max-h-[85vh] object-contain shadow-2xl shadow-black ${isExpanded ? 'blur-sm grayscale opacity-50' : ''}`} 
        />
      </div>

      {/* --- Controls --- */}
      
      {/* Close */}
      <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/5">
        <X size={24} />
      </button>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button 
          onClick={(e) => { e.stopPropagation(); onChangeItem(items[currentIndex - 1]._id); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-white/10 text-white/50 hover:text-white backdrop-blur border border-white/5 transition-all z-40 flex"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {(currentIndex < items.length - 1 || hasMore) && (
        <button 
          disabled={currentIndex === items.length - 1 && loading}
          onClick={(e) => { 
            e.stopPropagation(); 
            if (currentIndex < items.length - 1) onChangeItem(items[currentIndex + 1]._id); 
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-black/20 hover:bg-white/10 text-white/50 hover:text-white backdrop-blur border border-white/5 transition-all z-40 flex"
        >
          {currentIndex === items.length - 1 && loading ? (
             <Loader2 size={32} className="animate-spin text-cyan-400" />
          ) : (
             <ChevronRight size={32} />
          )}
        </button>
      )}

      {/* --- Info Bar (Bottom) --- */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pt-24 pb-8 px-6 md:px-12 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row  gap-6 pointer-events-auto">
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
               <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white text-black">
                 {item.year}
               </span>
               <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-zinc-400 border border-zinc-700">
                 {item.category}
               </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{item.title}</h2>
            
            <div className="relative max-w-2xl">
                <p className={`text-zinc-400 text-sm md:text-base leading-relaxed transition-all ${isExpanded ? '' : 'line-clamp-2'}`}>
                  {item.description || "No description provided for this entry."}
                </p>
                {item.description && item.description.length > 120 && (
                   <button onClick={() => setIsExpanded(!isExpanded)} className="text-cyan-400 text-xs font-bold uppercase tracking-widest mt-2 hover:underline">
                     {isExpanded ? "Collapse" : "Read Full Story"}
                   </button>
                )}
            </div>
          </div>

          <div className="flex gap-4">
             <button className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                <Share2 size={20} />
             </button>
             <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-zinc-200 transition-all">
                <Download size={18} /> Download
             </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---

const GalleryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [options, setOptions] = useState({ categories: [], years: [] });
  const [filters, setFilters] = useState({ category: '', year: '', search: '' });
  const [selectedItemId, setSelectedItemId] = useState(null);
  
  // Observer for infinite scroll on the main grid
  const observer = useRef();
  const lastItemRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Initial Fetch & Options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${API_URL}/options`);
        setOptions({
          categories: res.data.categories.map(c => c.value),
          years: res.data.years.map(y => y.value)
        });
      } catch (err) { console.error("Options error", err); }
    };
    fetchOptions();
  }, []);

  // Data Fetching
  useEffect(() => {
    if (page === 1) setItems([]);

    const fetchGallery = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/gallery`, { 
          params: { page, limit: 12, ...filters } 
        });
        
        setItems(prev => page === 1 ? res.data.data : [...prev, ...res.data.data]);
        setHasMore(res.data.data.length === 12); 
      } catch (err) {
        console.error("Gallery fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce filter changes slightly to prevent rapid API calls
    const timeout = setTimeout(() => fetchGallery(), 300);
    return () => clearTimeout(timeout);
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) setPage(prev => prev + 1);
  }, [loading, hasMore]);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 pt-20">
      
     
      {/* --- Header / Filters --- */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Logo & Search */}
            <div className="flex items-center gap-6 w-full md:w-auto">
               <div className="text-xl font-bold tracking-tighter text-white">
                  EMR<span className="text-zinc-600">GALLERY</span>
               </div>
               
               <div className="flex-1 md:w-80 relative group">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
                    placeholder="Search memories..."
                    value={filters.search}
                    onChange={e => handleFilterChange('search', e.target.value)}
                  />
               </div>
            </div>

          </div>

          {/* Filter Pills Row */}
          <div className="flex flex-col md:flex-row gap-4 mt-4 overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center gap-2">
               <span className="text-zinc-600 mr-2"><Layers size={14}/></span>
               <FilterPill active={filters.category === ''} onClick={() => handleFilterChange('category', '')}>All</FilterPill>
               {options.categories.map(cat => (
                 <FilterPill key={cat} active={filters.category === cat} onClick={() => handleFilterChange('category', cat)}>{cat}</FilterPill>
               ))}
            </div>
            <div className="w-px h-6 bg-zinc-800 hidden md:block mx-2"></div>
            <div className="flex items-center gap-2">
               <span className="text-zinc-600 mr-2"><Calendar size={14}/></span>
               <FilterPill active={filters.year === ''} onClick={() => handleFilterChange('year', '')}>All</FilterPill>
               {options.years.map(yr => (
                 <FilterPill key={yr} active={filters.year === yr} onClick={() => handleFilterChange('year', yr)}>{yr}</FilterPill>
               ))}
            </div>
          </div>
        </div>
      </header>

      {/* --- Gallery Grid --- */}
      <main className="relative z-10 px-4 md:px-8 max-w-[1600px] mx-auto py-8">
        
        {items.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-6 space-y-6">
            {items.map((item, index) => {
              if (items.length === index + 1) {
                return <GalleryCard ref={lastItemRef} key={item._id} item={item} index={index} onOpen={() => setSelectedItemId(item._id)} />;
              }
              return <GalleryCard key={item._id} item={item} index={index} onOpen={() => setSelectedItemId(item._id)} />;
            })}
          </div>
        ) : !loading && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-zinc-500 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
               <Filter size={24} className="opacity-50"/>
            </div>
            <h3 className="text-white font-bold text-lg">No photos found</h3>
            <p>Try adjusting your search filters.</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12 w-full">
            <Loader2 className="animate-spin text-cyan-500" size={32} />
          </div>
        )}

      </main>

      {/* --- Lightbox Modal --- */}
      <AnimatePresence>
        {selectedItemId && (
          <Lightbox 
            items={items} 
            currentId={selectedItemId} 
            onClose={() => setSelectedItemId(null)} 
            onChangeItem={setSelectedItemId}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={handleLoadMore}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default GalleryPage;