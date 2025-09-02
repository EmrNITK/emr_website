import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import {
  fetchAllProjects
} from "../../api/apiService.js";

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [idx, setidx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const getProjects = async () => {
      try {
        setFetching(true);
        const projects = await fetchAllProjects();
        console.log("front:", projects);
        setProjects(projects.projects);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setFetching(false);
      }
    };
    getProjects();
  }, []);

  function handleNext() {
    if (idx < projects.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setidx(idx + 1);
        setIsTransitioning(false);
      }, 150);
    }
  }

  function handlePrev() {
    if (idx > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setidx(idx - 1);
        setIsTransitioning(false);
      }, 150);
    }
  }

  return (
    <div className="min-h-screen max-w-screen overflow-hidden relative">

      {/* Loading overlay */}
      {fetching && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-white text-xl font-semibold">Loading Projects...</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen relative z-10">
        {/* Top section: Flex layout with OUR PROJECTS and Card */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start flex-1">
          {/* Left section: OUR PROJECTS */}
          <div className="lg:w-1/4 w-full flex-shrink-0 p-2 sm:p-4 rounded-xl text-white flex flex-col justify-center items-center lg:min-h-[600px] group">
            <div className="text-center relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-3xl blur-2xl group-hover:from-blue-500/30 group-hover:to-cyan-300/30 transition-all duration-700 scale-110"></div>
              
              <div className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight">
                <div className="animate-fade-in-up bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500">
                  OUR
                </div>
                <div className="animate-fade-in-up animation-delay-300 bg-gradient-to-r from-cyan-200 via-blue-100 to-white bg-clip-text text-transparent hover:scale-105 transition-transform duration-500">
                  PROJECTS
                </div>
              </div>
              
              {/* Animated underline */}
              <div className="mt-4 h-1 w-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mx-auto group-hover:w-full transition-all duration-1000"></div>
            </div>

            {/* Project counter */}
            {projects.length > 0 && (
              <div className="mt-8 text-center animate-fade-in animation-delay-600">
                <div className="text-sm text-blue-200 mb-2">Project</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {idx + 1}
                </div>
                <div className="text-sm text-blue-200">of {projects.length}</div>
                
                {/* Progress bar */}
                <div className="w-24 h-2 bg-blue-900/50 rounded-full mx-auto mt-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((idx + 1) / projects.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Right section: Card only */}
          <div className="lg:w-3/4 w-full flex flex-col items-center justify-center">
            <div className={`w-full transition-all duration-300 ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
              <ProjectCard project={projects[idx]} />
            </div>

            {/* Navigation Buttons - Right below the card */}
            <div className="w-full flex justify-center mt-3 sm:mt-4 lg:mt-6 animate-fade-in-up animation-delay-800">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePrev}
                  disabled={idx === 0}
                  className="group relative w-20 sm:w-24 md:w-28 lg:w-32 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:hover:shadow-none flex-shrink-0 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-1">
                    <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
                    Previous
                  </span>
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={idx === projects.length - 1}
                  className="group relative w-20 sm:w-24 md:w-28 lg:w-32 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 disabled:hover:shadow-none flex-shrink-0 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-1">
                    Next
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ProjectPage;