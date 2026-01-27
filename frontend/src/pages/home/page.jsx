import React, { useState, useEffect } from 'react';
import {
  Zap, Calendar, Image as ImageIcon, ChevronRight, Terminal,
  CircuitBoard, User, ExternalLink, ArrowRight, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

// --- Configuration ---
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

const navLinks = [
  { name: "Workshops", path: "/p/workshops" },
  { name: "Events", path: "/p/events" },
  { name: "Gallery", path: "/p/gallery" },
  { name: "Projects", path: "/p/projects" },
];

// --- UI Components ---

const Button = ({ children, variant = "solid", className = "", ...props }) => {
  const base = "relative px-8 py-3 rounded-full font-medium text-sm transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 select-none overflow-hidden mx-auto";
  
  const styles = {
    solid: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_-5px_rgba(8,145,178,0.5)]",
    bordered: "border border-zinc-700 hover:border-cyan-500/50 text-zinc-300 hover:text-cyan-400 bg-transparent hover:bg-cyan-950/20",
    ghost: "text-zinc-500 hover:text-white hover:bg-white/5",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Ensures images are never cropped, but fill the design area nicely
const SmartImage = ({ src, alt, className = "" }) => (
  <div className={`relative overflow-hidden bg-zinc-900 ${className}`}>
    {/* Blurred Background for ambiance */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-30 blur-2xl scale-125"
      style={{ backgroundImage: `url(${src || '/placeholder.png'})` }}
    />
    {/* Actual Image - Fully contained */}
    <img 
      src={src || "https://via.placeholder.com/400x300?text=No+Image"} 
      alt={alt} 
      className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105" 
    />
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="flex flex-col items-center justify-center mb-12 text-center space-y-3">
    <span className="text-cyan-500 text-xs font-bold tracking-[0.3em] uppercase">{subtitle}</span>
    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{title}</h2>
    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-full mt-4" />
  </div>
);

const SeeMore = ({ sectionName }) => {
  const link = navLinks.find(n => n.name === sectionName);
  if (!link) return null;

  return (
    <div className="mt-12 flex justify-center">
      <a href={link.path}>
        <Button variant="bordered">
          View All {sectionName} <ArrowRight size={16} />
        </Button>
      </a>
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl hover:border-cyan-500/30 transition-all duration-300 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- Skeleton Loader Components ---

const SkeletonBox = ({ className }) => (
  <div className={`bg-zinc-800/50 animate-pulse rounded-lg ${className}`} />
);

const PageSkeleton = () => (
  <div className="min-h-screen bg-black text-zinc-300 pt-24 pb-12 space-y-24 overflow-hidden">
    
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
          <div key={i} className="w-full max-w-md h-96 bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden flex flex-col">
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

const EMRHomePage = () => {
  const [data, setData] = useState({ workshops: [], events: [], projects: [], gallery: [], team: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulated delay for testing skeleton (Remove setTimeout in production)
        // await new Promise(resolve => setTimeout(resolve, 2000));
        
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
    <div className="min-h-screen bg-black text-zinc-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      <main className="relative z-10 pt-24 pb-12 space-y-20">

        {/* --- HERO SECTION (Centered) --- */}
        <section className="max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-8 flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              System Online
            </div>

            <h1 className="text-5xl md:text-8xl font-bold text-white tracking-tighter">
              Forging the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-cyan-700">
                Future
              </span>
            </h1>

            <p className="text-md md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Embedded Systems & Robotics Club. <br />
              Where lines of code meet the laws of physics.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
              <a href="/p/workshops"><Button>Workshops</Button></a>
              <a href="/p/projects"><Button variant="bordered">View Projects</Button></a>
            </div>
          </motion.div>
        </section>

        {/* --- LEADERSHIP (Centered) --- */}
        {data.team.length > 0 && (
          <section className="max-w-7xl mx-auto px-6">
            <SectionHeader title="Core Leadership" subtitle="Final Year of EMR" />
            
            <div className="flex flex-wrap justify-center gap-10">
              {data.team.map((member, i) => (
                <motion.div 
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="group flex flex-col items-center text-center"
                >
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-b from-cyan-500/50 to-transparent mb-6 relative">
                    <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800 border border-black">
                      <img 
                        src={member.image || "https://via.placeholder.com/150"} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-all duration-500" 
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-cyan-500 text-xs uppercase tracking-widest mt-2 font-mono">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* --- WORKSHOPS (Centered Grid) --- */}
      {data.workshops.length > 0 && (
  <section className="max-w-7xl mx-auto px-6">
    <SectionHeader title="Workshops" subtitle="Upgrade Skills" />

    <div className="flex flex-wrap justify-center gap-8">
      {data.workshops.map((ws) => (
        <Card key={ws._id} className="w-full max-w-md flex flex-col group">
          <div className="h-64 w-full border-b border-white/5 bg-zinc-800/50">
            <SmartImage src={ws.posterImg} alt={ws.title} className="w-full h-full" />
          </div>
          <div className="p-4 flex flex-col items-center text-center flex-1">
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs border border-cyan-500/20 font-mono">
                {ws.details?.date || "Coming Soon"}
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
              {ws.title}
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed line-clamp-3 mb-6">
              {ws.description}
            </p>
            <a href={ws.regLink} target="_blank" rel="noreferrer" className="mt-auto w-full">
              <Button variant="ghost" className="w-full hover:bg-zinc-800">
                Register Now
              </Button>
            </a>
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
                <div key={event._id} className="relative w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-4 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 hover:border-cyan-500/30 transition-all group text-center md:text-left">
                  {event.status === 'LIVE' && (
                        <span className="md:hidden absolute left-3 top-3 animate-pulse bg-red-500 text-white text-[14px] px-2 py-0.5 rounded-full">LIVE</span>
                  )}
                  {/* Date Badge */}
                  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-black border border-white/10 text-cyan-500 shrink-0 shadow-lg">
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
                        <span className="hidden md:block animate-pulse bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">LIVE</span>
                      )}
                    </h3>
                    <p className="text-zinc-400 text-sm max-w-lg mx-auto">{event.tagline || event.description}</p>
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
  <section className="max-w-7xl mx-auto px-6 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent ">
    <SectionHeader title="Student Projects" subtitle="Innovation" />

    <div className="flex flex-wrap justify-center gap-8">
      {data.projects.map((proj) => (
        <Card key={proj._id} className="w-full max-w-xl group">
          <div className="h-64 w-full border-b border-white/5 relative">
            <SmartImage src={proj.image} alt={proj.title} className="w-full h-full" />
            <div className="absolute top-4 right-4 flex gap-2">
              {proj.techStack?.slice(0, 3).map((tech, i) => (
                <span
                  key={i}
                  className="bg-black/80 backdrop-blur text-cyan-400 text-[10px] px-2 py-1 rounded border border-cyan-500/30"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">{proj.title}</h3>
            <p className="text-zinc-500 text-sm mb-6 line-clamp-2 px-4">
              {proj.description}
            </p>
            <div className="flex justify-center gap-4">
              {proj.githubLink && (
                <a href={proj.githubLink} className="text-zinc-400 hover:text-white">
                  <CircuitBoard size={20} />
                </a>
              )}
              {proj.demoLink && (
                <a href={proj.demoLink} className="text-zinc-400 hover:text-white">
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
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.gallery.map((img) => (
                  <div key={img._id} className="bg-zinc-900 border border-white/5 p-2 rounded-2xl h-80 flex flex-col">
                     <div className="flex-1 relative overflow-hidden rounded-xl">
                        <SmartImage src={img.src} className="w-full h-full" />
                     </div>
                     <div className="pt-3 pb-1 text-center">
                        <p className="text-white font-medium text-sm">{img.title}</p>
                        <p className="text-zinc-500 text-xs">{img.year}</p>
                     </div>
                  </div>
                ))}
             </div>
             <SeeMore sectionName="Gallery" />
           </section>
        )}

      </main>
    </div>
  );
};

export default EMRHomePage;