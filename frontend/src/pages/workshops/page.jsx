import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, Clock, MapPin, ChevronRight, 
  Terminal, Cpu, Loader2, ArrowRight, Zap, Layers, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

// --- UI Primitives ---

const Badge = ({ children, color = "slate" }) => {
  const styles = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    slate: "bg-slate-800 text-slate-400 border-slate-700",
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
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/50",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent",
    disabled: "bg-slate-800 text-slate-600 border border-slate-700 cursor-not-allowed",
  };

  return (
    <button className={`${base} ${props.disabled ? styles.disabled : styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Smart Image (No Crop) ---
const SmartImage = ({ src, alt }) => (
  <div className="w-full h-full relative overflow-hidden bg-slate-900 rounded-xl border border-slate-800">
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
  <div className="w-full bg-slate-900/40 rounded-2xl p-6 border border-slate-800 animate-pulse flex flex-col lg:flex-row gap-8">
    <div className="w-full lg:w-5/12 aspect-video bg-slate-800 rounded-xl" />
    <div className="w-full lg:w-7/12 space-y-4">
      <div className="h-4 w-24 bg-slate-800 rounded-full" />
      <div className="h-10 w-3/4 bg-slate-800 rounded-lg" />
      <div className="space-y-2 pt-2">
         <div className="h-3 w-full bg-slate-800 rounded" />
         <div className="h-3 w-5/6 bg-slate-800 rounded" />
      </div>
    </div>
  </div>
);

// --- Workshop Card ---
const WorkshopCard = ({ data }) => {
  const details = data.details || { date: 'TBA', time: 'TBA', venue: 'TBA', prereq: 'None' };
  const isUpcoming = data.section === 'upcoming';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative backdrop-blur-sm border border-slate-800 hover:border-indigo-500/30 rounded-3xl overflow-hidden p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/10"
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Visual Section */}
        <div className="w-full lg:w-5/12 h-64 lg:h-80 shrink-0">
           <SmartImage src={data.posterImg} alt={data.title} />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-7/12 flex flex-col h-full">
          
          <div className="mb-4">
             {isUpcoming ? (
               <Badge color="indigo"><Zap size={10} className="fill-indigo-400" /> Open for Registration</Badge>
             ) : (
               <Badge color="slate"><CheckCircle size={10} /> Completed</Badge>
             )}
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
            {data.title}
          </h2>
          
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
            {data.description}
          </p>

          {/* Details Grid */}
          {isUpcoming && (
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 border-t border-b border-slate-800 py-4">
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400"><Calendar size={14} /></div>
                  <span>{details.date}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400"><Clock size={14} /></div>
                  <span>{details.time}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400"><MapPin size={14} /></div>
                  <span>{details.venue}</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400"><Layers size={14} /></div>
                  <span className="truncate" title={details.prereq}>{details.prereq || "No Prerequisites"}</span>
               </div>
            </div>
          )}

          <div className="mt-auto pt-2 flex items-center gap-4">
             {(data.regLink && isUpcoming) ? (
                 <a href={data.regLink} target="_blank" rel="noopener noreferrer">
                     <Button>Secure Your Seat <ArrowRight size={16} /></Button>
                 </a>
             ) : (
               <Button disabled>Registration Closed</Button>
             )}
          </div>
        </div>
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
    <div className="min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      <main className="relative z-10 pt-32 pb-24 max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto space-y-6">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium uppercase tracking-wider">
              <Terminal size={12} />
              Technical Training
           </div>
           <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Machines</span>
           </h1>
           <p className="text-slate-400 text-lg leading-relaxed">
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
            <div className="space-y-24">
                
                {/* Upcoming Section */}
                {upcomingWorkshops.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-8 ml-2">
                           <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                              <Zap className="text-indigo-500" size={20} />
                           </div>
                           <h3 className="text-2xl font-bold text-white">Upcoming Sessions</h3>
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
                           <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                              <Layers className="text-slate-400" size={20} />
                           </div>
                           <h3 className="text-2xl font-bold text-slate-300">Past Archives</h3>
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
                    <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                        <Cpu className="text-slate-600 mx-auto mb-4" size={32} />
                        <h3 className="text-lg font-bold text-white">No Workshops Scheduled</h3>
                        <p className="text-slate-500">Check back later for new learning opportunities.</p>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default WorkshopsPage;