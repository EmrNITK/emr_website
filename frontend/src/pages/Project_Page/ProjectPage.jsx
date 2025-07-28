import React from 'react'
import ProjectCard from './ProjectCard'

const ProjectPage = () => {
  return (
      <div className="flex flex-col lg:flex-row px-4 lg:px-12 py-8 gap-6">
      
      {/* Left side - Tags or Sidebar */}
      <div className="lg:w-1/4 w-full bg-gray-800 p-4 rounded-xl text-white">
        <h2 className="text-xl font-bold mb-4">Project Tags</h2>
        <ul className="space-y-2 text-sm">
          <li>#ML</li>
          <li>#ComputerVision</li>
          <li>#React</li>
          <li>#OpenCV</li>
        </ul>
      </div>

      {/* Right side - Main content area */}
      <div className="lg:w-3/4 w-full">
        <ProjectCard />
      </div>

    </div>
  )
}

export default ProjectPage
