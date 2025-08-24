import React, { useState } from "react";
import { Plus, Edit2 } from "lucide-react";

const ProjectGalleryPage = () => {
  const [projects, setProjects] = useState([
    { id: 1, title: "Rubik's Cube Solver", image: "/images/rubiks.png" },
    { id: 2, title: "AI Chatbot", image: "/images/chatbot.png" },
    { id: 3, title: "Weather App", image: "/images/weather.png" },
  ]);
//  edit project
  const handleEdit = (id) => {
    const newTitle = prompt("Enter new project title:");
    if (newTitle) {
      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === id ? { ...proj, title: newTitle } : proj
        )
      );
    }
  };

  // add new project
  const handleAdd = () => {
    const newTitle = prompt("Enter project title:");
    const newImage = prompt("Enter image URL:");
    if (newTitle && newImage) {
      setProjects((prev) => [
        ...prev,
        { id: Date.now(), title: newTitle, image: newImage },
      ]);
    }
  };

  return (
    <div className="flex flex-col px-4 lg:px-12 py-8 gap-6">
      {/* Big card */}
      <div className="bg-gradient-to-t from-[#0f1840] to-[#43b1ae] rounded-3xl shadow-xl border border-white p-6 w-full min-h-[75vh] flex flex-col">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Our Projects
        </h1>

        {/* grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              <img
                src={proj.image}
                alt={proj.title}
                className="h-40 object-cover w-full"
              />
              <div className="p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {proj.title}
                </h2>
                <button
                  onClick={() => handleEdit(proj.id)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </div>
          ))}
{/* 
          adding new cards */}
          <div
            onClick={handleAdd}
            className="flex flex-col items-center justify-center border-2 border-dashed border-white text-white rounded-2xl cursor-pointer hover:bg-white/10 transition"
          >
            <Plus size={40} />
            <span className="mt-2 text-lg font-medium">Add New</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGalleryPage;
