import React, { useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectCard2 from "./ProjectCard2";
import ProjectCard3 from "./ProjectCard3";

const ProjectPage = () => {
  const arr = [<ProjectCard />, <ProjectCard2 />, <ProjectCard3 />];
  const [idx, setidx] = useState(0);

  function handleNext() {
    if (idx < arr.length - 1) setidx(idx + 1);
  }

  function handlePrev() {
    if (idx > 0) setidx(idx - 1);
  }

  return (
    <div className="min-h-screen max-w-screen overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen">
        {/* Top section: Flex layout with OUR PROJECTS and Card */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start flex-1">
          {/* Left section: OUR PROJECTS */}
          <div className="lg:w-1/4 w-full flex-shrink-0 p-2 sm:p-4 rounded-xl text-white flex flex-col justify-center items-center lg:min-h-[600px]">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight">
                <div>OUR</div>
                <div>PROJECTS</div>
              </div>
            </div>
          </div>

          {/* Right section: Card only */}
          <div className="lg:w-3/4 w-full flex flex-col items-center justify-center">
            <div className="w-full">
              {arr[idx]}
            </div>
            
            {/* Navigation Buttons - Right below the card */}
            <div className="w-full flex justify-center mt-3 sm:mt-4 lg:mt-6">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3">
                <button
                  onClick={handlePrev}
                  disabled={idx === 0}
                  className="w-20 sm:w-24 md:w-28 lg:w-32 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-t from-[#0f1840] to-[#43b1ae] text-white rounded-lg disabled:opacity-50 text-xs sm:text-sm transition-all hover:shadow-md disabled:cursor-not-allowed flex-shrink-0"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={idx === arr.length - 1}
                  className="w-20 sm:w-24 md:w-28 lg:w-32 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-t from-[#0f1840] to-[#43b1ae] text-white rounded-lg disabled:opacity-50 text-xs sm:text-sm transition-all hover:shadow-md disabled:cursor-not-allowed flex-shrink-0"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;