import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
  Search, Filter, X, ChevronLeft, ChevronRight,
  Loader2, Check, ChevronDown, Layers, Calendar, ZoomIn, Download, Share2,
  Play, Pause, Maximize, Minimize, Volume2, VolumeX, // <-- Added Video Icons
  Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

// --- NEW HELPER: Smart Video Detection ---
const isVideoMedia = (item) => {
  if (item?.mediaType === 'video') return true;
  if (item?.src && typeof item.src === 'string') {
    const lowerSrc = item.src.toLowerCase();
    return (
      lowerSrc.endsWith('.mp4') || 
      lowerSrc.endsWith('.mov') || 
      lowerSrc.endsWith('.webm') || 
      lowerSrc.includes('/video/upload/')
    );
  }
  return false;
};

// Color Constants
const COLORS = {
  primary: '#13703a',
  secondary: '#38984c',
  accent: '#51b749',
  white: '#ffffff',
  black: '#000000',
  darkBg: '#0a0a0a',
  cardBg: '#111111',
};

// --- DROPDOWNS & PILLS ---

const FilterDropdown = ({ label, options, selected, onChange, icon: Icon, classNames }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={"relative inline-block text-left md:w-auto " + classNames}>
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

// --- GALLERY CARD (THUMBNAIL) ---

// --- GALLERY CARD (THUMBNAIL) ---

const GalleryCard = React.forwardRef(({ item, onOpen, index }, ref) => {
  const isVideo = isVideoMedia(item);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(err => console.log("Autoplay prevented:", err));
    }
  };

  const handleMouseLeave = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="break-inside-avoid mb-6 group relative rounded-xl overflow-hidden bg-[#111111] border border-white/5 cursor-pointer"
      onClick={() => onOpen(item)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden w-full bg-black flex items-center justify-center">
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
        
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={item.src}
              muted
              loop
              playsInline
              className="relative z-10 w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 group-hover:contrast-110"
            />
            
            {/* NEW: Top-Left Play Icon Indicator */}
            <div className="absolute top-3 left-3 z-30 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/10 transition-transform group-hover:scale-110">
              <Play size={14} fill="white" className="text-white" />
            </div>

            {/* Center Play Icon Indicator (Optional: kept from your original code) */}
            <div className="absolute inset-0 z-15 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="bg-black/50 backdrop-blur-md p-4 rounded-full">
                 <Play size={24} fill="white" className="text-white ml-1" />
               </div>
            </div>
          </>
        ) : (
          <img
            src={item.src}
            alt={item.title}
            loading="lazy"
            className="relative z-10 w-full h-auto object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 group-hover:contrast-110"
          />
        )}

        {/* Overlay - Desktop Info */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-[#51b749] text-[10px] font-mono uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#51b749]" />
              {isVideo ? 'VIDEO • ' + item.category : item.category}
            </p>
            <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
          </div>
        </div>

        {/* Mobile/Right-side Hint (kept from your original code) */}
        <div className="absolute top-3 right-3 z-20 md:hidden bg-black/50 backdrop-blur rounded-full p-2">
          {isVideo ? <Play size={14} className="text-white" /> : <ZoomIn size={14} className="text-white" />}
        </div>
      </div>
    </motion.div>
  );
});

// --- CUSTOM VIDEO PLAYER ---

const CustomVideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Autoplay on load
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setProgress((current / total) * 100);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleTimelineClick = (e) => {
    e.stopPropagation();
    const timeline = e.currentTarget;
    const rect = timeline.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center group z-10"
      onClick={togglePlay} // Click video to play/pause
    >
      <video
        ref={videoRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="max-h-[75vh] w-auto shadow-2xl rounded-lg bg-black cursor-pointer"
        playsInline
      />

      {/* Center Play/Pause Overlay animation */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 transition-all">
          <div className="bg-black/50 backdrop-blur-md p-6 rounded-full text-white">
            <Play size={40} fill="white" className="ml-2" />
          </div>
        </div>
      )}

      {/* Custom Control Bar */}
      <div 
        className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicking controls from toggling play on the video wrapper
      >
        {/* Timeline */}
        <div 
          className="w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer relative"
          onClick={handleTimelineClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-[#51b749] rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            {/* Scrubber Knob */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow translate-x-1/2 scale-0 group-hover:scale-100 transition-transform"></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-[#51b749] transition-colors">
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            <button onClick={toggleMute} className="text-white hover:text-[#51b749] transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <span className="text-white/70 text-xs font-mono">
              {formatTime(videoRef.current?.currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <button onClick={toggleFullscreen} className="text-white hover:text-[#51b749] transition-colors">
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- PROFESSIONAL LIGHTBOX ---

const Lightbox = ({ items, currentId, onClose, onChangeItem, hasMore, onLoadMore, loading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentIndex = items.findIndex(i => i._id === currentId);
  const item = items[currentIndex];

  useEffect(() => { setIsExpanded(false); }, [currentId]);

  useEffect(() => {
    if (currentIndex >= items.length - 2 && hasMore && !loading) {
      onLoadMore();
    }
  }, [currentIndex, items.length, hasMore, loading, onLoadMore]);

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

  const isVideo = isVideoMedia(item);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1100] bg-black/95 backdrop-blur-2xl flex items-center justify-center "
    >
      <div className="absolute inset-0 flex items-center justify-center z-10 pb-20">
        
        {isVideo ? (
          // RENDER CUSTOM VIDEO PLAYER
          <CustomVideoPlayer src={item.src} />
        ) : (
          // RENDER IMAGE ZOOM WRAPPER
          <TransformWrapper
            initialScale={1}
            centerOnInit={true}
            minScale={1}
            maxScale={4}
            doubleClick={{ mode: "reset" }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute top-6 left-6 z-50 flex gap-2 pointer-events-auto md:flex hidden">
                  <button onClick={() => zoomIn()} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/20"><ZoomIn size={20} /></button>
                  <button onClick={() => resetTransform()} className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/20"><Layers size={20} /></button>
                </div>

                <TransformComponent
                  wrapperStyle={{ width: "100vw", height: "100vh" }}
                  contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <motion.img
                    key={item._id}
                    src={item.src}
                    alt={item.title}
                    className={`max-w-full max-h-[85vh] object-contain shadow-2xl transition-opacity ${isExpanded ? 'blur-sm grayscale opacity-50' : 'opacity-100'}`}
                    style={{ display: 'block', userSelect: 'none' }}
                  />
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        )}
      </div>

      {/* --- UI Overlays --- */}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[1200] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/5 backdrop-blur-md"
      >
        <X size={24} />
      </button>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={() => onChangeItem(items[currentIndex - 1]._id)}
          className="absolute left-2 top-1/2 -translate-y-1/2 sm:p-4 p-2 rounded-full bg-black/40 text-white backdrop-blur border border-white/10 transition-all z-[60] hover:bg-white/10 hover:scale-105"
        >
          <ChevronLeft size={32} className='text-white/70' />
        </button>
      )}

      {(currentIndex < items.length - 1 || hasMore) && (
        <button
          disabled={currentIndex === items.length - 1 && loading}
          onClick={() => {
            if (currentIndex < items.length - 1) onChangeItem(items[currentIndex + 1]._id);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 sm:p-4 p-2 rounded-full bg-black/40 text-white backdrop-blur border border-white/10 transition-all z-[60] hover:bg-white/10 hover:scale-105"
        >
          {currentIndex === items.length - 1 && loading ? (
            <Loader2 size={32} className="animate-spin text-white" />
          ) : (
            <ChevronRight size={32} className='text-white/70' />
          )}
        </button>
      )}

      {/* Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-[60] bg-gradient-to-t from-black via-black/80 to-transparent pt-32 pb-6 px-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 pointer-events-auto">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#51b749] text-black uppercase">{item.year}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-white/70 border border-white/10 uppercase">{item.category}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{item.title}</h2>
            <div className="relative max-w-2xl">
              <p className={`text-white/70 text-sm leading-relaxed transition-all ${isExpanded ? '' : 'line-clamp-1'}`}>
                {item.description}
              </p>
              {item.description && item.description.length > 60 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-[#51b749] text-xs font-bold uppercase mt-2 hover:underline pointer-events-auto"
                >
                  {isExpanded ? "Hide" : "Read More"}
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
  const { user, isLoading } = useAuth();

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
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[#13703a]/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#38984c]/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <header className="sticky top-0 z-30 sm:pt-20 pt-16 px-6 mx-auto space-y-6 bg-black">
        <div className="mx-auto py-2 max-w-6xl">
          <div className="flex items-center gap-4 mt-2 px-0 md:px-8 mx-auto max-w-[400px]">
            <FilterDropdown
              label="Years"
              options={options.years}
              selected={filters.year}
              onChange={(val) => handleFilterChange('year', val)}
              icon={Calendar}
              classNames={'min-w-[140px]'}
            />
            <div className="flex items-center gap-2 w-full">
              <div className="w-full">
                <FilterDropdown
                  label="Categories"
                  options={options.categories}
                  selected={filters.category}
                  onChange={(val) => handleFilterChange('category', val)}
                  icon={Layers}
                  classNames={'w-full'}
                />
              </div>
              {/* <div className="hidden md:flex items-center gap-2">
                <span className="text-white/40 mr-2"><Layers size={14} /></span>
                <FilterPill active={filters.category === ''} onClick={() => handleFilterChange('category', '')}>All</FilterPill>
                {options.categories.map(cat => (
                  <FilterPill key={cat} active={filters.category === cat} onClick={() => handleFilterChange('category', cat)}>{cat}</FilterPill>
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </header>

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
            <h3 className="text-white font-bold text-lg">No media found</h3>
            <p>Try adjusting your search filters.</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12 w-full">
            <Loader2 className="animate-spin text-[#51b749]" size={32} />
          </div>
        )}
      </main>

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
      {!isLoading && user && (user.userType === "admin" || user.userType === "super-admin") && (
        <Link to={'/admin/gallery'} className="fixed bottom-6 right-6 h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition z-[100]">
          <Edit size={18} />
        </Link>
      )}
    </div>

  );
};

export default GalleryPage;