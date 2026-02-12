import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, Trophy, Award, Hexagon, Globe } from 'lucide-react';
import axios from 'axios';

// --- CONFIGURATION ---
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api/sponsors';

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

// Visual Configuration for Tiers - Updated with green theme
const TIER_CONFIG = {
  platinum: { 
    rank: 1, 
    label: 'Platinum',
    colorClass: 'text-[#51b749]', // Light green
    borderClass: 'border-[#51b749]/30 hover:border-[#51b749]', 
    bgClass: 'bg-[#13703a]/10 hover:bg-[#13703a]/20',
    icon: Trophy
  },
  gold: { 
    rank: 2, 
    label: 'Gold',
    colorClass: 'text-[#38984c]', // Medium green
    borderClass: 'border-[#38984c]/30 hover:border-[#38984c]', 
    bgClass: 'bg-[#38984c]/10 hover:bg-[#38984c]/20',
    icon: Award
  },
  silver: { 
    rank: 3, 
    label: 'Silver',
    colorClass: 'text-white/80',
    borderClass: 'border-white/30 hover:border-white/60', 
    bgClass: 'bg-white/5 hover:bg-white/10',
    icon: Hexagon
  },
  bronze: { 
    rank: 4, 
    label: 'Bronze',
    colorClass: 'text-white/60',
    borderClass: 'border-white/20 hover:border-white/40', 
    bgClass: 'bg-white/3 hover:bg-white/8',
    icon: Hexagon
  }
};

// --- SKELETON LOADER ---
const SponsorSkeleton = () => {
  return (
    <div className="flex flex-col p-6 w-full sm:w-80 md:w-96 rounded-2xl border border-white/5 bg-[#111111] animate-pulse">
      {/* Header: Badge Placeholder */}
      <div className="flex justify-between items-start mb-6">
        <div className="h-6 w-20 bg-white/10 rounded" />
        <div className="h-4 w-4 bg-white/10 rounded-full" />
      </div>

      {/* Logo Placeholder */}
      <div className="flex-1 min-h-[120px] flex items-center justify-center mb-4">
        <div className="h-16 w-16 rounded-full bg-white/10" />
      </div>

      {/* Footer Placeholder */}
      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col items-center gap-3">
        <div className="h-6 w-3/4 bg-white/10 rounded" />
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-1/2 bg-white/5 rounded" />
      </div>
    </div>
  );
};

const SponsorPublic = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_URL);
        setSponsors(res.data);
      } catch (err) {
        console.error("Failed to fetch sponsors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- DATA TRANSFORMATION ---
  const groupedData = useMemo(() => {
    const groups = {};
    
    sponsors.forEach(s => {
      const y = s.year || "Partners";
      if (!groups[y]) groups[y] = [];
      groups[y].push(s);
    });

    const sortedYears = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return sortedYears.map(year => {
      const sortedItems = groups[year].sort((a, b) => {
        const rankA = TIER_CONFIG[a.tier?.toLowerCase()]?.rank || 5;
        const rankB = TIER_CONFIG[b.tier?.toLowerCase()]?.rank || 5;
        return rankA - rankB;
      });
      return { year, items: sortedItems };
    });
  }, [sponsors]);

  return (
    <section className="relative w-full min-h-screen bg-black sm:py-32 py-24 overflow-hidden font-sans selection:bg-[#51b749]/30">
      
      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-center sm:mb-24 mb-10 space-y-6">
         
          
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-white/5 text-white/60 text-xs font-medium">
          <Zap size={14} className="text-[#51b749]" />
          System Fuel
        </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-bold text-white tracking-tight"
          >
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#51b749] via-[#38984c] to-[#13703a]">Partners</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            The industry titans and innovators empowering EMR's robotics and embedded systems initiatives.
          </motion.p>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="space-y-16">
          
          {loading ? (
             // SKELETON LOADING STATE
             <div className="space-y-12">
                {/* Fake Year Header */}
                <div className="flex items-center justify-center gap-6 opacity-50 animate-pulse">
                   <div className="h-px bg-white/10 flex-1 max-w-[200px]"></div>
                   <div className="h-8 w-32 bg-white/10 rounded-full"></div>
                   <div className="h-px bg-white/10 flex-1 max-w-[200px]"></div>
                </div>
                {/* Skeleton Grid */}
                <div className="flex flex-wrap justify-center gap-6">
                   {[...Array(3)].map((_, i) => <SponsorSkeleton key={i} />)}
                </div>
             </div>
          ) : (
            // ACTUAL CONTENT
            groupedData.map((group) => (
              <motion.div 
                key={group.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
              >
                {/* Year Heading */}
                <div className="flex items-center justify-center gap-6 mb-12">
                  <div className="relative flex items-center justify-center gap-4 w-full max-w-2xl">
                     <div className="h-px bg-gradient-to-r from-transparent via-[#51b749]/50 to-transparent flex-1"></div>
                     <span className="text-md font-bold text-white tracking-widest uppercase border border-white/10 bg-[#111111]/80 px-4 py-1 rounded-full backdrop-blur-xl shadow-lg shrink-0">
                        Season {group.year}
                     </span>
                     <div className="h-px bg-gradient-to-r from-transparent via-[#51b749]/50 to-transparent flex-1"></div>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex justify-center">
                  <div className="w-full max-w-6xl">
                    <div className="flex flex-wrap justify-center gap-6">
                      {group.items.map((sponsor, index) => {
                        const tierKey = sponsor.tier ? sponsor.tier.toLowerCase() : 'bronze';
                        const styles = TIER_CONFIG[tierKey] || TIER_CONFIG.bronze;
                        const Icon = styles.icon;

                        return (
                          <motion.div
                            key={sponsor._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`group relative flex flex-col p-6 w-full sm:w-60 md:w-60 rounded-2xl border backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden ${styles.borderClass} ${styles.bgClass}`}
                            onClick={() => sponsor.website && window.open(sponsor.website, '_blank')}
                          >
                            {/* Decorative Corner Markers */}
                            <div className={`absolute top-0 left-0 w-8 h-8 border-t border-l rounded-tl-xl opacity-30 group-hover:opacity-100 transition-opacity ${styles.borderClass.split(' ')[0]}`}></div>
                            <div className={`absolute bottom-0 right-0 w-8 h-8 border-b border-r rounded-br-xl opacity-30 group-hover:opacity-100 transition-opacity ${styles.borderClass.split(' ')[0]}`}></div>

                            {/* Header: Tier Badge & Link */}
                            <div className="flex justify-between items-start mb-6">
                              {/* <div className={`flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5`}>
                                <Icon size={12} className={styles.colorClass} />
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${styles.colorClass}`}>
                                  {styles.label}
                                </span>
                              </div> */}
                              {sponsor.website && (
                                <ExternalLink size={16} className={`text-white/40 group-hover:text-[#51b749] transition-colors`} />
                              )}
                            </div>

                            {/* Logo Section */}
                            <div className="flex-1 flex items-center justify-center py-6 mb-4 relative">
                              {sponsor.logo ? (
                                <img 
                                  src={sponsor.logo} 
                                  alt={sponsor.name} 
                                  className="max-h-24 max-w-[80%] object-contain transition-all duration-500 drop-shadow-lg" 
                                />
                              ) : (
                                <div className={`text-4xl font-black ${styles.colorClass} transition-opacity tracking-tighter`}>
                                  {sponsor.name.substring(0,2).toUpperCase()}
                                </div>
                              )}
                            </div>

                            {/* Footer: Details */}
                            <div className="mt-auto text-center border-t border-white/5 pt-4">
                              <h4 className="text-white font-bold text-lg group-hover:text-[#51b749] transition-colors truncate">
                                {sponsor.name}
                              </h4>
                              
                              {sponsor.description ? (
                                <p className="text-white/60 group-hover:text-white/80 text-xs mt-2 leading-relaxed line-clamp-2 transition-colors">
                                  {sponsor.description}
                                </p>
                              ) : (
                                  <p className="text-white/40 text-[10px] mt-2 italic">Proud Partner of EMR</p>
                              )}

                               {/* Link Centered */}
                               <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/40 mt-4 font-mono group-hover:text-[#51b749]/70 transition-colors">
                                 <Globe size={10} /> 
                                 <span className="truncate max-w-[150px]">
                                   {sponsor.website ? new URL(sponsor.website).hostname : 'Official Partner'}
                                 </span>
                               </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          
          {!loading && groupedData.length === 0 && (
             <div className="text-center text-white/50 py-20 border border-dashed border-white/10 rounded-2xl mx-auto max-w-3xl">
                <p>No active sponsor data detected.</p>
             </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default SponsorPublic;