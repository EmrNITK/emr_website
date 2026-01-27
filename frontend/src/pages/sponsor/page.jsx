import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Zap, Trophy, Award, Hexagon, Globe } from 'lucide-react';
import axios from 'axios';

// --- CONFIGURATION ---
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api/sponsors';

// Visual Configuration for Tiers
const TIER_CONFIG = {
  platinum: { 
    rank: 1, 
    label: 'Platinum',
    colorClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/30 hover:border-cyan-400', 
    bgClass: 'bg-cyan-950/10 hover:bg-cyan-900/20',
    icon: Trophy
  },
  gold: { 
    rank: 2, 
    label: 'Gold',
    colorClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/30 hover:border-yellow-400', 
    bgClass: 'bg-yellow-950/10 hover:bg-yellow-900/20',
    icon: Award
  },
  silver: { 
    rank: 3, 
    label: 'Silver',
    colorClass: 'text-zinc-300',
    borderClass: 'border-zinc-600/30 hover:border-zinc-400', 
    bgClass: 'bg-zinc-800/10 hover:bg-zinc-800/30',
    icon: Hexagon
  },
  bronze: { 
    rank: 4, 
    label: 'Bronze',
    colorClass: 'text-orange-400',
    borderClass: 'border-orange-600/30 hover:border-orange-500', 
    bgClass: 'bg-orange-950/10 hover:bg-orange-900/20',
    icon: Hexagon
  }
};

// --- SKELETON LOADER ---
const SponsorSkeleton = () => {
  return (
    <div className="flex flex-col p-6 w-full sm:w-80 md:w-96 rounded-2xl border border-white/5 bg-zinc-900/30 animate-pulse">
      {/* Header: Badge Placeholder */}
      <div className="flex justify-between items-start mb-6">
        <div className="h-6 w-20 bg-zinc-800 rounded" />
        <div className="h-4 w-4 bg-zinc-800 rounded-full" />
      </div>

      {/* Logo Placeholder */}
      <div className="flex-1 min-h-[120px] flex items-center justify-center mb-4">
        <div className="h-16 w-16 rounded-full bg-zinc-800/50" />
      </div>

      {/* Footer Placeholder */}
      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col items-center gap-3">
        <div className="h-6 w-3/4 bg-zinc-800 rounded" />
        <div className="h-3 w-full bg-zinc-800/50 rounded" />
        <div className="h-3 w-1/2 bg-zinc-800/50 rounded" />
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
    <section className="relative w-full min-h-screen bg-black py-32 overflow-hidden font-sans selection:bg-cyan-500/30">
      
      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-400 text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            <Zap size={12} className="fill-cyan-400" />
            System Fuel
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight"
          >
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">Partners</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            The industry titans and innovators empowering EMR's robotics and embedded systems initiatives.
          </motion.p>
        </div>

        {/* --- CONTENT AREA --- */}
        <div className="space-y-32">
          
          {loading ? (
             // SKELETON LOADING STATE
             <div className="space-y-12">
                {/* Fake Year Header */}
                <div className="flex items-center justify-center gap-6 opacity-50 animate-pulse">
                   <div className="h-px bg-zinc-800 flex-1 max-w-[200px]"></div>
                   <div className="h-8 w-32 bg-zinc-800 rounded-full"></div>
                   <div className="h-px bg-zinc-800 flex-1 max-w-[200px]"></div>
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
                     <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent flex-1"></div>
                     <span className="text-xl font-bold text-white tracking-widest uppercase border border-white/10 bg-zinc-900/50 px-6 py-2 rounded-full backdrop-blur-xl shadow-lg shrink-0">
                        Season {group.year}
                     </span>
                     <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent flex-1"></div>
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
                            className={`group relative flex flex-col p-6 w-full sm:w-80 md:w-96 rounded-2xl border backdrop-blur-md transition-all duration-300 cursor-pointer overflow-hidden ${styles.borderClass} ${styles.bgClass}`}
                            onClick={() => sponsor.website && window.open(sponsor.website, '_blank')}
                          >
                            {/* Decorative Corner Markers */}
                            <div className={`absolute top-0 left-0 w-8 h-8 border-t border-l rounded-tl-xl opacity-30 group-hover:opacity-100 transition-opacity ${styles.borderClass.split(' ')[0]}`}></div>
                            <div className={`absolute bottom-0 right-0 w-8 h-8 border-b border-r rounded-br-xl opacity-30 group-hover:opacity-100 transition-opacity ${styles.borderClass.split(' ')[0]}`}></div>

                            {/* Header: Tier Badge & Link */}
                            <div className="flex justify-between items-start mb-6">
                              <div className={`flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5`}>
                                <Icon size={12} className={styles.colorClass} />
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${styles.colorClass}`}>
                                  {styles.label}
                                </span>
                              </div>
                              {sponsor.website && (
                                <ExternalLink size={16} className={`text-slate-600 group-hover:text-white transition-colors`} />
                              )}
                            </div>

                            {/* Logo Section */}
                            <div className="flex-1 flex items-center justify-center py-6 mb-4 relative">
                              {sponsor.logo ? (
                                <img 
                                  src={sponsor.logo} 
                                  alt={sponsor.name} 
                                  className="max-h-16 max-w-[80%] object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 drop-shadow-lg" 
                                />
                              ) : (
                                <div className={`text-3xl font-black ${styles.colorClass} opacity-30 group-hover:opacity-100 transition-opacity tracking-tighter`}>
                                  {sponsor.name.substring(0,2).toUpperCase()}
                                </div>
                              )}
                            </div>

                            {/* Footer: Details */}
                            <div className="mt-auto text-center border-t border-white/5 pt-4">
                              <h4 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors truncate">
                                {sponsor.name}
                              </h4>
                              
                              {sponsor.description ? (
                                <p className="text-slate-500 group-hover:text-slate-400 text-xs mt-2 leading-relaxed line-clamp-2 transition-colors">
                                  {sponsor.description}
                                </p>
                              ) : (
                                  <p className="text-slate-600 text-[10px] mt-2 italic">Proud Partner of EMR</p>
                              )}

                               {/* Link Centered */}
                               <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600 mt-4 font-mono group-hover:text-cyan-500/70 transition-colors">
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
             <div className="text-center text-slate-500 py-20 border border-dashed border-white/10 rounded-2xl mx-auto max-w-3xl">
                <p>No active sponsor data detected.</p>
             </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default SponsorPublic;