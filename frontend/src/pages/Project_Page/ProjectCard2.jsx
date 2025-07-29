import React from "react";
import image1 from "./Images/Car.png";
import { Github } from "lucide-react";

const ProjectCard2 = () => {
  return (
    <div className="w-full px-4 h-full sm:px-6 md:px-8 lg:px-12 my-6">
      <div className="bg-gradient-to-t from-[#0f1840] to-[#43b1ae] border border-white font-mono rounded-3xl overflow-hidden shadow-lg min-h-full flex flex-col">
        {/* title & status */}
        <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 flex-1">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Gesture Controlled Car
          </h2>
          <button className="text-sm sm:text-base text-green-900 border border-yellow-400 rounded-md px-3 py-1 bg-green-500">
            Completed
          </button>
        </div>

        {/* main content */}
        <div className="flex flex-col md:flex-row p-5 gap-6 flex-1">
          {/* left textual content */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 justify-between">
            {/* description */}
            <p className="text-base sm:text-lg md:text-xl lg:text-xl text-white leading-relaxed">
              A wireless gesture-controlled car that moves based on hand motions. 
              It uses accelerometer data transmitted via RF modules to control 
              motors in real time, making it an innovative project in robotics 
              and embedded systems.
            </p>

            {/* tech stacks */}
            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3">
                Tech Stack:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base">
                {[
                  "Arduino",
                  "RF Module",
                  "Motor Driver",
                  "Accelerometer",
                  "Embedded C",
                  "Hardware Design",
                ].map((tech, idx) => (
                  <button
                    key={idx}
                    className="bg-white text-black px-3 py-1 rounded-md text-center shadow-sm hover:bg-gray-100 transition-all"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* git btn */}
            <div className="mt-4">
              <a
                href="https://github.com/"
                target="_blank"
                className="flex items-center justify-center gap-2 px-5 py-3 border border-blue-700 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg w-fit transition-all"
              >
                <Github size={20} />
                Learn More
              </a>
            </div>
          </div>

          {/* right image */}
          <div className="w-full md:w-1/2 relative aspect-square max-w-[400px] mx-auto flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,180,80,0.4)_0%,rgba(0,180,80,0.2)_40%,transparent_100%)] z-0 blur-2xl"></div>

            <img
              src={image1}
              alt="Gesture Controlled Car"
              className="max-h-60 sm:max-h-67 md:max-h-72 lg:max-h-80 w-auto object-contain rounded-xl z-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard2;
