import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Calendar, Clock, MapPin, 
  ExternalLink, Layers, Loader2, AlertCircle, 
  Terminal, Share2, Users
} from 'lucide-react';
import { Upcoming } from '@mui/icons-material';

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

// Markdown Parser
const mdParser = new MarkdownIt({ html: true, linkify: true, typographer: true });

const WorkshopDetail = () => {
  const { slug } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/workshops`);
        // Simulating backend filtering by slug
        const found = res.data.find(w => w.slug === slug);
        if(found) setWorkshop(found);
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

  if (error || !workshop) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-6">
      <AlertCircle size={48} className="text-[#51b749]"/>
      <h2 className="text-2xl font-bold">Workshop Not Found</h2>
      <Link to="/p/workshops" className="px-6 py-2 rounded-full bg-[#51b749] text-black font-bold">Back to Hub</Link>
    </div>
  );

  const isUpcoming = workshop.status === 'upcoming';

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] w-full overflow-hidden mt-24">
        <div className="absolute inset-0">
          <img src={workshop.image} className="w-full h-full object-cover" alt="Cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30"></div>
          <div className="absolute inset-0 bg-[#13703a]/20 mix-blend-overlay"></div>
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
           <Link to="/p/workshops" className="absolute top-8 left-6 flex items-center gap-2 text-white/70 hover:text-white bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all">
              <ArrowLeft size={16}/> <span className="text-xs font-bold uppercase">All Workshops</span>
           </Link>
           
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
             {isUpcoming && (<div className="flex gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${isUpcoming ? 'bg-[#51b749]/20 border-[#51b749] text-[#51b749]' : 'bg-white/10 border-white/20 text-white/60'}`}>
                   Open Registration
                </span>
             </div>)}
             <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">{workshop.title}</h1>
           </motion.div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <main className={"max-w-7xl mx-auto px-6 pb-16 gap-12"+(isUpcoming && " grid grid-cols-1 lg:grid-cols-[1fr_350px]")}>
        
        {/* Left: Markdown Content */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
           <div className="prose-content">
             <div dangerouslySetInnerHTML={{ __html: mdParser.render(workshop.content || workshop.description || '> No details provided.') }} />
           </div>
        </motion.div>

        {/* Right: Sticky Sidebar */}
        {isUpcoming && (<aside className="space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Event Details Card */}
            <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl space-y-6 shadow-2xl shadow-black/50">
              <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest flex items-center gap-2">
                <Terminal size={14}/> Session Logistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                   <div className="p-2 bg-white/5 rounded-lg text-[#51b749]"><Calendar size={20}/></div>
                   <div>
                      <p className="text-xs text-white/50 uppercase font-bold">Date</p>
                      <p className="text-white font-medium">{workshop.details?.date || 'TBA'}</p>
                   </div>
                </div>
                <div className="flex gap-4 items-start">
                   <div className="p-2 bg-white/5 rounded-lg text-[#51b749]"><Clock size={20}/></div>
                   <div>
                      <p className="text-xs text-white/50 uppercase font-bold">Time</p>
                      <p className="text-white font-medium">{workshop.details?.time || 'TBA'}</p>
                   </div>
                </div>
                <div className="flex gap-4 items-start">
                   <div className="p-2 bg-white/5 rounded-lg text-[#51b749]"><MapPin size={20}/></div>
                   <div>
                      <p className="text-xs text-white/50 uppercase font-bold">Venue</p>
                      <p className="text-white font-medium">{workshop.details?.venue || 'TBA'}</p>
                   </div>
                </div>
                 <div className="flex gap-4 items-start">
                   <div className="p-2 bg-white/5 rounded-lg text-[#51b749]"><Layers size={20}/></div>
                   <div>
                      <p className="text-xs text-white/50 uppercase font-bold">Prerequisites</p>
                      <p className="text-white font-medium text-sm">{workshop.details?.prereq || 'None'}</p>
                   </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                
                  <a href={workshop.regLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-[#13703a] hover:bg-[#1a8545] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#13703a]/20">
                    Register Now <ExternalLink size={18}/>
                  </a>
            
              </div>
            </div>

            {/* Share / Meta */}
             <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl">
                 <div className="flex items-center justify-between text-sm text-white/60">
                    <span className="flex items-center gap-2"><Users size={14}/> Capacity</span>
                    <span className="text-white">Limited Seats</span>
                 </div>
             </div>

          </div>
        </aside>)}
      </main>

      {/* Reuse Project Markdown Styles */}
      <style jsx global>{`
        .prose-content { color: #d4d4d8; font-size: 1.125rem; line-height: 1.8; }
        .prose-content h1, .prose-content h2, .prose-content h3 { color: #fff; font-weight: 700; margin-top: 2.5rem; margin-bottom: 1rem; }
        .prose-content h1 { font-size: 2rem; border-bottom: 1px solid #27272a; padding-bottom: 1rem; }
.prose-content a {
  color: #51b749; /* accent green */
  text-decoration: none;
  border-bottom: 1px solid rgba(81, 183, 73, 0.4);
  transition: all 0.2s;

  /* allow long URLs and text to wrap */
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: normal;
}    
      .prose-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose-content code { background-color: #27272a; padding: 0.2rem 0.4rem; rounded: 4px; color: #51b749; font-size: 0.9em; font-family: monospace; }
        .prose-content img { border-radius: 12px; margin: 2rem 0; border: 1px solid #27272a; }
      `}</style>
    </div>
  );
};

export default WorkshopDetail;