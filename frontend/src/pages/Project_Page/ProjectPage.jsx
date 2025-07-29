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
    <div className="flex flex-col px-4 lg:px-12 py-8 gap-6">
      {/* Top section: Flex layout with OUR PROJECTS and Card */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left section: OUR PROJECTS */}
        <div className="lg:w-1/4 lg:h-[75vh] w-full lg:my-6 p-4 rounded-xl text-white text-4xl lg:text-7xl flex flex-col justify-center items-center">
          <span>OUR</span>
          <span>PROJECTS</span>
        </div>

        {/* Right section: Card only */}
        <div className="lg:w-3/4 w-full lg:h-[75vh] flex items-center justify-center">
          {arr[idx]}
        </div>
      </div>

      {/* Responsive Navigation Buttons */}
    <div className="w-full flex justify-end">
      <div className="flex lg:w-3/4 w-full flex-col sm:flex-row justify-center items-center gap-4 mt-6">
     
        <button
          onClick={handlePrev}
          disabled={idx === 0}
          className="w-32 sm:w-36 md:w-40 px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={idx === arr.length - 1}
          className="w-32 sm:w-36 md:w-40 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
        >
          Next
        </button>
      </div>
      </div>
    </div>
  );
};

export default ProjectPage;
