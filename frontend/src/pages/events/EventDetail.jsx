import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Clock, MapPin, 
  ExternalLink, Trophy, Zap, Shield, 
  Download, Loader2, AlertCircle, Terminal, 
  Share2, Users, Layers
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

// Markdown Parser
const mdParser = new MarkdownIt({ html: true, linkify: true, typographer: true });

// --- COUNTDOWN COMPONENT ---
const useCountdown = (targetDate) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    }
    return { d: 0, h: 0, m: 0, s: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return timeLeft;
};

const Countdown = ({ targetDate }) => {
  const time = useCountdown(targetDate);
  return (
    <div className="flex gap-3">
      {Object.entries(time).map(([unit, val]) => (
        <div key={unit} className="flex flex-col items-center bg-[#111111]/80 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-lg min-w-[55px]">
          <span className="text-xl font-bold text-white font-mono">{val.toString().padStart(2, '0')}</span>
          <span className="text-[9px] text-white/50 uppercase tracking-widest">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const EventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        const found = res.data.find(e => e.slug === slug);
        if(found) setEvent(found);
        else setError(true);
      } catch (err) { setError(true); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#51b749]" size={40}/>
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-6">
      <AlertCircle size={48} className="text-[#51b749]"/>
      <h2 className="text-2xl font-bold">Event Not Found</h2>
      <Link to="/p/events" className="px-6 py-2 rounded-full bg-[#51b749] text-black font-bold">Back to Events</Link>
    </div>
  );

  const isLive = event.status === 'LIVE';
  const isPast = event.status === 'completed';
  const isUpcoming = event.status === 'upcoming';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] w-full overflow-hidden mt-24">
        <div className="absolute inset-0">
          <img src={event.image || event.posterUrl} className="w-full h-full object-cover" alt="Cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30"></div>
          <div className="absolute inset-0 bg-[#13703a]/20 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
           <Link to="/p/events" className="absolute top-8 left-6 flex items-center gap-2 text-white/70 hover:text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all">
              <ArrowLeft size={16}/> <span className="text-xs font-bold uppercase">All Events</span>
           </Link>
           
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
             <div className="flex flex-wrap gap-3 mb-4">
                {isLive && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-500 border border-red-500/30 flex items-center gap-2 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> Live Now
                    </span>
                )}
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${isUpcoming ? 'bg-[#51b749]/20 border-[#51b749] text-[#51b749]' : 'bg-white/10 border-white/20 text-white/60'}`}>
                   {event.tagline || 'Technical Competition'}
                </span>
             </div>
             
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6">{event.title}</h1>
             
             {!isPast && (
               <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <Countdown targetDate={event.targetDate} />
                  <div className="h-8 w-[1px] bg-white/20 hidden sm:block"></div>
                  <div className="flex items-center gap-4 text-white/80 font-medium">
                     <span className="flex items-center gap-2"><Calendar size={16} className="text-[#51b749]"/> {new Date(event.targetDate).toLocaleDateString()}</span>
                     <span className="flex items-center gap-2"><Clock size={16} className="text-[#51b749]"/> {new Date(event.targetDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
               </div>
             )}
           </motion.div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <main className={"max-w-7xl mx-auto px-6 pb-16 gap-12"+(true && " grid grid-cols-1 lg:grid-cols-[1fr_350px]")}>
        
        {/* Left: Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-10">
           
           {/* Markdown Description */}
           <div className="prose-content">
             <div dangerouslySetInnerHTML={{ __html: mdParser.render(event.content || event.description || '> No details provided.') }} />
           </div>

           {/* Prizes Section */}
           {event.prizes && event.prizes.length > 0 && (
             <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy className="text-[#51b749]" size={20}/> Rewards
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {event.prizes.map((prize, i) => (
                      <div key={i} className="p-4 bg-[#111111] border border-white/10 rounded-xl flex items-center gap-4 group hover:border-[#51b749]/30 transition-colors">
                         <div className={`text-2xl font-bold ${i===0 ? 'text-yellow-400' : i===1 ? 'text-gray-300' : 'text-orange-400'}`}>#{i+1}</div>
                         <div className="text-white/80 font-medium group-hover:text-white">{prize}</div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {/* Rules Section */}
           {event.rules && event.rules.length > 0 && (
              <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl">
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Shield size={18} className="text-[#51b749]"/> Competition Rules
                 </h3>
                 <ul className="space-y-3">
                    {event.rules.map((rule, i) => (
                       <li key={i} className="flex gap-3 text-sm text-white/70">
                          <span className="text-[#51b749] font-bold mt-0.5">•</span>
                          {rule}
                       </li>
                    ))}
                 </ul>
              </div>
           )}
        </motion.div>

        {/* Right: Sticky Sidebar */}
        <aside className="space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Event Action Card */}
            <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl space-y-6 shadow-2xl shadow-black/50">
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                <Terminal size={14}/> Event Control
              </h3>
              
              <div className="space-y-4">
                 {/* Status Indicator */}
                 {!isPast && (<div className="flex gap-4 items-center">
                   <div className={`p-2 rounded-lg ${isLive ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-[#51b749]'}`}>
                      <Layers size={20}/>
                   </div>
                   <div>
                      <p className="text-xs text-white/50 uppercase font-bold">Status</p>
                      <p className="text-white font-medium capitalize">{event.status}</p>
                   </div>
                </div>)}

                {/* Venue */}
                <div className="flex gap-4 items-center">
                   <div className="p-2 bg-white/5 rounded-lg text-[#51b749]"><MapPin size={20}/></div>
                   <div>
                      <p className="text-xs text-white/50 uppercase font-bold">Location</p>
                      <p className="text-white font-medium">NIT Kurukshetra</p>
                   </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-3">
                {!isPast && (
                  <a href={event.regLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-[#13703a] hover:bg-[#1a8545] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#13703a]/20">
                    <Zap size={18}/> {isLive ? 'Join Now' : 'Register Team'} 
                  </a>
                )}

                {event.rulebooklink && (
                    <a href={event.rulebooklink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-black border border-white/10 hover:border-white/30 text-white/70 hover:text-white rounded-xl transition-all text-sm font-medium">
                       <Download size={16}/> Download Rulebook
                    </a>
                 )}
              </div>
            </div>

            {/* Meta Info */}
             <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl">
                 <div className="flex items-center justify-between text-sm text-white/60">
                    <span className="flex items-center gap-2"><Users size={14}/> Eligibility</span>
                    <span className="text-white">Open for All</span>
                 </div>
             </div>

          </div>
        </aside>
      </main>

      {/* --- REUSED MARKDOWN STYLES --- */}
      <style jsx global>{`
        .prose-content { color: #d4d4d8; font-size: 1.125rem; line-height: 1.8; }
        .prose-content h1, .prose-content h2, .prose-content h3 { color: #fff; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; }
        .prose-content h1 { font-size: 2rem; border-bottom: 1px solid #27272a; padding-bottom: 1rem; }
        .prose-content h2 { font-size: 1.5rem; }
.prose-content a {
  color: #51b749; /* accent green */
  text-decoration: none;
  border-bottom: 1px solid rgba(81, 183, 73, 0.4);
  transition: all 0.2s;

  /* allow long URLs and text to wrap */
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: normal;
}        .prose-content a:hover { color: #fff; border-color: #51b749; }
        .prose-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose-content li { margin-bottom: 0.5rem; }
        .prose-content code { background-color: #27272a; padding: 0.2rem 0.4rem; rounded: 4px; color: #51b749; font-size: 0.9em; font-family: monospace; }
        .prose-content img { border-radius: 12px; margin: 2rem 0; border: 1px solid #27272a; }
        .prose-content strong { color: #fff; font-weight: 700; }
        .prose-content blockquote { border-left: 4px solid #3f3f46; padding-left: 1rem; color: #a1a1aa; font-style: italic; }
      `}</style>
    </div>
  );
};

export default EventDetail;