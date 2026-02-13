import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, Clock, MapPin, ChevronRight, 
  Terminal, Cpu, Loader2, ArrowRight, Zap, Layers, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Add this
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

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

// --- UI Primitives ---

const Badge = ({ children, color = "dark" }) => {
  const styles = {
    accent: `bg-slate-900 text-[${COLORS.accent}] border-[${COLORS.accent}]/20`,
    dark: `bg-slate-900 text-white/70 border-white/10`,
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${styles[color]}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "relative px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 select-none overflow-hidden";
  
  const styles = {
    primary: `bg-[${COLORS.primary}] hover:bg-[${COLORS.secondary}] text-${COLORS.white} shadow-lg shadow-[${COLORS.primary}]/20 border border-[${COLORS.primary}]/50`,
    ghost: `text-white/60 hover:text-${COLORS.white} hover:bg-white/5 border border-transparent`,
    disabled: `bg-[${COLORS.cardBg}] text-white/40 border border-white/10 cursor-not-allowed`,
  };

  return (
    <button className={`${base} ${props.disabled ? styles.disabled : styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Smart Image (No Crop) ---
const SmartImage = ({ src, alt }) => (
  <div className="w-full h-full relative overflow-hidden bg-black rounded-xl border border-white/10">
    {/* Blurred Background */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl scale-125"
      style={{ backgroundImage: `url(${src || '/placeholder.png'})` }}
    />
    {/* Actual Image */}
    <img 
      src={src || "https://via.placeholder.com/800x600?text=Workshop"} 
      alt={alt} 
      className="relative z-10 w-full h-full object-contain p-2 transition-transform duration-500 hover:scale-105" 
    />
  </div>
);

// --- Skeleton Loader ---
const WorkshopSkeleton = () => (
  <div className="w-full bg-white/5 rounded-2xl p-6 border border-white/10 animate-pulse flex flex-col lg:flex-row gap-8">
    <div className="w-full lg:w-5/12 aspect-video bg-white/10 rounded-xl" />
    <div className="w-full lg:w-7/12 space-y-4">
      <div className="h-4 w-24 bg-white/10 rounded-full" />
      <div className="h-10 w-3/4 bg-white/10 rounded-lg" />
      <div className="space-y-2 pt-2">
         <div className="h-3 w-full bg-white/10 rounded" />
         <div className="h-3 w-5/6 bg-white/10 rounded" />
      </div>
    </div>
  </div>
);

const WorkshopCard = ({ data }) => {
  const details = data.details || { date: 'TBA', time: 'TBA', venue: 'TBA' };
  const isUpcoming = data.status === 'upcoming'; // Changed from 'section'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-[#111111] border border-white/10 hover:border-[#51b749]/30 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#51b749]/10"
    >
      <div className="flex flex-col lg:flex-row h-full">
        {/* Clickable Area Wrapper */}
        <Link to={`/p/workshops/${data.slug}`} className="flex flex-col lg:flex-row w-full">
            
            {/* Image */}
            <div className="w-full lg:w-5/12 h-64 lg:h-auto relative overflow-hidden bg-black">
               <img src={data.image} alt={data.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

            </div>

            {/* Content */}
            <div className="w-full lg:w-7/12 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#51b749] transition-colors">{data.title}</h2>
                <p className="text-white/60 text-sm line-clamp-2 mb-6">{data.description}</p>
                
                {/* Mini Details Grid */}
                {data.section === 'upcoming' && (<div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                   <div className="flex items-center gap-2 text-xs text-white/80">
                      <Calendar size={14} className="text-[#51b749]"/> {details.date}
                   </div>
                   <div className="flex items-center gap-2 text-xs text-white/80">
                      <Clock size={14} className="text-[#51b749]"/> {details.time}
                   </div>
                </div>)}
              </div>

              <div className="mt-6 flex items-center text-[#51b749] text-sm font-bold uppercase tracking-wider gap-2 group-hover:gap-4 transition-all">
                 View Details <ArrowRight size={16}/>
              </div>
            </div>
        </Link>
      </div>
    </motion.div>
  );
};
// --- Main Page ---

const WorkshopsPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await axios.get(`${API_URL}/workshops`);
        setWorkshops(res.data);
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchWorkshops();
  }, []);

  const upcomingWorkshops = workshops.filter(w => w.section === 'upcoming');
  const pastWorkshops = workshops.filter(w => w.section !== 'upcoming');

  return (
<div className="min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30 selection:text-[#51b749]">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[#13703a]/10 blur-[120px] rounded-full mix-blend-screen"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#38984c]/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>
      
      <main className="relative z-10 sm:pt-32 pt-24 pb-24 max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-white/10 text-white/70 text-xs font-medium uppercase tracking-wider">
              <Terminal size={12} />
              Technical Training
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#38984c]">Machines</span>
           </h1>
           <p className="text-white/70 text-lg leading-relaxed">
              Join our hands-on sessions. From embedded systems logic to advanced robotics mechanics, we provide the blueprints for your engineering journey.
           </p>
        </div>

        {/* Loading State */}
        {loading && (
            <div className="space-y-8">
                <WorkshopSkeleton />
                <WorkshopSkeleton />
            </div>
        )}

        {/* Content */}
        {!loading && (
            <div className="space-y-10">
                
                {/* Upcoming Section */}
                {upcomingWorkshops.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8 ml-2">
                           <div className="w-8 h-8 rounded-lg bg-[#51b749]/10 flex items-center justify-center border border-[#51b749]/20">
                              <Zap className="text-[#51b749]" size={16} />
                           </div>
                           <h3 className="text-xl font-bold text-white">Open for Registration</h3>
                        </div>
                        <div className="grid gap-8">
                           {upcomingWorkshops.map((ws) => (
                               <WorkshopCard key={ws._id} data={ws} />
                           ))}
                        </div>
                    </section>
                )}

                {/* Archive Section */}
                {pastWorkshops.length > 0 && (
                     <section>
                        <div className="flex items-center gap-3 mb-8 ml-2">
                           <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center border border-white/10">
                              <Layers className="text-white/70" size={16} />
                           </div>
                           <h3 className="text-xl font-bold text-white/80">All Workshops</h3>
                        </div>
                        <div className="grid gap-8 transition-opacity">
                            {pastWorkshops.map((ws) => (
                                <WorkshopCard key={ws._id} data={ws} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {workshops.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl bg-[#111111]/50">
                        <Cpu className="text-white/30 mx-auto mb-4" size={32} />
                        <h3 className="text-lg font-bold text-white">No Workshops Scheduled</h3>
                        <p className="text-white/50">Check back later for new learning opportunities.</p>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default WorkshopsPage;