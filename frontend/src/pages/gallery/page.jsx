import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Search, Filter, X, ChevronLeft, ChevronRight,
  Loader2, Check, ChevronDown, Layers, Calendar, ZoomIn, Download, Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

// Color Constants
const COLORS = {
  primary: '#13703a',    // Dark Green
  secondary: '#38984c',  // Medium Green
  accent: '#51b749',     // Light Green
  white: '#ffffff',
  black: '#000000',
  darkBg: '#0a0a0a',
  cardBg: '#111111',
};

const YearDropdown = ({ selectedYear, years, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-[103px] items-center gap-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-white"
      >
        <span className="text-white/60">
          {selectedYear === '' ? 'All Years' : selectedYear}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Transparent overlay to close dropdown on outside click */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

          <div className="absolute left-0 mt-2 w-32 origin-top-left rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xl z-20 overflow-hidden backdrop-blur-md">
            <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
              <button
                onClick={() => { onChange(''); setIsOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
              >
                All Years
              </button>
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => { onChange(yr); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedYear === yr ? 'text-white bg-white/10' : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}; const FilterDropdown = ({ label, options, selected, onChange, icon: Icon,classNames }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={"relative inline-block text-left md:w-auto "+classNames}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-auto gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm text-white"
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-white/40" />
          <span className="text-white/80">{selected || `All ${label}`}</span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 mt-2 w-full md:w-48 origin-top-left rounded-xl bg-[#0A0A0A] border border-white/10 shadow-2xl z-20 overflow-hidden backdrop-blur-xl">
            <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
              {['', ...options].map((opt) => (
                <button
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5 text-white/70 hover:text-white"
                >
                  {opt === '' ? `All ${label}` : opt}
                  {(selected === opt || (selected === '' && opt === '')) && <Check size={12} className="text-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
const FilterPill = ({ children, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border
      ${active
        ? "bg-[#51b749] text-black border-[#51b749] shadow-[0_0_20px_rgba(81,183,73,0.3)] scale-105"
        : "bg-[#111111] text-white/60 border-white/5 hover:border-white/20 hover:text-white"
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
    className="break-inside-avoid mb-6 group relative rounded-xl overflow-hidden bg-[#111111] border border-white/5 cursor-zoom-in"
    onClick={() => onOpen(item)}
  >
    {/* Image Container */}
    <div className="relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-white/10 animate-pulse" /> {/* Placeholder */}
      <img
        src={item.src}
        alt={item.title}
        loading="lazy"
        className="relative z-10 w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:contrast-110"
      />

      {/* Overlay - Desktop */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-[#51b749] text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#51b749]" />
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
      className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-2xl flex items-center justify-center overflow-hidden"
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
          className={`max-w-full h-screen object-contain shadow-2xl shadow-black ${isExpanded ? 'blur-sm grayscale opacity-50' : ''}`}
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
            <Loader2 size={32} className="animate-spin text-[#51b749]" />
          ) : (
            <ChevronRight size={32} />
          )}
        </button>
      )}

      {/* --- Info Bar (Bottom) --- */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/90 to-transparent pt-24 pb-8 px-6 md:px-12 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 pointer-events-auto">

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[#51b749] text-black">
                {item.year}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[#111111] text-white/70 border border-white/10">
                {item.category}
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{item.title}</h2>

            <div className="relative max-w-2xl">
              <p className={`text-white/70 text-sm md:text-base leading-relaxed transition-all ${isExpanded ? '' : 'line-clamp-2'}`}>
                {item.description || "No description provided for this entry."}
              </p>
              {item.description && item.description.length > 120 && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-[#51b749] text-xs font-bold uppercase tracking-widest mt-2 hover:underline">
                  {isExpanded ? "Collapse" : "Read Full Story"}
                </button>
              )}
            </div>
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30 selection:text-[#51b749]">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[#13703a]/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#38984c]/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* --- Header / Filters --- */}
      <header className="sticky top-0 z-[100] sm:pt-24 pt-16 px-6 mx-auto space-y-6 bg-black">
        <div className="mx-auto py-2 max-w-6xl">
          <div className="flex items-center gap-4 mt-2 px-0 md:px-8 w-full">
            <FilterDropdown
              label="Years"
              options={options.years}
              selected={filters.year}
              onChange={(val) => handleFilterChange('year', val)}
              icon={Calendar}
              classNames={'min-w-[140px]'}
            />
            {/* --- CATEGORIES SECTION --- */}
            <div className="flex items-center gap-2 w-full">

              {/* Mobile View: Dropdown */}
              <div className="md:hidden w-full">
                <FilterDropdown
                  label="Categories"
                  options={options.categories}
                  selected={filters.category}
                  onChange={(val) => handleFilterChange('category', val)}
                  icon={Layers}
                  classNames={'w-full'}
                />
              </div>

              {/* Desktop View: Pills */}
              <div className="hidden md:flex items-center gap-2">
                <span className="text-white/40 mr-2"><Layers size={14} /></span>
                <FilterPill active={filters.category === ''} onClick={() => handleFilterChange('category', '')}>All</FilterPill>
                {options.categories.map(cat => (
                  <FilterPill key={cat} active={filters.category === cat} onClick={() => handleFilterChange('category', cat)}>{cat}</FilterPill>
                ))}
              </div>
            </div>


          </div>
        </div>
      </header>

      {/* --- Gallery Grid --- */}
      <main className="relative z-10 px-4 md:px-8 max-w-[1600px] mx-auto py-2">

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
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-white/40 border border-dashed border-white/10 rounded-3xl bg-[#111111]/50">
            <div className="w-16 h-16 bg-[#111111] rounded-full flex items-center justify-center mb-4 border border-white/10">
              <Filter size={24} className="opacity-50" />
            </div>
            <h3 className="text-white font-bold text-lg">No photos found</h3>
            <p>Try adjusting your search filters.</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12 w-full">
            <Loader2 className="animate-spin text-[#51b749]" size={32} />
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