import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Images, Users, Cpu, DollarSign, LogOut } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Sidebar = ({ logout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Define API URL
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  const handleLogout = async () => {
    try {
      // 1. Call Server to clear HTTP-only cookie
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      
      toast.success("Logged out successfully");
      
      // 2. Trigger parent state update (clears local "isAuthenticated" state)
      logout(); 
      
      // 3. Redirect (Optional, handled by parent usually, but good for safety)
      navigate('/login');
      
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Logout failed, force clearing...");
      logout(); // Force logout on client even if server fails
    }
  };

  const menu = [
    { name: 'Workshops', icon: Cpu, path: '/admin/workshops' },
    { name: 'Events', icon: Calendar, path: '/admin/events' },
    { name: 'Gallery', icon: Images, path: '/admin/gallery' },
    { name: 'Projects', icon: LayoutDashboard, path: '/admin/projects' },
    { name: 'Team', icon: Users, path: '/admin/team' },
    { name: 'Sponsors', icon: DollarSign, path: '/admin/sponsors' },
  ];

  return (
    <div className="w-64 h-screen bg-zinc-950 border-r border-zinc-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
          EMR Admin
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menu.map((item) => (
          <Link key={item.path} to={item.path}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-lg shadow-blue-900/20'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
            }`}>
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-zinc-800">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full px-4 py-3 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;