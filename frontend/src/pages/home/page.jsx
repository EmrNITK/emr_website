import React, { useState, useEffect, useCallback } from 'react';
import {
  Zap, Calendar, Image as ImageIcon, ChevronRight, ChevronLeft, Terminal,
  CircuitBoard, School, ExternalLink, ArrowRight, ArrowUpRight, Edit, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BackgroundPaths } from "@/components/ui/background-paths";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// --- Embla Carousel Imports ---
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// --- Configuration ---
const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

const navLinks = [
  { name: "Workshops", path: "/p/workshops" },
  { name: "Events", path: "/p/events" },
  { name: "Gallery", path: "/p/gallery" },
  { name: "Projects", path: "/p/projects" },
  { name: "Sponsors", path: "/p/sponsor" },
];

const COLORS = {
  primary: '#13703a',
  secondary: '#38984c',
  accent: '#51b749',
  white: '#ffffff',
  black: '#000000',
  darkBg: '#0a0a0a',
  cardBg: '#111111',
};

// --- Helpers ---
const sortByStatus = (items) => {
  const priority = { LIVE: 1, upcoming: 2, completed: 3 };
  return [...items].sort((a, b) => (priority[a.status] || 4) - (priority[b.status] || 4));
};

// Asymmetrical layout pattern for the Gallery
const getGallerySpan = (index) => {
  const pattern = [
    "col-span-2 md:col-span-2 row-span-2", // 0: Large square
    "col-span-2 md:col-span-1 row-span-1", // 1: Standard
    "col-span-2 md:col-span-1 row-span-1", // 2: Standard
    "col-span-2 md:col-span-2 row-span-1", // 3: Wide horizontal
    "col-span-2 md:col-span-1 row-span-2", // 4: Tall vertical
    "col-span-2 md:col-span-1 row-span-1", // 5: Standard
    "col-span-2 md:col-span-2 row-span-2", // 6: Large square
  ];
  return pattern[index % pattern.length];
};

// --- UI Components ---
const Button = ({ children, variant = "solid", className = "", ...props }) => {
  const base = "relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 select-none overflow-hidden mx-auto";
  const styles = {
    solid: `bg-[${COLORS.accent}]/80 hover:bg-[${COLORS.secondary}] text-${COLORS.white} shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)]`,
    bordered: `border border-white/10 hover:border-[${COLORS.accent}]/50 text-${COLORS.white} hover:text-[${COLORS.accent}] bg-transparent hover:bg-[${COLORS.primary}]/10`,
    ghost: `text-white/60 hover:text-${COLORS.white} hover:bg-white/5`,
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const SmartImage = ({ src, alt, className = "" }) => (
  <div className={`relative overflow-hidden bg-${COLORS.black} ${className}`}>
    <div
      className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-125"
      style={{ backgroundImage: `url(${src || '/placeholder.png'})` }}
    />
    <img
      src={src || "https://via.placeholder.com/400x300?text=No+Image"}
      alt={alt}
      className="relative z-10 w-full h-full object-contain p-1 transition-transform duration-500 hover:scale-105"
    />
  </div>
);

const CoverImage = ({ src, alt, className = "" }) => (
  <img
    src={src || "https://via.placeholder.com/400x300?text=No+Image"}
    alt={alt}
    className={`w-full h-full object-cover transition-transform duration-700 hover:scale-110 ${className}`}
  />
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center mb-12 text-center space-y-1 overflow-hidden">
    <motion.span
      initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, ease: "easeOut" }}
      className={`text-[${COLORS.accent}] text-xs font-bold tracking-[0.3em] uppercase`}
    >
      {subtitle}
    </motion.span>
    <motion.h2
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-2"
    >
      {title}
    </motion.h2>
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.7, delay: 0.3, ease: "anticipate" }}
      className={`w-24 h-1 bg-gradient-to-r from-transparent via-[${COLORS.accent}]/80 to-transparent rounded-full mt-6`}
    />
  </div>
);

const SeeMore = ({ sectionName }) => {
  const link = navLinks.find(n => n.name === sectionName);
  if (!link) return null;
  return (
    <div className="mt-12 flex justify-center">
      <Link to={link.path}>
        <Button variant="bordered">
          View All {sectionName} <ArrowRight size={16} />
        </Button>
      </Link>
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-[${COLORS.cardBg}] backdrop-blur-md border border-white/5 rounded-3xl hover:border-[${COLORS.accent}]/30 transition-all duration-300 overflow-hidden ${className}`}>
    {children}
  </div>
);

// New Structured Skeleton
const PageSkeleton = () => (
  <div className="min-h-screen bg-black text-white pt-24 pb-12 flex flex-col items-center gap-20 px-6 overflow-hidden w-full">
    {/* Hero Skeleton */}
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-8 mt-10">
      <div className="h-8 w-40 bg-white/10 rounded-full animate-pulse" />
      <div className="h-24 md:h-40 w-full max-w-2xl bg-white/10 rounded-2xl animate-pulse" />
      <div className="h-6 w-3/4 max-w-md bg-white/10 rounded-full animate-pulse" />
      <div className="flex gap-4">
        <div className="h-12 w-32 bg-white/10 rounded-xl animate-pulse" />
        <div className="h-12 w-32 bg-white/10 rounded-xl animate-pulse" />
      </div>
    </div>
    
    {/* Happening Now Skeleton */}
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col items-center gap-3">
        <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse" />
        <div className="h-10 w-64 bg-white/10 rounded-full animate-pulse" />
      </div>
      <div className="h-64 md:h-80 w-full bg-white/10 rounded-3xl animate-pulse" />
    </div>

    {/* Section Cards Skeleton */}
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse" />
        <div className="h-10 w-64 bg-white/10 rounded-full animate-pulse" />
      </div>
      <div className="flex flex-wrap justify-center gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full max-w-md h-[400px] bg-white/10 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

// --- CSS Animation for Infinite Marquee ---
const MarqueeStyles = () => (
  <style>
    {`
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); } 
      }
      .animate-scroll {
        animation: scroll 30s linear infinite;
      }
      .animate-scroll:hover {
        animation-play-state: paused;
      }
    `}
  </style>
);

// --- Main Page ---

const EMRHomePage = () => {
  const [data, setData] = useState({ 
    workshops: [], events: [], projects: [], gallery: [], team: [], sponsor: [], current: [] 
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user, isLoading } = useAuth();
  
  // Embla Carousel Setup for Happening Now
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', containScroll: 'trimSnaps' }, 
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  // Arrow click handlers
  const scrollPrev = useCallback(() => { if (emblaApi) emblaApi.scrollPrev(); }, [emblaApi]);
  const scrollNext = useCallback(() => { if (emblaApi) emblaApi.scrollNext(); }, [emblaApi]);

  // Handle Resize for responsive sponsor logic
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/home-content`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to connect to EMR API", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <PageSkeleton />;

  // Sponsor Logic: Only animate if sponsors exceed threshold (2 for mobile, 4 for desktop)
  const sponsorThreshold = isMobile ? 2 : 4;
  const shouldAnimateSponsors = data.sponsor && data.sponsor.length > sponsorThreshold;
  const displaySponsors = shouldAnimateSponsors 
    ? [...data.sponsor, ...data.sponsor, ...data.sponsor] 
    : data.sponsor || [];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30 selection:text-[#51b749] overflow-x-hidden">
      <BackgroundPaths title="Background Paths" />
      <MarqueeStyles />
      
      <main className="relative z-10 pt-24 pb-12 space-y-16 md:space-y-24">

        {/* --- HERO SECTION --- */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex flex-col items-center">
            <Badge className="group flex w-fit cursor-default items-center gap-1.5 rounded-full border-white/30 bg-white/5 px-3 py-1 text-white/70 backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:border-white/70 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <School className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110" />
              NIT Kurukshetra
            </Badge>

            <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter">
              Forging the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#51b749] to-[#13703a]">Future</span>
            </h1>

            <p className="text-md md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Embedded Systems & Robotics Club. <br />
              Where lines of code meet the laws of physics.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <a href="/p/workshops"><Button>Workshops</Button></a>
              <a href="/p/projects"><Button variant="bordered">View Projects</Button></a>
            </div>
          </motion.div>
        </section>

        {/* --- HAPPENING NOW (FULL WIDTH TEXT CAROUSEL) --- */}
        {data.current?.length > 0 && (
          <section className="w-full max-w-5xl mx-auto py-8 px-6">
            <SectionHeader title="Happening Now" subtitle="Live & Upcoming" />
            
            <div className="relative group">
              {/* Added Left/Right Navigation Arrows */}
              <button onClick={scrollPrev} className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md p-2 md:p-3 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-[#51b749] opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 shadow-lg">
                <ChevronLeft size={24} />
              </button>
              
              <button onClick={scrollNext} className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md p-2 md:p-3 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-[#51b749] opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 shadow-lg">
                <ChevronRight size={24} />
              </button>

              <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing rounded-3xl border border-[#51b749]/20 bg-gradient-to-br from-[#111111] to-[#0a0a0a] shadow-[0_0_40px_-15px_rgba(81,183,73,0.3)]" ref={emblaRef}>
                <div className="flex touch-pan-y">
                  {data.current.map((item, idx) => (
                    // Full width item (100%)
                    <div key={idx} className="flex-[0_0_100%] min-w-0">
                      <div className="relative p-6 md:p-14 flex flex-col justify-center min-h-[200px]">
                        
                        {/* Decorative Background Glows */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#51b749]/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#13703a]/10 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 flex flex-col gap-4 text-center items-center">
                          <div className="flex justify-center items-center flex-wrap gap-3">
                            {item.status === 'LIVE' ? (
                              <Badge className="uppercase text-xs md:text-sm font-bold tracking-widest px-4 py-1.5 bg-red-500 text-white animate-pulse flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-white animate-ping" /> LIVE NOW
                              </Badge>
                            ) : (
                              <Badge className="uppercase text-xs md:text-sm font-bold tracking-widest px-3 py-1 bg-[#51b749] text-black flex items-center gap-1">
                                 <Star size={14} /> UPCOMING
                              </Badge>
                            )}
                            <span className="text-xs md:text-sm font-mono text-white/60 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/10">
                              {item.collectionType}
                            </span>
                          </div>
                          
                          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mt-1 tracking-tight">
                            {item.title}
                          </h3>
                          
                          <p className="text-sm md:text-xl text-gray-400 mt-2 max-w-3xl leading-relaxed">
                            {item.description || item.tagline}
                          </p>
                          
                          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <span className="text-[#51b749] font-mono text-base md:text-lg flex items-center gap-2 bg-[#51b749]/10 px-6 py-3 rounded-xl border border-[#51b749]/20">
                              <Calendar size={20}/>
                              {item.collectionType === 'event' 
                                ? new Date(item.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})
                                : item.details?.date || "TBA"}
                            </span>

                            {item.regLink && (
                               <a href={item.regLink} target="_blank" rel="noreferrer" className="z-20 w-full sm:w-auto">
                                 <Button variant="solid" className="w-full !py-3 !px-8 text-base shadow-[0_0_25px_-5px_rgba(81,183,73,0.6)]">
                                   Secure Your Spot <ArrowUpRight size={18}/>
                                 </Button>
                               </a>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- WORKSHOPS --- */}
        {data.workshops?.length > 0 && (
          <section className="max-w-7xl mx-auto px-6">
            <SectionHeader title="Workshops" subtitle="Upgrade Skills" />

            <div className="flex flex-wrap justify-center gap-5">
              {sortByStatus(data.workshops).map((ws) => {
                const isLiveOrUpcoming = ws.status === 'LIVE' || ws.status === 'upcoming';
                return (
                  <Card key={ws._id} className="w-full max-w-md flex flex-col group rounded-xl">
                    <a href={ws.regLink || '#'} target="_blank" rel="noreferrer" className="block h-64 w-full border-b border-white/5 bg-white/5 relative overflow-hidden">
                      {ws.status === 'LIVE' && <span className="absolute top-3 left-3 z-20 animate-pulse bg-red-500 text-white text-[12px] px-3 py-1 rounded-full font-bold shadow-lg">LIVE NOW</span>}
                      <SmartImage src={ws.image} alt={ws.title} className="w-full h-full" />
                    </a>
                    
                    <div className="p-4 flex flex-col items-center text-center flex-1">
                      {isLiveOrUpcoming && (
                        <div className="mb-4">
                          <span className="px-3 py-1 rounded-full bg-[#13703a]/10 text-[#51b749] text-xs border border-[#51b749]/20 font-mono flex items-center gap-2">
                            <Calendar size={12}/> {ws.details?.date || "Date TBA"}
                          </span>
                        </div>
                      )}
                      
                      <h3 className={`text-xl font-bold mb-3 ${isLiveOrUpcoming ? 'text-white group-hover:text-[#51b749]' : 'text-white/60'} transition-colors ${!isLiveOrUpcoming ? 'mt-2' : ''}`}>
                        {ws.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-6">
                        {ws.description}
                      </p>

                      <div className="mt-auto w-full">
                        {(ws.regLink && isLiveOrUpcoming) && (
                          <a href={ws.regLink} target="_blank" rel="noreferrer">                        
                            <Button className="w-full">Register Now <ArrowRight size={16} /></Button>
                          </a>
                        )}
                        
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <SeeMore sectionName="Workshops" />
          </section>
        )}

        {/* --- EVENTS --- */}
        {data.events?.length > 0 && (
          <section className="max-w-7xl mx-auto px-6">
            <SectionHeader title="Events & Competitions" subtitle="Challenge Yourself" />

            <div className="flex flex-wrap justify-center gap-5">
              {sortByStatus(data.events).map((event) => {
                const isLiveOrUpcoming = event.status === 'LIVE' || event.status === 'upcoming';
                return (
                  <Card key={event._id} className="w-full max-w-md flex flex-col group rounded-xl">
                    <a href={event.regLink || '#'} target="_blank" rel="noreferrer" className="block h-64 w-full border-b border-white/5 bg-white/5 relative overflow-hidden">
                      {event.status === 'LIVE' && <span className="absolute top-3 left-3 z-20 animate-pulse bg-red-500 text-white text-[12px] px-3 py-1 rounded-full font-bold shadow-lg">LIVE NOW</span>}
                      <SmartImage src={event.image} alt={event.title} className="w-full h-full" />
                    </a>

                    <div className="p-4 flex flex-col items-center text-center flex-1">
                      {isLiveOrUpcoming && (
                        <div className={`mb-4 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-black border border-white/10 text-[#51b749] shadow-lg -mt-12 relative z-10`}>
                          {event.targetDate ? (
                            <>
                              <span className="text-[10px] font-bold uppercase tracking-wider leading-none mt-1">
                                {new Date(event.targetDate).toLocaleString('default', { month: 'short' })}
                              </span>
                              <span className="text-xl font-bold leading-none mt-1 text-white">
                                {new Date(event.targetDate).getDate()}
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-bold uppercase">TBA</span>
                          )}
                        </div>
                      )}

                      <h3 className={`text-xl font-bold mb-2 ${isLiveOrUpcoming ? 'text-white group-hover:text-[#51b749]' : 'text-white/60'} transition-colors ${!isLiveOrUpcoming ? 'mt-4' : ''}`}>
                        {event.title}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-6">
                        {event.description || event.tagline}
                      </p>

                      <div className="mt-auto w-full">
                         {(event.regLink && isLiveOrUpcoming) && (
                           <a href={event.regLink} target="_blank" rel="noreferrer">
                             <Button className="w-full">Register <ExternalLink size={16} /></Button>
                           </a>
                         )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
            <SeeMore sectionName="Events" />
          </section>
        )}
        
        {/* --- ASYMMETRICAL GALLERY --- */}
        {data.gallery?.length > 0 && (
          <section className="max-w-6xl mx-auto px-6">
            <SectionHeader title="Gallery" subtitle="Captured Moments" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px]">
              {data.gallery.slice(0, 7).map((img, index) => (
                <div 
                  key={img._id} 
                  className={`group relative bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-lg ${getGallerySpan(index)}`}
                >
                  <CoverImage src={img.src} alt={img.title} />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                    <p className="text-white font-bold text-sm md:text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.title}</p>
                    <p className="text-[#51b749] font-mono text-xs md:text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{img.year}</p>
                  </div>
                </div>
              ))}
            </div>
            <SeeMore sectionName="Gallery" />
          </section>
        )}

        {/* --- SPONSORS (CONDITIONAL MARQUEE) --- */}
        {data.sponsor?.length > 0 && (
          <section className="w-full py-16 relative overflow-hidden bg-black/50 border-y border-white/5">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#13703a]/5 to-transparent blur-3xl -z-10" />

            <div className="text-center mb-12">
              <span className="text-[#51b749] text-xs font-bold tracking-[0.3em] uppercase">
                SUPPORTED BY
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-1">
                Our Valued <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#13703a]">Sponsors</span>
              </h2>
            </div>

            {/* Conditionally apply the overflow and track styles based on whether we should animate */}
            <div className={`relative flex w-full group ${shouldAnimateSponsors ? 'overflow-x-hidden' : 'justify-center'}`}>
              
              {/* Only show Left/Right Fade Masks if it's actually scrolling */}
              {shouldAnimateSponsors && (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />
                </>
              )}

              <div className={`flex ${shouldAnimateSponsors ? 'animate-scroll w-max gap-8 sm:gap-16 px-6 items-center' : 'flex-wrap justify-center gap-8 sm:gap-16 px-6 w-full'}`}>
                {displaySponsors.map((sp, idx) => (
                  <div key={`${sp._id}-${idx}`} className="w-48 md:w-64 shrink-0 flex flex-col items-center justify-center">
                    <a href={sp.website} target="_blank" rel="noreferrer" className="flex flex-col items-center group/logo w-full">
                      <div className="w-full h-36 p-4 rounded-xl bg-white/[0.02] border border-white/5 group-hover/logo:bg-white/[0.05] group-hover/logo:border-[#51b749]/30 transition-all duration-300 flex items-center justify-center">
                        <img 
                          src={sp.logo} 
                          alt={sp.name} 
                          className="max-h-full max-w-full object-contain grayscale opacity-60 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-500" 
                        />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            
            <SeeMore sectionName="Sponsors" />
          </section>
        )}

      </main>
      
      {!isLoading && user && (user.userType === "admin" || user.userType === "super-admin") && (
        <Link to={'/admin/'} className="fixed bottom-6 right-6 h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition z-[100]">
          <Edit size={18} />
        </Link>
      )}
    </div>
  );
};

export default EMRHomePage;