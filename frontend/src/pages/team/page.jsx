import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Github, Instagram, User, Terminal, Zap, ChevronDown, Calendar, Check, Edit } from 'lucide-react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

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

// --- SKELETON LOADER ---
const MemberSkeleton = () => {
  return (
    <div className="flex flex-col items-center w-full sm:w-72 md:w-80 p-4 rounded-2xl border border-white/5 bg-[#111111] animate-pulse">
      {/* Image Placeholder - UPDATED TO CIRCLE */}
      <div className="w-48 h-48 rounded-full bg-white/10 mb-6 border border-white/5 mx-auto" />
      
      {/* Text Lines (Centered) */}
      <div className="flex flex-col items-center w-full space-y-3 pb-2">
        <div className="h-6 w-32 bg-white/10 rounded" /> {/* Name */}
        <div className="h-5 w-20 bg-white/5 rounded" /> {/* Role Badge */}
        <div className="space-y-1 w-full flex flex-col items-center pt-1">
          <div className="h-3 w-48 bg-white/5 rounded" /> {/* Bio Line 1 */}
          <div className="h-3 w-36 bg-white/5 rounded" /> {/* Bio Line 2 */}
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
      <div className="relative w-full p-4 rounded-2xl border border-white/5 bg-[#111111] backdrop-blur-sm group-hover:bg-[#151515] group-hover:border-[#51b749]/30 transition-all duration-500 overflow-hidden">
        
        {/* Decorative Corner Markers */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#51b749]/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-[#51b749]/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Image Frame - UPDATED TO CIRCLE */}
        <div className="relative w-48 h-48 mx-auto overflow-hidden rounded-full bg-black mb-6 border border-white/5 group-hover:border-[#51b749]/50 transition-colors duration-500">
          
          {/* Hover Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#13703a]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
          
          {member.image ? (
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20 bg-black">
              <User size={64} strokeWidth={1} />
            </div>
          )}

          {/* Social Dock */}
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 ease-out">
             {member.linkedin && (
               <a href={member.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-[#51b749] hover:border-[#51b749] transition-all hover:scale-110">
                 <Linkedin size={14} />
               </a>
             )}
             {member.github && (
               <a href={member.github} target="_blank" rel="noreferrer" className="p-2 bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-white hover:text-black transition-all hover:scale-110">
                 <Github size={14} />
               </a>
             )}
             {member.instagram && (
               <a href={member.instagram} target="_blank" rel="noreferrer" className="p-2 bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-full hover:bg-[#E1306C] hover:border-[#E1306C] transition-all hover:scale-110">
                 <Instagram size={14} />
               </a>
             )}
          </div>
        </div>

        {/* Info Block */}
        <div className="flex flex-col items-center text-center space-y-3 pb-2">
          
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white group-hover:text-[#51b749] transition-colors">
              {member.name}
            </h3>
            <div className="h-0.5 w-12 bg-[#51b749]/50 mx-auto rounded-full group-hover:w-24 transition-all duration-500"></div>
          </div>
          
          <div className="inline-flex items-center px-2.5 py-1 rounded bg-black/40 border border-white/5">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-[0.2em] font-mono">
              {member.role || 'MEMBER'}
            </span>
          </div>
          
          {member.bio && (
            <p className="text-xs text-white/60 leading-relaxed line-clamp-2 max-w-[200px]">
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, isLoading } = useAuth();
  
  const membersCache = useRef({});
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get(`${API_URL}/team/years`); 
        const years = res.data.sort((a, b) => b - a);
        setAvailableYears(years);
        if (years.length > 0) fetchMembersByYear(years[0]);
        else setLoading(false);
      } catch (err) {
        console.error("Failed to init team", err);
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchMembersByYear = async (year) => {
    setActiveYear(year);
    setIsDropdownOpen(false);
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30 pb-20">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-[#13703a]/10 blur-[120px] rounded-full mix-blend-screen"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#38984c]/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 sm:pt-32 pt-24 pb-10 px-6 overflow-hidden text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-white/5 text-white/60 text-xs font-medium">
            <Zap size={14} className="text-[#51b749]" />
            EMR_CORE_SYSTEMS // TEAM
          </div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white">
            Meet The <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#51b749] via-[#38984c] to-[#13703a]">Architects</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            The minds behind the machines. Innovators, engineers, and creators building the future.
          </p>
        </motion.div>
      </section>

      {/* --- STICKY NAVIGATION --- */}
      <div className="sticky top-0 z-50 py-4 mb-10">
        <div className="mx-auto px-6 flex justify-center">
          
          {/* DESKTOP VIEW: Premium Pills */}
          {/* <div className="hidden md:flex flex-wrap gap-3">
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => fetchMembersByYear(year)}
                className={`group relative px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                  activeYear === year 
                    ? 'text-white border-[#51b749] bg-[#51b749]/10 shadow-[0_0_15px_rgba(81,183,73,0.2)]' 
                    : 'text-white/40 border-white/5 hover:border-white/20 hover:text-white bg-white/5'
                }`}
              >
                {year}
                {activeYear === year && (
                  <motion.div layoutId="activeGlow" className="absolute inset-0 rounded-full bg-[#51b749]/10 blur-md -z-10" />
                )}
              </button>
            ))}
          </div> */}

          {/* MOBILE VIEW: Modern Dropdown */}
          <div className="w-[280px]" ref={dropdownRef}>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-[#111111] border border-white/10 text-white shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-[#51b749]" />
                  <span className="font-bold tracking-wide">{activeYear || 'Select Year'}</span>
                </div>
                <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#111111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 backdrop-blur-2xl"
                  >
                    <div className="max-h-60 overflow-y-auto py-2">
                      {availableYears.map((year) => (
                        <button
                          key={year}
                          onClick={() => fetchMembersByYear(year)}
                          className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-[#51b749]/10 transition-colors"
                        >
                          <span className={`text-sm ${activeYear === year ? 'text-[#51b749] font-bold' : 'text-white/60'}`}>
                            Batch of {year}
                          </span>
                          {activeYear === year && <Check size={16} className="text-[#51b749]" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>

      {/* --- MEMBER CONTAINER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-[50vh]">
        <div className="flex flex-wrap justify-center gap-8">
          {loading ? (
            <>{[...Array(6)].map((_, i) => <MemberSkeleton key={i} />)}</>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-50 border border-dashed border-white/10 rounded-3xl w-full max-w-2xl">
               <Terminal size={48} className="mb-4 text-white/30"/>
               <p className="text-white/60 font-mono text-sm uppercase tracking-widest">No records found for {activeYear}</p>
            </div>
          ) : (
            <motion.div 
              key={activeYear}
              className="contents"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {members.map((member) => (
                <MemberCard key={member._id} member={member} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
      {!isLoading && user && (user.userType === "admin" || user.userType === "super-admin") && (
              <Link to={'/admin/team'} className="fixed bottom-6 right-6 h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition z-[100]">
                <Edit size={18} />
              </Link>
            )}
    </div>
  );
};

export default TeamPage;