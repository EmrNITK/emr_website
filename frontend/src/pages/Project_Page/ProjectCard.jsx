import React, { useState, useEffect } from "react";
import { Github, ExternalLink, Star, Code, Calendar } from "lucide-react";


const ProjectCard = ({ project }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredTech, setHoveredTech] = useState(null);

  console.log("ProjectCard received:", project);

  useEffect(() => {
    if (project) {
      setIsVisible(false);
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => clearTimeout(timer);
    }
  }, [project]);

  if (!project) {
    console.log("huu");
    return (
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg flex items-center justify-center min-h-[500px] sm:min-h-[600px] lg:min-h-[550px]">
          <div className="text-white/60 text-lg">No project data available</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500 border-emerald-400 text-emerald-900';
      case 'in progress':
        return 'bg-amber-500 border-amber-400 text-amber-900';
      default:
        return 'bg-gray-300 border-gray-400 text-gray-800';
    }
  };

  // Function to get dynamic font size based on text length
  const getTechFontSize = (tech) => {
    const length = tech.length;
    if (length <= 6) return 'text-xs sm:text-sm md:text-base';
    if (length <= 10) return 'text-xs sm:text-sm';
    if (length <= 15) return 'text-xs';
    return 'text-xs';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <div className={`group relative bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-cyan-900/90 backdrop-blur-sm border border-cyan-400/30 font-mono rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[500px] sm:min-h-[600px] lg:min-h-[550px] transition-all duration-700 hover:shadow-cyan-500/20 hover:border-cyan-400/50 ${isVisible ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-95'}`}>
        
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-teal-400/20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Title & Status */}
        <div className="relative p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text leading-tight hover:scale-105 transition-transform duration-300 cursor-default">
            {project.name}
          </h2>
          
          <div className="flex items-center gap-2">
            <div className={`text-xs sm:text-sm md:text-base ${getStatusColor(project.status)} border rounded-full px-3 sm:px-4 py-1.5 flex-shrink-0 whitespace-nowrap font-semibold transition-all duration-300 hover:scale-105 shadow-lg`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                {project.status}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative flex flex-col lg:flex-row p-3 sm:p-4 lg:p-5 gap-4 sm:gap-6 flex-1 min-h-0">
          
          {/* Left Textual Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6 justify-between min-h-0">
            
            {/* Description */}
            <div className="group/desc">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 leading-relaxed flex-shrink-0 transition-all duration-300 group-hover/desc:text-white">
                {project.description}
              </p>
              <div className="h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-500 group-hover/desc:w-full mt-2 rounded-full"></div>
            </div>

            {/* Tech Stack */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Code className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white">
                  Tech Stack:
                </h3>
              </div>
              
              {project.techStack && project.techStack.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {project.techStack.map((tech, idx) => (
                    <button
                      key={idx}
                      onMouseEnter={() => setHoveredTech(idx)}
                      onMouseLeave={() => setHoveredTech(null)}
                      className={`group/tech relative bg-white/90 backdrop-blur-sm text-slate-800 px-2 sm:px-3 py-2 rounded-lg text-center shadow-lg hover:shadow-xl transition-all duration-300 font-medium transform hover:scale-105 hover:-translate-y-1 border border-white/50 min-h-[2.5rem] flex items-center justify-center overflow-hidden ${hoveredTech === idx ? 'bg-gradient-to-r from-cyan-100 to-blue-100 shadow-cyan-200' : ''}`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover/tech:opacity-100 transition-opacity duration-300"></div>
                      <span className={`relative leading-tight text-center break-words hyphens-auto ${getTechFontSize(tech)}`}>
                        {tech}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-blue-200 text-sm">No tech stack provided</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex gap-3">
              <a
                href={project.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 border border-blue-600/50 rounded-xl bg-gradient-to-r from-blue-600/80 to-blue-700/80 backdrop-blur-sm hover:from-blue-500 hover:to-blue-600 text-white text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                <Github size={16} className="sm:w-5 sm:h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                <span className="relative">View Code</span>
              </a>

              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 border border-cyan-600/50 rounded-xl bg-gradient-to-r from-cyan-600/80 to-cyan-700/80 backdrop-blur-sm hover:from-cyan-500 hover:to-cyan-600 text-white text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <ExternalLink size={16} className="sm:w-5 sm:h-5 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span className="relative">Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Image Section */}
          <div className="w-full lg:w-1/2 relative flex items-center justify-center min-h-0 mt-4 lg:mt-0 group/image">
            <div className="relative w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] aspect-square">
              
              {/* Multiple glowing rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-2xl animate-pulse group-hover/image:from-cyan-400/40 group-hover/image:to-blue-400/40 transition-all duration-700"></div>
              <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-400/20 to-teal-400/20 blur-xl animate-pulse animation-delay-1000 group-hover/image:from-blue-300/30 group-hover/image:to-teal-300/30 transition-all duration-700"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-r from-teal-300/15 to-cyan-300/15 blur-lg animate-pulse animation-delay-2000 group-hover/image:from-teal-200/25 group-hover/image:to-cyan-200/25 transition-all duration-700"></div>
              
              {/* Floating particles */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400/60 rounded-full blur-sm animate-bounce opacity-0 group-hover/image:opacity-100 transition-opacity duration-700"
                    style={{
                      left: `${20 + (i * 12)}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: '3s'
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Image container */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-4 transform group-hover/image:scale-105 transition-transform duration-500">
                <div className="relative">
                  <img
                    src={project.projectImg}
                    alt={project.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-2xl transition-all duration-500 group-hover/image:shadow-cyan-500/30"
                  />
                  
                  {/* Image overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-cyan-900/20 rounded-xl opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              
              {/* Rotating border */}
              <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-teal-400/50 rounded-full bg-clip-border opacity-0 group-hover/image:opacity-100 transition-opacity duration-700 animate-spin" style={{ animationDuration: '8s' }}></div>
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
      </div>

      <style jsx>{`
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default ProjectCard;