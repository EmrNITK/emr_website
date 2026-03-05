import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { ShieldAlert, Loader2 } from "lucide-react";

// Import Shared Components
import Sidebar from './components/Sidebar'; 

// Import Pages
import Workshops from './pages/Workshops';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Sponsors from './pages/Sponsors';
import FormBuilder from './pages/Forms';
import FormDashboard from './pages/FormDashboard';
import AdminPage from './pages/AdminUsers';

const AdminDash = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(API_URL + '/auth/me', { withCredentials: true });
        if (res.data) {
          setIsAuthenticated(true);
          if (res.data.userType === 'admin' || res.data.userType === 'super-admin') {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        setIsAuthenticated(false);
        // Safely redirect if not authenticated
        navigate('/a/login?redirect=/admin');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [API_URL, navigate]);

  const logout = () => {
    setIsAuthenticated(false);
    // Any token clearing logic if needed
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-[#51b749] w-10 h-10" />
      </div>
    );
  }

  // --- Access Denied State ---
  if (!isAdmin && isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black text-white font-sans selection:bg-[#51b749]/30 selection:text-[#51b749] relative overflow-hidden">
        
        {/* Sleek Grid Background */}
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#51b74915_1px,transparent_1px),linear-gradient(to_bottom,#51b74915_1px,transparent_1px)] bg-[size:40px_40px]"
            style={{
              maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)"
            }}
          />
        </div>

        <div className="w-full max-w-md bg-[#111111] border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative z-10 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20">
              <ShieldAlert className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Access Denied
          </h1>

          <p className="text-white/60 text-sm leading-relaxed">
            You don't have access to the administration panel.
            Please contact the administrator if you believe this is a mistake.
          </p>

          <button 
            onClick={() => navigate('/p')}
            className="mt-8 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-medium transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // --- Main Admin Dashboard ---
  return (
    <div className="flex flex-col md:flex-row bg-black min-h-screen text-white font-sans selection:bg-[#51b749]/30 selection:text-[#51b749] relative overflow-hidden">
      
      {/* Fixed Background Grid for the Dashboard */}
      <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#51b74915_1px,transparent_1px),linear-gradient(to_bottom,#51b74915_1px,transparent_1px)] bg-[size:40px_40px]"
          style={{
            maskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)"
          }}
        />
      </div>

      {/* Sidebar with higher z-index */}
      <div className="relative z-10">
        <Sidebar logout={logout} />
      </div>

      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { 
            background: '#111111', 
            color: '#fff', 
            border: '1px solid rgba(255,255,255,0.1)' 
          } 
        }} 
      />
      
      {/* Main Content Area - Scrollable */}
      <div className="flex-1 w-full relative z-10 h-screen overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/forms" />} />
          
          {/* Admin Routes */}
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/forms" element={<FormDashboard />} />
          <Route path="/form" element={<FormBuilder />}/>
          <Route path="/form/:slug" element={<FormBuilder />}/>
          <Route path="/makeadmin" element={<AdminPage />}/>
        </Routes>
      </div>
    </div>
  );
};

export default AdminDash;