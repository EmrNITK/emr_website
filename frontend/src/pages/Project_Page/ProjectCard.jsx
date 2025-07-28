import React from "react";
import image1 from "./Images/i1.png";
import { Github } from "lucide-react";

const ProjectCard = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 my-6">
      <div className="bg-gradient-to-t from-[#0f1840] to-[#43b1ae] border border-white font-mono rounded-3xl overflow-hidden shadow-lg">
        {/* title & status */}
        <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Rubik's Cube Solver
          </h2>
          <button className="text-sm text-green-900 border border-yellow-400 rounded-md px-3 py-1 bg-green-500">
            Completed
          </button>
        </div>

        {/* main content */}
        <div className="flex flex-col md:flex-row p-5 gap-6">
          {/* left bigger div  */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 justify-between">
            {/* description  */}
            <p className="text-sm sm:text-base text-white leading-relaxed">
              Solves the cube autonomously using CV and ML algorithms. This
              project uses computer vision to detect the cube state and machine
              learning for solving. It combines real-time processing with
              intelligent decision-making.
            </p>

            {/* tech stacks  */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Tech Stack:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
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
                    className="bg-white text-black px-3 py-1 rounded-md text-center shadow-sm hover:bg-gray-100"
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
                // rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-700 rounded-md bg-blue-600 hover:bg-blue-700 text-white w-fit"
              >
                <Github size={18} />
                Learn More
              </a>
            </div>
          </div>

          {/* image sect */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <img
              src={image1}
              alt="Rubik's Cube Solver Screenshot"
              className="max-h-72 w-auto object-contain rounded-xl "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
