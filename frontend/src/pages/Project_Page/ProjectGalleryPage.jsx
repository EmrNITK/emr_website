import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Github, ExternalLink, Code, Calendar, Upload, X, ChevronDown } from "lucide-react"; 
import {
  fetchAllProjects,
  createProject,
  updateProject,
  deleteProject, 
} from "../../api/apiService.js";

const ProjectGalleryPage = () => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    gitHub: "",
    description: "",
    techStack: "",
    status: "",
    file: null,
  });

  // Status options for the dropdown
  const statusOptions = [
    { value: "", label: "Select Status", disabled: true },
    { value: "Not started", label: "Not Started" },
    { value: "In Progress", label: "In Progress" },
    { value: "Completed", label: "Completed" }
 
  ];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProjects();
        setProjects(data.projects || []);
      } catch (err) {
        console.error("Error loading projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("gitHub", formData.gitHub);
    data.append("description", formData.description);
    data.append("status", formData.status);

    // Send tech stack as array (not JSON string)
    formData.techStack.split(",").map((t) => t.trim()).forEach((tech) => {
      data.append("techStack", tech);
    });

    if (formData.file) {
  data.append("projectImg", formData.file);  // not "file"
}else if (isEditing) {
  // No new file, keep existing projectImg string
  const existing = projects.find(p => p._id === currentProjectId);
  if (existing?.projectImg) {
    data.append("projectImg", existing.projectImg);
  }
}

    // Debug
    for (let pair of data.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    if (isEditing) {
      const res = await updateProject(currentProjectId, data, true);
      const updatedProject = res.project;
      setProjects((prev) =>
        prev.map((proj) =>
          proj._id === currentProjectId ? updatedProject : proj
        )
      );
    } else {
      const createdRes = await createProject(data, true);
      const createdProject = createdRes.project || createdRes;
      setProjects((prev) => [...prev, createdProject]);
    }

    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentProjectId(null);
    setFormData({
      name: "",
      gitHub: "",
      description: "",
      techStack: "",
      status: "",
      file: null,
    });
  } catch (err) {
    console.error("Error submitting project:", err);
  }
};

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      gitHub: project.gitHub,
      description: project.description,
      techStack: Array.isArray(project.techStack)
        ? project.techStack.join(", ")
        : project.techStack,
      status: project.status,
      file: null,
    });
    setCurrentProjectId(project._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((proj) => proj._id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-emerald-500 text-emerald-100 border-emerald-400';
      case 'in progress':
        return 'bg-amber-500 text-amber-100 border-amber-400';
      case 'not started':
        return 'bg-gray-500 text-gray-100 border-gray-400';
      default:
        return 'bg-blue-500 text-blue-100 border-blue-400';
    }
  };

  return (
    <div className="flex flex-col px-4 lg:px-12 py-8 gap-6 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="text-white text-xl font-semibold">Loading Projects...</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-gradient-to-br from-slate-800/90 via-blue-900/80 to-cyan-900/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-cyan-400/30 p-6 w-full min-h-[75vh] flex flex-col group overflow-hidden">
        
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-teal-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>

        {/* Header */}
        <div className="relative mb-6 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text leading-tight animate-fade-in-up">
              Our Projects
            </h1>
          </div>
          
          {/* Project count badge */}
          <div className="ml-auto bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-cyan-400/50 animate-fade-in animation-delay-300">
            <span className="text-cyan-100 text-sm font-medium">
              {projects.length} Project{projects.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {projects.map((proj, index) => (
            <div
              key={proj._id}
              onMouseEnter={() => setHoveredCard(proj._id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group/card relative bg-gradient-to-br from-slate-800/95 via-slate-700/95 to-gray-800/95 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 overflow-hidden flex flex-col border border-slate-600/50 hover:border-cyan-400/60 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl blur"></div>
              
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              
              {/* Image section with proper aspect ratio */}
              {proj.projectImg && (
                <div className="relative overflow-hidden h-48 group/image bg-gradient-to-br from-slate-600 to-slate-700">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={proj.projectImg}
                      alt={proj.name}
                      className="w-full h-full object-cover object-center group-hover/image:scale-110 transition-transform duration-700"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Animated particles on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover/image:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute top-8 right-6 w-1 h-1 bg-blue-400 rounded-full animate-ping animation-delay-200"></div>
                    <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping animation-delay-400"></div>
                  </div>
                  
                  {/* Enhanced status badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(proj.status)} shadow-lg border backdrop-blur-sm group-hover/image:scale-110 transition-transform duration-300`}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                      {proj.status}
                    </div>
                  </div>
                </div>
              )}

              {/* Content with enhanced styling */}
              <div className="relative p-5 flex flex-col gap-4 flex-1 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                {/* Project name with glow effect */}
                <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text group-hover/card:from-cyan-300 group-hover/card:to-blue-300 transition-all duration-300">
                  {proj.name}
                </h2>
                
                {/* Description with better typography */}
                <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed group-hover/card:text-gray-200 transition-colors duration-300">
                  {proj.description}
                </p>
                
                {/* Enhanced tech stack */}
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(proj.techStack) ? proj.techStack : [proj.techStack]).slice(0, 3).map((tech, idx) => (
                    <span
                      key={idx}
                      className="relative text-xs bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 text-cyan-200 px-3 py-1.5 rounded-full font-medium border border-cyan-500/30 hover:scale-105 hover:border-cyan-400/50 transition-all duration-200 backdrop-blur-sm"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
                      <span className="relative">{tech}</span>
                    </span>
                  ))}
                  {(Array.isArray(proj.techStack) ? proj.techStack : [proj.techStack]).length > 3 && (
                    <span className="text-xs text-gray-400 px-3 py-1.5 bg-slate-700/50 rounded-full border border-slate-600/50">
                      +{(Array.isArray(proj.techStack) ? proj.techStack : [proj.techStack]).length - 3} more
                    </span>
                  )}
                </div>

                {/* Enhanced GitHub link */}
                <a
                  href={proj.gitHub}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-all duration-200 hover:scale-105 transform w-fit relative"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 blur"></div>
                  <Github size={16} className="relative group-hover/link:rotate-12 transition-transform duration-200" />
                  <span className="relative">View Repository</span>
                  <ExternalLink size={12} className="relative opacity-60 group-hover/link:opacity-100 transition-opacity duration-200" />
                </a>

                {/* Enhanced action buttons */}
                <div className="mt-auto pt-4 flex gap-3 border-t border-slate-600/50">
                  <button
                    onClick={() => handleEdit(proj)}
                    className="group/btn flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-all duration-200 hover:scale-105 relative px-3 py-2 rounded-lg hover:bg-blue-500/10"
                  >
                    <Edit2 size={16} className="group-hover/btn:rotate-12 transition-transform duration-200" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="group/btn flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-medium transition-all duration-200 hover:scale-105 relative px-3 py-2 rounded-lg hover:bg-red-500/10"
                  >
                    <Trash2 size={16} className="group-hover/btn:rotate-12 transition-transform duration-200" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Enhanced Add New Card */}
          <div
            onClick={() => {
              setIsEditing(false);
              setFormData({
                name: "",
                gitHub: "",
                description: "",
                techStack: "",
                status: "",
                file: null,
              });
              setIsModalOpen(true);
            }}
            className="group/add relative flex flex-col items-center justify-center border-2 border-dashed border-cyan-400/40 hover:border-cyan-300/60 text-cyan-200 hover:text-cyan-100 rounded-2xl cursor-pointer hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-blue-500/10 hover:scale-105 transition-all duration-500 min-h-[300px] overflow-hidden backdrop-blur-sm"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover/add:opacity-100 transition-opacity duration-500"></div>
            
            {/* Pulsing circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-cyan-400/20 rounded-full animate-ping opacity-0 group-hover/add:opacity-100"></div>
              <div className="absolute w-24 h-24 border border-cyan-400/30 rounded-full animate-ping animation-delay-300 opacity-0 group-hover/add:opacity-100"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover/add:scale-110 transition-transform duration-300 border border-cyan-400/30">
                <Plus size={36} className="group-hover/add:rotate-180 transition-transform duration-500" />
              </div>
              <span className="text-xl font-semibold group-hover/add:scale-105 transition-transform duration-300 text-transparent bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text">
                Add New Project
              </span>
              <span className="text-sm text-cyan-300 mt-2 opacity-0 group-hover/add:opacity-100 transition-opacity duration-300">
                Create something amazing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra Enhanced Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-start z-50 p-4 animate-fade-in overflow-y-auto pt-16">
          <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-cyan-400/30 transform animate-scale-in overflow-hidden my-8">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-3xl"></div>
            
            {/* Glowing border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-60"></div>
            
            <div className="relative">
              {/* Enhanced Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                    {isEditing ? <Edit2 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
                  </div>
                  <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text">
                    {isEditing ? "Edit Project" : "Create New Project"}
                  </h2>
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110 border border-slate-600/50 hover:border-red-400/50"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Form fields with enhanced styling */}
                {["name", "gitHub", "description", "techStack", "status"].map((field, idx) => (
                  <div key={idx} className="group relative">
                    <label className="block text-sm font-medium text-cyan-100 mb-2 capitalize flex items-center gap-2">
                      {field === "techStack" ? (
                        <>
                          <Code size={14} className="text-cyan-400" />
                          Tech Stack (comma-separated)
                        </>
                      ) : field === "gitHub" ? (
                        <>
                          <Github size={14} className="text-cyan-400" />
                          GitHub Repository
                        </>
                      ) : field === "status" ? (
                        <>
                          <Calendar size={14} className="text-cyan-400" />
                          Project Status
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          {field}
                        </>
                      )}
                    </label>
                    {field === "description" ? (
                      <div className="relative">
                        <textarea
                          name={field}  
                          placeholder={`Enter ${field}...`}
                          value={formData[field]}
                          onChange={handleChange}
                          className="w-full bg-slate-700/50 border border-slate-600/50 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:outline-none transition-all duration-300 resize-none hover:border-slate-500 text-white placeholder-gray-400 backdrop-blur-sm text-sm"
                          rows="3"
                          required
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    ) : field === "status" ? (
                      <div className="relative">
                        <select
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className="w-full bg-slate-700/50 border border-slate-600/50 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:outline-none transition-all duration-300 hover:border-slate-500 text-white backdrop-blur-sm text-sm appearance-none cursor-pointer"
                          required
                        >
                          {statusOptions.map((option) => (
                            <option 
                              key={option.value} 
                              value={option.value} 
                              disabled={option.disabled}
                              className="bg-slate-800 text-white"
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                          <ChevronDown size={16} className="text-gray-400" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type={field === "gitHub" ? "url" : "text"}
                          name={field}
                          placeholder={`Enter ${field}...`}
                          value={formData[field]}
                          onChange={handleChange}
                          className="w-full bg-slate-700/50 border border-slate-600/50 p-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:outline-none transition-all duration-300 hover:border-slate-500 text-white placeholder-gray-400 backdrop-blur-sm text-sm"
                          required
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Enhanced file upload */}
                <div className="group relative">
                  <label className="block text-sm font-medium text-cyan-100 mb-2 flex items-center gap-2">
                    <Upload size={14} className="text-cyan-400" />
                    Project Image
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-slate-700/50 border border-slate-600/50 p-3 rounded-lg cursor-pointer hover:bg-slate-600/50 transition-all duration-300 text-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-blue-500 file:text-white file:cursor-pointer file:font-medium file:text-sm hover:border-slate-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Enhanced action buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-600/50">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 hover:text-white rounded-lg transition-all duration-300 font-medium hover:scale-105 border border-slate-600/50 hover:border-slate-500 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 font-medium hover:scale-105 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden text-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative">
                      {isEditing ? "Update Project" : "Create Project"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProjectGalleryPage;