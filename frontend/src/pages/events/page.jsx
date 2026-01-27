import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, MapPin, ExternalLink, 
  Trophy, Zap, Clock, ArrowRight,
  Shield, Info, CheckCircle, AlertCircle,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG ---
const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

// --- HOOKS ---
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

// --- UI COMPONENTS ---

const Badge = ({ children, color = "default", className = "" }) => {
  const styles = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wide flex items-center gap-1.5 ${styles[color]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const base = "px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const styles = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/50",
    outline: "bg-transparent border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white",
    disabled: "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed",
  };
  
  return (
    <button className={`${base} ${props.disabled ? styles.disabled : styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const SmartImage = ({ src, alt }) => (
  <div className="relative w-full h-full overflow-hidden bg-slate-900">
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-40 blur-2xl scale-125"
      style={{ backgroundImage: `url(${src || '/placeholder.png'})` }}
    />
    <img 
      src={src || "https://via.placeholder.com/600x400?text=Event"} 
      alt={alt} 
      className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" 
    />
  </div>
);

const Countdown = ({ targetDate }) => {
  const time = useCountdown(targetDate);
  return (
    <div className="flex items-center gap-3 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-800">
      {Object.entries(time).map(([unit, val]) => (
        <div key={unit} className="flex flex-col items-center min-w-[30px]">
          <span className="text-lg font-bold text-white leading-none font-mono">
            {val.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-500 uppercase font-semibold mt-1">{unit}</span>
        </div>
      ))}
    </div>
  );
};

// --- SKELETON LOADER ---

const EventSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row w-full rounded-2xl overflow-hidden bg-slate-900/30 animate-pulse">
      {/* Image Skeleton */}
      <div className="md:w-5/12 h-64 md:h-auto bg-slate-800/50 border-b md:border-b-0 md:border-r border-slate-800" />
      
      {/* Details Skeleton */}
      <div className="md:w-7/12 p-6 md:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-3 w-full max-w-md">
            <div className="h-8 bg-slate-800 rounded-lg w-3/4" />
            <div className="h-4 bg-slate-800/60 rounded-md w-1/2" />
          </div>
          <div className="hidden lg:block h-16 w-36 bg-slate-800 rounded-lg" />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 pb-2">
          <div className="h-4 w-16 bg-slate-800 rounded" />
          <div className="h-4 w-16 bg-slate-800/50 rounded" />
          <div className="h-4 w-16 bg-slate-800/50 rounded" />
        </div>

        {/* Content Body */}
        <div className="space-y-3 flex-1">
          <div className="h-4 bg-slate-800/60 rounded w-full" />
          <div className="h-4 bg-slate-800/60 rounded w-5/6" />
          <div className="h-4 bg-slate-800/60 rounded w-4/6" />
          
          <div className="flex gap-4 pt-2">
            <div className="h-8 w-32 bg-slate-800 rounded-md" />
            <div className="h-8 w-32 bg-slate-800 rounded-md" />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-800/50 flex items-center justify-between">
          <div className="h-4 w-32 bg-slate-800/50 rounded" />
          <div className="h-10 w-36 bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// --- EVENT CARD ---

const EventCard = ({ event }) => {
  const [tab, setTab] = useState('overview');
  const isLive = event.status === 'LIVE';
  const isPast = event.status === 'completed';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative flex flex-col md:flex-row w-full backdrop-blur-sm border rounded-2xl overflow-hidden transition-all duration-300 border-rose-500/30 hover:border-rose-500/50`}
    >
      {/* Image Section */}
      <div className="md:w-5/12 min-h-[280px] relative border-b md:border-b-0 md:border-r border-slate-800">
        <SmartImage src={event.posterUrl || event.image} alt={event.title} />
        
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {isLive && (
            <Badge color="rose" className="shadow-lg shadow-rose-900/20 backdrop-blur-md bg-slate-900/80">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Live Now
            </Badge>
          )}
          {isPast && <Badge color="default" className="bg-slate-900/90">Ended</Badge>}
          {!isLive && !isPast && <Badge color="indigo" className="bg-slate-900/90">Upcoming</Badge>}
        </div>
      </div>

      {/* Details Section */}
      <div className="md:w-7/12 p-6 md:p-8 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{event.title}</h3>
            <p className="text-slate-400 text-sm font-medium">{event.tagline || "Technical Competition"}</p>
          </div>
          {!isPast && <div className="hidden lg:block"><Countdown targetDate={event.targetDate} /></div>}
        </div>

        {/* Navigation */}
        <div className="flex gap-6 border-b border-slate-800 mb-6">
          {['overview', 'rules', 'prizes'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 text-sm font-medium capitalize transition-colors relative ${tab === t ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {t}
              {tab === t && (
                <motion.div layoutId={`tab-${event._id}`} className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[100px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab === 'overview' && (
                <div className="space-y-4">
                  <p className="text-slate-400 text-sm leading-relaxed">{event.description}</p>
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-md">
                      <Calendar size={14} className="text-indigo-400" />
                      {new Date(event.targetDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-md">
                      <MapPin size={14} className="text-indigo-400" />
                      NIT Kurukshetra
                    </div>
                  </div>
                </div>
              )}

              {tab === 'rules' && (
                <div>
                  <ul className="grid gap-2">
                    {(event.rules || []).map((rule, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                        <Info size={14} className="mt-0.5 text-slate-600 shrink-0" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                  {event.rulebooklink && (
                    <a href={event.rulebooklink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:underline mt-3">
                      <Download size={12}/> Download Official Rulebook
                    </a>
                )}
                </div>
              )}
              

              {tab === 'prizes' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(event.prizes || []).map((prize, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30 border border-slate-800">
                      <div className={`p-2 rounded-full ${i === 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-700/30 text-slate-400'}`}>
                        <Trophy size={14} />
                      </div>
                      <span className="text-sm font-medium text-slate-300">{prize}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
          {isPast ? (
            <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Shield size={14} /> Registration Closed
            </span>
          ) : (
            <>
              <span className="hidden sm:block text-xs text-slate-500">
                {isLive ? "Competition currently in progress." : "Limited slots available."}
              </span>
              <a href={event.regLink} target="_blank" rel="noreferrer">
                <Button variant={isLive ? "primary" : "outline"} className={isLive ? "bg-rose-600 hover:bg-rose-500 border-rose-500 shadow-rose-900/20" : ""}>
                  {isLive ? "Join Now" : "Register Team"} <ArrowRight size={14} />
                </Button>
              </a>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN PAGE ---

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/events`)
      .then(res => setEvents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const live = events.filter(e => e.status === 'LIVE');
  const upcoming = events.filter(e => e.status === 'upcoming');
  const past = events.filter(e => e.status === 'completed');

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Hero Section - Always visible now */}
      <header className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-medium">
          <Trophy size={14} className="text-indigo-500" />
          Competitions & Hackathons
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
          Shape the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Future</span>
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Participate in premier technical events. Challenge yourself, win prizes, and connect with the community.
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-32 max-w-6xl mx-auto space-y-20">
        
        {loading ? (
          // SKELETON LOADING STATE
          <section className="space-y-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-800/50 rounded-lg animate-pulse">
                <div className="w-5 h-5 bg-slate-700 rounded" />
              </div>
              <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="grid gap-10">
              <EventSkeleton />
              <EventSkeleton />
              <EventSkeleton />
            </div>
          </section>
        ) : (
          // LOADED CONTENT
          <>
            {/* Live Events */}
            {live.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-rose-500/10 rounded-lg">
                    <Zap className="text-rose-500" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Happening Now</h2>
                </div>
                <div className="grid gap-10">
                  {live.map(e => <EventCard key={e._id} event={e} />)}
                </div>
              </section>
            )}

            {/* Upcoming Events */}
            {upcoming.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Clock className="text-indigo-500" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Upcoming</h2>
                </div>
                <div className="grid gap-10">
                  {upcoming.map(e => <EventCard key={e._id} event={e} />)}
                </div>
              </section>
            )}

            {/* Past Events */}
            {past.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-slate-800/50 rounded-lg">
                    <CheckCircle className="text-slate-500" size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-300">Past Events</h2>
                </div>
                <div className="grid gap-10 transition-opacity">
                  {past.map(e => <EventCard key={e._id} event={e} />)}
                </div>
              </section>
            )}

            {events.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="text-slate-500" size={24} />
                </div>
                <h3 className="text-lg font-medium text-white">No Events Found</h3>
                <p className="text-slate-500 mt-1">Check back later for updates.</p>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default EventsPage;