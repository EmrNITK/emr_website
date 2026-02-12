import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ArrowUpRight, Github, ExternalLink, Calendar, 
  User, Layers, Loader2, AlertCircle, Code2, Globe, Terminal
} from 'lucide-react';

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

// Initialize Parser
const mdParser = new MarkdownIt({
  html: true,       
  linkify: true,    
  typographer: true 
});

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Scroll to top on load
    window.scrollTo(0, 0);

    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API_URL}/projects`); 
        // Logic to find project by slug (Simulating backend filter)
        const found = res.data.find(p => p.slug === slug);
        
        if(found) {
            setProject(found);
        } else {
            setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#51b749]" size={40}/>
      <span className="text-white/60 text-xs font-mono uppercase tracking-widest animate-pulse">Loading Project Data...</span>
    </div>
  );

  if (error || !project) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-6">
      <div className="p-4 rounded-full bg-[#51b749]/10 text-[#51b749] border border-[#51b749]/20">
        <AlertCircle size={48}/>
      </div>
      <h2 className="text-2xl font-bold">Project Not Found</h2>
      <Link to="/p/projects" className="px-6 py-2 rounded-full bg-[#51b749] text-black font-medium hover:bg-[#38984c] transition-colors">
        Return to Repository
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#51b749]/30">
      
      {/* --- HERO SECTION --- */}
      <div className="relative h-[65vh] w-full overflow-hidden mt-24">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={project.image || project.posterImg || "https://via.placeholder.com/1920x1080"} 
            className="w-full h-full object-cover"
            alt="Cover"
          />
          {/* Layered Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"></div>
          <div className="absolute inset-0 bg-[#13703a]/10 mix-blend-overlay"></div>
        </div>

        {/* Header Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
           
           {/* Navigation */}
           <Link to="/p/projects" className="absolute top-8 left-6 md:left-6 flex items-center gap-2 text-white/70 hover:text-white transition-all bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-white/30 group z-50">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> 
              <span className="text-xs font-medium uppercase tracking-wide">Back</span>
           </Link>
           
           <motion.div 
             initial={{ opacity: 0, y: 30 }} 
             animate={{ opacity: 1, y: 0 }} 
             transition={{ duration: 0.7, ease: "easeOut" }}
             className="space-y-6 max-w-4xl"
           >
             {/* Metadata Badges */}
             <div className="flex flex-wrap gap-3 items-center">
               <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${project.status === 'completed' ? 'bg-[#51b749]/10 border-[#51b749]/30 text-[#51b749]' : 'bg-[#38984c]/10 border-[#38984c]/30 text-[#38984c]'}`}>
                 <span className={`inline-block w-2 h-2 rounded-full mr-2 ${project.status === 'completed' ? 'bg-[#51b749]' : 'bg-[#38984c] animate-pulse'}`}></span>
                 {project.status || 'Ongoing'}
               </span>
               <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#111111] border border-white/10 text-white/70 backdrop-blur-md">
                 <Layers size={12} /> {project.category || "Engineering"}
               </span>
             </div>
             
             {/* Title */}
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
               {project.title}
             </h1>

             {/* Tech Stack Row */}
             {project.techStack && project.techStack.length > 0 && (
               <div className="flex flex-wrap gap-2 pt-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs font-mono text-[#51b749] bg-[#13703a]/30 border border-[#51b749]/30 rounded backdrop-blur-sm">
                      {tech}
                    </span>
                  ))}
               </div>
             )}
           </motion.div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 lg:gap-20">
        
        {/* Left: Markdown Content */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3 }}
          className="min-w-0"
        >
           <div className="prose-content">
             {/* Render Markdown */}
             <div dangerouslySetInnerHTML={{ __html: mdParser.render(project.description || '> No detailed documentation provided.') }} />
           </div>
        </motion.div>

        {/* Right: Sticky Sidebar */}
        <aside className="space-y-8">
          <motion.div 
             initial={{ opacity: 0, x: 20 }} 
             animate={{ opacity: 1, x: 0 }} 
             transition={{ delay: 0.5 }}
             className="sticky top-24 space-y-6"
          >
            
            {/* Resources Card */}
            <div className="p-6 bg-[#111111] border border-white/5 backdrop-blur-sm rounded-2xl">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Terminal size={14}/> Project Access
              </h3>
              
              <div className="space-y-3">
                {/* Github Link */}
                {project.githubLink ? (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full p-4 bg-black border border-white/10 rounded-xl hover:border-[#51b749]/50 hover:shadow-[0_0_20px_rgba(81,183,73,0.1)] transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#111111] rounded-lg group-hover:bg-[#51b749] group-hover:text-black transition-colors">
                        <Github size={20}/>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white/80 group-hover:text-white">Repository</span>
                        <span className="text-xs text-white/50">View Source Code</span>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-white/40 group-hover:text-white"/>
                  </a>
                ) : (
                   <div className="p-4 bg-[#111111] border border-white/10 rounded-xl opacity-50 flex items-center gap-3 cursor-not-allowed">
                      <Github size={20} className="text-white/40"/> 
                      <span className="text-white/40 text-sm font-medium">Source Private</span>
                   </div>
                )}

                {/* Demo Link */}
                {project.demoLink && (
                  <a href={project.demoLink} target="_blank" rel="noreferrer" className="flex items-center justify-between w-full p-4 bg-[#13703a] border border-[#38984c] rounded-xl hover:bg-[#38984c] transition-all group shadow-lg shadow-[#13703a]/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg text-white">
                         <Globe size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white">Live Demo</span>
                        <span className="text-xs text-white/70">Launch Application</span>
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="text-white"/>
                  </a>
                )}
              </div>

              {/* Meta Info */}
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 flex items-center gap-2"><User size={14}/> Lead Team</span>
                  <span className="text-white font-medium">EMR Core</span>
                </div>
               
              </div>
            </div>

            {/* Quick Tech Summary */}
            {project.techStack && (
              <div className="p-6 border border-white/5 rounded-2xl bg-[#111111]">
                 <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Code2 size={14}/> Technologies Used
                 </h4>
                 <div className="flex flex-wrap gap-2">
                   {project.techStack.map(t => (
                     <span key={t} className="text-[11px] font-mono text-white/60 bg-black px-2 py-1 rounded border border-white/10">
                       {t}
                     </span>
                   ))}
                 </div>
              </div>
            )}

          </motion.div>
        </aside>
      </main>
      
      {/* --- MARKDOWN STYLING ENGINE --- */}
     <style jsx global>{`
        .prose-content {
          color: #d4d4d8; /* zinc-300 */
          font-size: 1.125rem;
          line-height: 1.8;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        /* Headers */
        .prose-content h1, .prose-content h2, .prose-content h3 {
          color: #fff;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .prose-content h1 { font-size: 2.25rem; padding-bottom: 1rem; border-bottom: 1px solid #27272a; }
        .prose-content h2 { font-size: 1.875rem; }
        .prose-content h3 { font-size: 1.5rem; color: #f4f4f5; }
        .prose-content p { margin-bottom: 1.5rem; color: #a1a1aa; }
        
        /* Links */
        .prose-content a {
          color: #51b749; /* accent green */
          text-decoration: none;
          border-bottom: 1px solid rgba(81, 183, 73, 0.4);
          transition: all 0.2s;
        }
        .prose-content a:hover { color: #fff; border-color: #51b749; }

        /* Images */
        .prose-content img {
          width: 100%;
          border-radius: 16px;
          border: 1px solid #27272a;
          margin: 2.5rem 0;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05), 0 20px 40px -10px rgba(0, 0, 0, 0.5);
        }

        /* Lists */
        .prose-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .prose-content li { margin-bottom: 0.5rem; color: #d4d4d8; }
        .prose-content li::marker { color: #52525b; }

        /* Blockquotes */
        .prose-content blockquote {
          border-left: 4px solid #38984c; /* secondary green */
          padding: 1rem 1.5rem;
          font-style: italic;
          color: #e4e4e7;
          background: rgba(56, 152, 76, 0.05);
          border-radius: 0 12px 12px 0;
          margin: 2rem 0;
        }

        /* Code Blocks */
        .prose-content pre {
          background-color: #09090b; 
          padding: 1.5rem;
          border-radius: 12px;
          overflow-x: auto; 
          border: 1px solid #27272a;
          margin: 2rem 0;
        }
        .prose-content code {
          background-color: #27272a;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          font-family: 'Menlo', 'Monaco', monospace;
          color: #51b749; /* accent green */
          font-size: 0.85em;
        }
        .prose-content pre code {
          background-color: transparent;
          padding: 0;
          color: #e4e4e7;
          border: none;
          font-size: 0.9em;
        }
        
        /* Tables */
        .prose-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2.5rem 0;
          font-size: 0.95rem;
        }
        .prose-content th {
          text-align: left;
          padding: 1rem;
          border-bottom: 1px solid #3f3f46;
          color: #fff;
          background-color: #18181b;
        }
        .prose-content td {
          padding: 1rem;
          border-bottom: 1px solid #27272a;
          color: #d4d4d8;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .prose-content { font-size: 1rem; }
          .prose-content h1 { font-size: 2rem; }
          .prose-content pre { margin: 1.5rem -1rem; border-radius: 0; border-left: 0; border-right: 0; }
          .prose-content table { display: block; overflow-x: auto; }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetail;