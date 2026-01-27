import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Github, ExternalLink, GitBranch, Folder, 
  ArrowUpRight, Calendar, Layers,
  Code2, Cpu, Globe, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_BASE_URL+'/api';

// --- UI COMPONENTS ---

const SmartImage = ({ src, alt }) => (
  <div className="relative w-full h-full overflow-hidden bg-zinc-900 group-hover:bg-zinc-800 transition-colors">
    {/* Blurred Background */}
    <div 
      className="absolute inset-0 bg-cover bg-center opacity-30 blur-xl scale-110"
      style={{ backgroundImage: `url(${src || '/placeholder.png'})` }}
    />
    {/* Actual Image */}
    <img 
      src={src || "https://via.placeholder.com/800x400?text=Project"} 
      alt={alt} 
      className="relative z-10 w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105" 
    />
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    completed: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    ongoing: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    archived: "bg-zinc-800 border-zinc-700 text-zinc-400",
  };

  const currentStyle = styles[status] || styles.archived;
  const isOngoing = status === 'ongoing';

  return (
    <span className={`
      flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md text-[10px] font-bold uppercase tracking-wider shadow-lg
      ${currentStyle}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'completed' ? 'bg-emerald-400' : isOngoing ? 'bg-amber-400 animate-pulse' : 'bg-zinc-500'}`}></span>
      {status}
    </span>
  );
};

const FilterPill = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`
      relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 border
      ${active 
        ? "bg-violet-600/20 border-violet-500 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
        : "bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
      }
    `}
  >
    {label}
    {count !== undefined && (
      <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[9px] ${active ? 'bg-violet-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
        {count}
      </span>
    )}
  </button>
);

// --- SKELETON LOADER ---

const ProjectSkeleton = () => (
  <div className="flex flex-col h-full bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
    {/* Image Placeholder */}
    <div className="h-56 bg-zinc-800/50 border-b border-white/5" />

    {/* Content Placeholder */}
    <div className="p-6 flex flex-col flex-grow gap-4">
      
      {/* Title & Icon */}
      <div className="flex justify-between items-start">
        <div className="h-7 bg-zinc-800 rounded w-3/4" />
        <div className="h-5 w-5 bg-zinc-800 rounded" />
      </div>

      {/* Description Lines */}
      <div className="space-y-2 mb-2">
        <div className="h-4 bg-zinc-800/60 rounded w-full" />
        <div className="h-4 bg-zinc-800/60 rounded w-5/6" />
      </div>

      {/* Tech Stack Pills */}
      <div className="flex gap-2">
         <div className="h-6 w-16 bg-zinc-800/50 rounded-md" />
         <div className="h-6 w-20 bg-zinc-800/50 rounded-md" />
         <div className="h-6 w-12 bg-zinc-800/50 rounded-md" />
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="h-4 w-24 bg-zinc-800/50 rounded" />
        <div className="h-4 w-16 bg-zinc-800/50 rounded" />
      </div>
    </div>
  </div>
);

// --- PROJECT CARD ---

const ProjectCard = ({ project, index }) => {
  const techStack = project.techStack || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/p/projects/${project.slug}`} className="group relative flex flex-col h-full">
        <div className="relative h-full bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)] flex flex-col">
          
          {/* Image Header */}
          <div className="relative h-56 border-b border-white/5 overflow-hidden">
            <SmartImage src={project.image || project.posterImg} alt={project.title} />
            <div className="absolute top-3 right-3 z-20">
              <StatusBadge status={project.status} />
            </div>
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
          </div>

          {/* Content Body */}
          <div className="p-6 flex flex-col flex-grow relative z-20">
            
            {/* Title & Icons */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors line-clamp-1 pr-4">
                {project.title}
              </h3>
              <ArrowUpRight size={18} className="text-zinc-600 group-hover:text-violet-400 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
            </div>

            {/* Description */}
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-grow">
               {project.description?.replace(/[#*`_]/g, '') || "No description available."}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {techStack.slice(0, 3).map((tech, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/50 border border-white/5 text-[10px] font-mono text-zinc-300 uppercase">
                  {i === 0 && <Code2 size={10} className="text-violet-400" />}
                  {tech}
                </div>
              ))}
              {techStack.length > 3 && (
                <span className="text-[10px] text-zinc-600 font-mono pl-1">
                  +{techStack.length - 3}
                </span>
              )}
            </div>

            {/* Footer Meta */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
               <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  <Folder size={12} className="text-violet-500/70"/> 
                  {project.category || 'Engineering'}
               </div>
               
               {/* Optional: Add GitHub link if available in project object */}
               {project.githubLink && (
                 <div className="flex items-center gap-1 text-xs text-zinc-600 group-hover:text-white transition-colors">
                   <Github size={12} /> Source
                 </div>
               )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- MAIN PAGE ---

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/projects`);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = projects.filter(p => 
    filter === 'all' ? true : p.status === filter
  );

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
         <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-violet-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-32">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-24">
          <div className="max-w-3xl space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/30 border border-violet-500/20 text-violet-300 text-xs font-mono tracking-widest uppercase"
            >
               <GitBranch size={12}/> 
               Project Repository
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white tracking-tighter"
            >
              Innovation <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Pipeline</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-zinc-400 text-lg leading-relaxed max-w-xl"
            >
              Explore our open-source hardware engineering and software systems. 
              From autonomous drones to embedded AI solutions.
            </motion.p>
          </div>

          {/* Filter Bar */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
             className="flex flex-wrap gap-3 p-1.5 bg-zinc-900/80 backdrop-blur-md border border-white/5 rounded-full"
          >
             {['all', 'completed', 'ongoing'].map((status) => (
               <FilterPill 
                 key={status} 
                 label={status} 
                 active={filter === status} 
                 onClick={() => setFilter(status)}
                 count={status === 'all' ? projects.length : projects.filter(p => p.status === status).length}
               />
             ))}
          </motion.div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // SKELETON STATE
            <>
              {[...Array(6)].map((_, i) => (
                <ProjectSkeleton key={i} />
              ))}
            </>
          ) : (
            // DATA STATE
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-32 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20 mt-8"
          >
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-600">
               <Folder size={32} />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">No Projects Found</h3>
            <p className="text-zinc-500 text-sm">There are no projects matching the current filter.</p>
          </motion.div>
        )}

      </main>
    </div>
  );
};

export default ProjectsPage;