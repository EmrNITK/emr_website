import React from "react";
import image1 from "./Images/Rubiks.png";
import { Github } from "lucide-react";

const ProjectCard = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="bg-gradient-to-t from-[#0f1840] to-[#43b1ae] border border-white font-mono rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg flex flex-col min-h-[500px] sm:min-h-[600px] lg:min-h-[550px]">
        {/* title & status */}
        <div className="p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Rubik's Cube Solver
          </h2>
          <button className="text-xs sm:text-sm md:text-base text-green-900 border border-yellow-400 rounded-md px-2 sm:px-3 py-1 bg-green-500 flex-shrink-0 whitespace-nowrap">
            Completed
          </button>
        </div>

        {/* main content */}
        <div className="flex flex-col lg:flex-row p-3 sm:p-4 lg:p-5 gap-4 sm:gap-6 flex-1 min-h-0">
          {/* left textual content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 sm:gap-6 justify-between min-h-0">
            {/* description */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed flex-shrink-0">
              Solves the cube autonomously using CV and ML algorithms. This
              project uses computer vision to detect the cube state and machine
              learning for solving. It combines real-time processing with
              intelligent decision-making.
            </p>

            {/* tech stacks */}
            <div className="flex-1">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-white mb-2 sm:mb-3">
                Tech Stack:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm md:text-base">
                {[
                  "YOLO",
                  "OpenCV",
                  "ML Algorithm",
                  "TensorFlow",
                  "Python",
                  "React",
                ].map((tech, idx) => (
                  <button
                    key={idx}
                    className="bg-white text-black px-2 sm:px-3 py-1 rounded-md text-center shadow-sm hover:bg-gray-100 transition-all whitespace-nowrap"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* git btn */}
            <div className="flex-shrink-0">
              <a
                href="https://github.com/"
                target="_blank"
                className="flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-3 border border-blue-700 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base lg:text-lg w-fit transition-all"
              >
                <Github size={16} className="sm:w-5 sm:h-5" />
                Learn More
              </a>
            </div>
          </div>

          {/* right image */}
          <div className="w-full lg:w-1/2 relative flex items-center justify-center min-h-0 mt-4 lg:mt-0">
            <div className="relative w-full max-w-[300px] sm:max-w-[350px] lg:max-w-[400px] aspect-square">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,180,80,0.4)_0%,rgba(0,180,80,0.2)_40%,transparent_100%)] blur-2xl"></div>
              
              <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                <img
                  src={image1}
                  alt="Rubik's Cube Solver Screenshot"
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;