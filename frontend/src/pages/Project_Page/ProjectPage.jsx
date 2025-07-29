import React from 'react'
import ProjectCard from './ProjectCard'

const ProjectPage = () => {
  return (
      <div className="flex flex-col lg:flex-row px-4 lg:px-12 py-8 gap-6 items-start">
      
      {/* Left side - Tags or Sidebar */}
      <div className="lg:w-1/4 lg:h-[75vh] w-full lg:my-6   p-4 rounded-xl text-white text-4xl  lg:text-7xl  flex flex-col justify-center items-center">
        <span>OUR</span>
        <span>PROJECTS</span>
        
      </div>

      {/* Right side - Main content area */}
      <div className="lg:w-3/4 w-full lg:h-[75vh]  ">
        <ProjectCard />
      </div>
      

    </div>
  )
}

export default ProjectPage
