import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Images, Users, Cpu, DollarSign, LogOut, SheetIcon, Menu, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Sidebar = ({ logout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      
      toast.success("Logged out successfully", {
        style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      
      logout(); 
      navigate('/login');
      
    } catch (err) {
      console.error("Logout Error:", err);
      toast.error("Logout failed, force clearing...", {
        style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
      logout(); 
    }
  };

  const menu = [
    { name: 'Forms', icon: SheetIcon, path: '/admin/forms' },
    { name: 'Workshops', icon: Cpu, path: '/admin/workshops' },
    { name: 'Events', icon: Calendar, path: '/admin/events' },
    { name: 'Gallery', icon: Images, path: '/admin/gallery' },
    { name: 'Projects', icon: LayoutDashboard, path: '/admin/projects' },
    { name: 'Team', icon: Users, path: '/admin/team' },
    { name: 'Sponsors', icon: DollarSign, path: '/admin/sponsors' },
  ];

  return (
    <div className="md:w-64 flex flex-col bg-[#111111]/95 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/5 md:h-screen md:sticky md:top-0">
      
      <div className="flex items-center justify-between p-6 border-b border-white/5">
        <h1 className="text-2xl font-bold tracking-tight flex items-center">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#13703a]">
            EM
          </span>
          <span className="text-white">R</span>
          <span className="text-white/30 font-normal ml-2 text-lg">Admin</span>
        </h1>
        
        <button 
          className="md:hidden text-white/50 hover:text-white p-2 bg-white/5 rounded-lg border border-white/10 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      <div className={`${isOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 overflow-y-auto`}>
        <nav className="flex-1 p-4 space-y-2">
          {menu.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                onClick={() => setIsOpen(false)}
              >
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#51b749]/10 text-[#51b749] border border-[#51b749]/30 shadow-[0_0_15px_-3px_rgba(81,183,73,0.15)]'
                    : 'text-white/50 hover:bg-white/5 hover:text-white/90 border border-transparent'
                }`}>
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5 mt-auto">
          <button 
            onClick={() => { setIsOpen(false); handleLogout(); }} 
            className="flex items-center gap-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full px-4 py-3 rounded-xl transition-all duration-300 border border-transparent hover:border-red-500/20"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Sidebar;