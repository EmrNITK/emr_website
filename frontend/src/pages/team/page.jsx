import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Instagram, User, Terminal, Zap } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

// --- SKELETON LOADER ---
const MemberSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full sm:w-72 md:w-80 p-4 rounded-2xl border border-white/5 bg-zinc-900/30 animate-pulse">
      {/* Image Placeholder - UPDATED TO CIRCLE */}
      <div className="w-48 h-48 rounded-full bg-zinc-800/50 mb-6 border border-white/5 mx-auto" />
      
      {/* Text Lines (Centered) */}
      <div className="flex flex-col items-center w-full space-y-3 pb-2">
        <div className="h-6 w-32 bg-zinc-800 rounded" /> {/* Name */}
        <div className="h-5 w-20 bg-zinc-800/50 rounded" /> {/* Role Badge */}
        <div className="space-y-1 w-full flex flex-col items-center pt-1">
          <div className="h-3 w-48 bg-zinc-800/30 rounded" /> {/* Bio Line 1 */}
          <div className="h-3 w-36 bg-zinc-800/30 rounded" /> {/* Bio Line 2 */}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: MEMBER CARD ---
const MemberCard = ({ member }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0 }
      }}
      className="group relative flex flex-col items-center w-full sm:w-72 md:w-80"
    >
      {/* Card Content Wrapper */}
      <div className="relative w-full p-4 rounded-2xl border border-white/5 bg-zinc-900/30 backdrop-blur-sm group-hover:bg-zinc-900/50 group-hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
        
        {/* Decorative Corner Markers */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-cyan-500/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-cyan-500/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Image Frame - UPDATED TO CIRCLE */}
        {/* Changed from w-full/aspect-[4/5] to w-48/h-48/rounded-full/mx-auto */}
        <div className="relative w-48 h-48 mx-auto overflow-hidden rounded-full bg-black mb-6 border border-white/5 group-hover:border-cyan-500/50 transition-colors duration-500">
          
          {/* Hover Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
          
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-800 bg-zinc-950">
              <User size={64} strokeWidth={1} />
            </div>
          )}

          {/* Social Dock */}
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 ease-out">
             {member.linkedin && (
               <a href={member.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-cyan-500 hover:border-cyan-500 transition-all hover:scale-110">
                 <Linkedin size={14} />
               </a>
             )}
             {member.github && (
               <a href={member.github} target="_blank" rel="noreferrer" className="p-2 bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white hover:text-black transition-all hover:scale-110">
                 <Github size={14} />
               </a>
             )}
             {member.instagram && (
               <a href={member.instagram} target="_blank" rel="noreferrer" className="p-2 bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-pink-600 hover:border-pink-600 transition-all hover:scale-110">
                 <Instagram size={14} />
               </a>
             )}
          </div>
        </div>

        {/* Info Block */}
        <div className="flex flex-col items-center text-center space-y-3 pb-2">
          
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              {member.name}
            </h3>
            <div className="h-0.5 w-12 bg-cyan-500/50 mx-auto rounded-full group-hover:w-24 transition-all duration-500"></div>
          </div>
          
          <div className="inline-flex items-center px-2.5 py-1 rounded bg-black/40 border border-white/5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] font-mono">
              {member.role || 'MEMBER'}
            </span>
          </div>
          
          {member.bio && (
            <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 max-w-[200px]">
              {member.bio}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---

const TeamPage = () => {
  const [activeYear, setActiveYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const membersCache = useRef({});

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get(`${API_URL}/team/years`); 
        const years = res.data.sort((a, b) => b - a);
        setAvailableYears(years);
        
        if (years.length > 0) {
          fetchMembersByYear(years[0]);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to init team", err);
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchMembersByYear = async (year) => {
    setActiveYear(year);
    
    if (membersCache.current[year]) {
      setMembers(membersCache.current[year]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/team`, { params: { year } });
      const sorted = res.data.sort((a, b) => (a.rank || 99) - (b.rank || 99));
      
      membersCache.current[year] = sorted;
      setMembers(sorted);
    } catch (err) {
      console.error("Failed to load year", year);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 pb-32">
      
      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-cyan-900/10 blur-[150px] rounded-full"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-12 px-6 overflow-hidden text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Zap size={12} className="fill-cyan-400" />
            EMR_CORE_SYSTEMS // TEAM
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">Architects</span>
          </h1>
          
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            The minds behind the machines. Innovators, engineers, and creators building the future of robotics and embedded systems at NIT Kurukshetra.
          </p>
        </motion.div>
      </section>

      {/* --- STICKY YEAR NAVIGATION --- */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-y border-white/5 py-4 mb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center flex-wrap gap-2 md:gap-4">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => fetchMembersByYear(year)}
                className={`relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeYear === year 
                    ? 'text-black bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' 
                    : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {year}
                {activeYear === year && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 rounded-full border-2 border-transparent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- MEMBER CONTAINER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-[50vh]">
        <div className="flex flex-wrap justify-center gap-8">
          {loading ? (
            <>
              {[...Array(8)].map((_, i) => (
                <MemberSkeleton key={i} />
              ))}
            </>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50 border border-dashed border-zinc-800 rounded-3xl w-full max-w-2xl">
               <Terminal size={48} className="mb-4 text-zinc-600"/>
               <p className="text-zinc-400">No records found for the year {activeYear}.</p>
            </div>
          ) : (
            <motion.div 
              key={activeYear}
              className="contents"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
            >
              {members.map((member) => (
                <MemberCard key={member._id} member={member} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;