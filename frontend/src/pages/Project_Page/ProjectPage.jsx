import React from "react";
import ProjectCard from "./ProjectCard";

const ProjectPage = () => {
  return (
    <div className="flex flex-col lg:flex-row px-4 lg:px-12 py-8 gap-6 items-start">
      {/* Left side - Tags or Sidebar */}
      <div className="lg:w-1/4 lg:h-[75vh] w-full lg:my-6 p-4 rounded-xl text-white text-4xl lg:text-7xl flex flex-col justify-center items-center">
        <span>OUR</span>
        <span>PROJECTS</span>
      </div>

      {/* Right side - Main content area */}
      <div className="lg:w-3/4 w-full lg:h-[75vh] flex flex-col items-center">
        <ProjectCard />

        {/* Buttons Below the ProjectCard */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center w-full sm:w-fit mx-auto">
  <button className="w-30 sm:w-40 px-6 py-2 bg-gradient-to-t from-[#0f1840] to-[#43b1ae] text-black rounded hover:bg-gray-200 font-medium">
    Previous
  </button>
  <button className="w-30 sm:w-40 px-6 py-2 bg-gradient-to-t from-[#0f1840] to-[#43b1ae] text-black rounded hover:bg-gray-200 font-medium">
    Next
  </button>
</div>

      </div>
    </div>
  );
};

export default ProjectPage;
