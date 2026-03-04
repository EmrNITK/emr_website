import React, { useState, useEffect } from 'react';
import {
  Zap, Calendar, Image as ImageIcon, ChevronRight, Terminal,
  CircuitBoard, School, ExternalLink, ArrowRight, ArrowUpRight, Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BackgroundPaths } from "@/components/ui/background-paths"
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
// --- Configuration ---
const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

const navLinks = [
  { name: "Workshops", path: "/p/workshops" },
  { name: "Events", path: "/p/events" },
  { name: "Gallery", path: "/p/gallery" },
  { name: "Projects", path: "/p/projects" },
];

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

// --- UI Components ---

const Button = ({ children, variant = "solid", className = "", ...props }) => {
  const base = "relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 select-none overflow-hidden mx-auto";

  const styles = {
    solid: `bg-[#51b749]/80 hover:bg-[${COLORS.secondary}] text-${COLORS.white} shadow-[0_0_20px_-5px_rgba(19,112,58,0.5)]`,
    bordered: `border border-white/10 hover:border-[${COLORS.accent}]/50 text-${COLORS.white} hover:text-[${COLORS.accent}] bg-transparent hover:bg-[${COLORS.primary}]/10`,
    ghost: `text-white/60 hover:text-${COLORS.white} hover:bg-white/5`,
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Ensures images are never cropped, but fill the design area nicely
const SmartImage = ({ src, alt, className = "" }) => (
  <div className={`relative overflow-hidden bg-${COLORS.black} ${className}`}>
    {/* Blurred Background for ambiance */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-125"
      style={{ backgroundImage: `url(${src || '/placeholder.png'})` }}
    />
    {/* Actual Image - Fully contained */}
    <img
      src={src || "https://via.placeholder.com/400x300?text=No+Image"}
      alt={alt}
      className="relative z-10 w-full h-full object-contain p-1 transition-transform duration-500 hover:scale-105"
    />
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center mb-12 text-center space-y-1 overflow-hidden">

    {/* Subtitle: Fades and slides down slightly */}
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-[#51b749] text-xs font-bold tracking-[0.3em] uppercase"
    >
      {subtitle}
    </motion.span>

    {/* Title: Fades and slides up */}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
      className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-2"
    >
      {title}
    </motion.h2>

    {/* Decorative Line: Expands outward from the center */}
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: 0.3, ease: "anticipate" }}
      className="w-24 h-1 bg-gradient-to-r from-transparent via-[#51b749]/80 to-transparent rounded-full mt-6"
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
  <div className={`bg-[${COLORS.cardBg}] backdrop-blur-md border border-white/5 rounded-3xl hover:border-[#51b749]/30 transition-all duration-300 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- Skeleton Loader Components ---

const SkeletonBox = ({ className }) => (
  <div className={`bg-white/10 animate-pulse rounded-lg ${className}`} />
);

const PageSkeleton = () => (
  <div className="min-h-screen bg-black text-white pt-24 pb-12 space-y-24 overflow-hidden">

    {/* Hero Skeleton */}
    <section className="max-w-4xl mx-auto px-6 flex flex-col items-center space-y-8">
      <SkeletonBox className="w-32 h-6 rounded-full" />
      <div className="space-y-4 w-full flex flex-col items-center">
        <SkeletonBox className="w-3/4 h-16 md:h-24 rounded-2xl" />
        <SkeletonBox className="w-1/2 h-16 md:h-24 rounded-2xl" />
      </div>
      <SkeletonBox className="w-2/3 h-6 rounded-md" />
      <div className="flex gap-4 pt-2">
        <SkeletonBox className="w-32 h-12 rounded-full" />
        <SkeletonBox className="w-32 h-12 rounded-full" />
      </div>
    </section>

    {/* Leadership Skeleton (Circles) */}
    <section className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center mb-12 space-y-3">
        <SkeletonBox className="w-24 h-4" />
        <SkeletonBox className="w-64 h-10" />
      </div>
      <div className="flex flex-wrap justify-center gap-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-4">
            <SkeletonBox className="w-32 h-32 rounded-full" />
            <SkeletonBox className="w-24 h-6" />
            <SkeletonBox className="w-16 h-4" />
          </div>
        ))}
      </div>
    </section>

    {/* Workshops/Projects Skeleton (Cards) */}
    <section className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center mb-12 space-y-3">
        <SkeletonBox className="w-24 h-4" />
        <SkeletonBox className="w-48 h-10" />
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full max-w-md h-96 bg-white/5 border border-white/5 rounded-3xl overflow-hidden flex flex-col">
            <SkeletonBox className="w-full h-48 rounded-none opacity-50" />
            <div className="p-6 space-y-4 flex-1">
              <SkeletonBox className="w-20 h-6 rounded-full" />
              <SkeletonBox className="w-3/4 h-8" />
              <div className="space-y-2">
                <SkeletonBox className="w-full h-4" />
                <SkeletonBox className="w-2/3 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

// --- Main Page ---

// --- Main Page ---

const EMRHomePage = () => {
  const [data, setData] = useState({ workshops: [], events: [], projects: [], gallery: [], team: [] });
  const [loading, setLoading] = useState(true);
  const { user, isLoading } = useAuth();
  
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

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30 selection:text-[#51b749] overflow-x-hidden">
      
      {/* BackgroundPaths Component */}
      <BackgroundPaths title="Background Paths" />
      
      {/* Sleek Grid Background */}
      {/* <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#51b74915_1px,transparent_1px),linear-gradient(to_bottom,#51b74915_1px,transparent_1px)] bg-[size:40px_40px]"
          style={{
            maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)"
          }}
        />
      </div> */}

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12 space-y-16 md:space-y-20">

        {/* --- HERO SECTION (Centered) --- */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-8 flex flex-col items-center"
          >
            <Badge
              variant="outline"
              className="group flex w-fit cursor-default items-center gap-1.5 rounded-full border-white/30 bg-white/5 px-3 py-1 text-white/70 backdrop-blur-sm transition-all duration-300 ease-out hover:scale-105 hover:border-white/70 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <School className="size-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110" />
              NIT Kurukshetra
            </Badge>

            <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter">
              Forging the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#51b749] to-[#13703a]">
                Future
              </span>
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

        {/* --- WORKSHOPS (Centered Grid) --- */}
        {data.workshops.length > 0 && (
          <section className="max-w-7xl mx-auto px-6">
            <SectionHeader title="Workshops" subtitle="Upgrade Skills" />

            <div className="flex flex-wrap justify-center gap-5">
              {data.workshops.map((ws) => (
                <Card key={ws._id} className="w-full max-w-md flex flex-col group rounded-xl">
                  <div className="h-64 w-full border-b border-white/5 bg-white/5">
                    <SmartImage src={ws.posterImg} alt={ws.title} className="w-full h-full" />
                  </div>
                  <div className="p-4 flex flex-col items-center text-center flex-1">
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full bg-[#13703a]/10 text-[#51b749] text-xs border border-[#51b749]/20 font-mono">
                        {ws.details?.date || "Coming Soon"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#51b749] transition-colors">
                      {ws.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-6">
                      {ws.description}
                    </p>
                    {(ws.regLink && ws.section === 'upcoming') && (
                      <a href={ws.regLink} target="_blank" rel="noreferrer" className="mt-auto w-full">                        
                        <Button>Register Now <ArrowRight size={16} /></Button>
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <SeeMore sectionName="Workshops" />
          </section>
        )}

        {/* --- EVENTS (Centered List) --- */}
        {data.events.length > 0 && (
          <section className="max-w-5xl mx-auto px-6">
            <SectionHeader title="Events & Competitions" subtitle="Challenge Yourself" />

            <div className="space-y-6 flex flex-col items-center">
              {data.events.map((event) => (
                <div key={event._id} className="relative w-full bg-[#111111] border border-white/5 rounded-2xl p-4 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 hover:border-[#51b749]/30 transition-all group text-center md:text-left">
                  {event.status === 'LIVE' && (
                    <span className="md:hidden absolute left-3 top-3 animate-pulse bg-[#51b749] text-white text-[14px] px-2 py-0.5 rounded-full">LIVE</span>
                  )}
                  {/* Date Badge */}
                  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-black border border-white/10 text-[#51b749] shrink-0 shadow-lg">
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {new Date(event.targetDate).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-bold text-white">
                      {new Date(event.targetDate).getDate()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                      {event.title}
                      {event.status === 'LIVE' && (
                        <span className="hidden md:block animate-pulse bg-[#51b749] text-white text-[10px] px-2 py-0.5 rounded-full">LIVE</span>
                      )}
                    </h3>
                    <p className="text-white/70 text-sm max-w-lg mx-auto">{event.tagline || event.description}</p>
                  </div>

                  <a href={event.regLink} target="_blank" rel="noreferrer">
                    <Button variant="ghost" className="shrink-0">Details <ExternalLink size={14} /></Button>
                  </a>
                </div>
              ))}
            </div>
            <SeeMore sectionName="Events" />
          </section>
        )}

        {/* --- PROJECTS (Centered Grid) --- */}
        {data.projects.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 bg-gradient-to-b from-transparent via-[#13703a]/5 to-transparent ">
            <SectionHeader title="Student Projects" subtitle="Innovation" />

            <div className="flex flex-wrap justify-center gap-8">
              {data.projects.map((proj) => (
                <Card key={proj._id} className="w-full max-w-xl group">
                  <div className="h-64 w-full border-b border-white/5 relative">
                    <SmartImage src={proj.image} alt={proj.title} className="w-full h-full" />
                  </div>
                  <div className="py-8 pb-8 pt-4 text-center">
                    <div className="">
                      {proj.techStack?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="bg-black/80 backdrop-blur text-[#51b749] text-[10px] px-2 py-1 rounded border border-[#51b749]/30 mx-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-white my-3">{proj.title}</h3>
                    <p className="text-white/60 text-sm mb-6 line-clamp-2 px-4">
                      {proj.description}
                    </p>
                    <div className="flex justify-center gap-4">
                      {proj.githubLink && (
                        <a href={proj.githubLink} className="text-white/60 hover:text-white">
                          <CircuitBoard size={20} />
                        </a>
                      )}
                      {proj.demoLink && (
                        <a href={proj.demoLink} className="text-white/60 hover:text-white">
                          <ExternalLink size={20} />
                        </a>
                      )}
                      <span className="flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                        Read More <ArrowUpRight size={12} />
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <SeeMore sectionName="Projects" />
          </section>
        )}

        {/* --- GALLERY (Centered Grid) --- */}
        {data.gallery.length > 0 && (
          <section className="max-w-6xl mx-auto px-6">
            <SectionHeader title="Gallery" subtitle="Captured Moments" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.gallery.map((img) => (
                <div key={img._id} className="group relative bg-[#111111] border border-white/5 p-2 rounded-2xl h-80 flex flex-col">
                  <div className="flex-1 relative overflow-hidden rounded-xl">
                    <SmartImage src={img.src} className="w-full h-full" />
                  </div>
                  <div className="z-[10] bottom-4 left-4 px-4 rounded-lg py-2 bg-black/80 group-hover:block absolute text-left hidden">
                    <p className="text-white font-medium text-sm">{img.title}</p>
                    <p className="text-white/60 text-xs">{img.year}</p>
                  </div>
                </div>
              ))}
            </div>
            <SeeMore sectionName="Gallery" />
          </section>
        )}
        
        {/* --- SPONSORS --- */}
        {data.sponsor && (
          <section className="max-w-7xl mx-auto px-6 py-12 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#13703a]/10 to-transparent blur-3xl -z-10" />

            <div className="text-center mb-6">
              <span className="text-[#51b749] text-xs font-bold tracking-[0.3em] uppercase">
                SUPPORTED BY
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-1">
                Our Valued <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#13703a]">Sponsors</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#51b749]/50 to-transparent rounded-full mt-2 mx-auto" />
            </div>

            {data.sponsor && data.sponsor.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                  {data.sponsor.map((sp) => (
                    <a
                      key={sp._id}
                      href={sp.website}
                      target="_blank"
                      rel="noreferrer"
                      className="group/sponsor relative"
                    >
                      <div className="group flex rounded-md items-center justify-center px-3 pt-3 hover:bg-slate-950 transition-colors">
                        <div className='text-center'>
                          <img
                            src={sp.logo}
                            alt={sp.name}
                            className="h-20 object-contain "
                          />
                          <span className="flex justify-center items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform pt-2">
                            {sp.name} <ArrowUpRight size={12} />
                          </span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      </main>
      
      {/* Admin Button */}
      {!isLoading && user && (user.userType === "admin" || user.userType === "super-admin") && (
        <Link to={'/admin/'} className="fixed bottom-6 right-6 h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition z-[100]">
          <Edit size={18} />
        </Link>
      )}
    </div>
  );
};

export default EMRHomePage;