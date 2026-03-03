// pages/AdminDash.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { ShieldAlert } from "lucide-react";

// Import Shared Components
import Sidebar from './components/Sidebar'; // Check your relative paths
import Login from './pages/Login';

// Import Pages
import Workshops from './pages/Workshops';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Sponsors from './pages/Sponsors';
import FormBuilder from './pages/Forms';
import FormDashboard from './pages/FormDashboard';

const AdminDash = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  // 1. Check if Cookie is valid on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(API_URL+'/auth/me');
        // await axios.get(`${API_URL}/check-auth`, { withCredentials: true });
        if (res.data) {
          setIsAuthenticated(true);
          if (res.data.userType === 'admin' || res.data.userType === 'super-admin') {
            setIsAdmin(true)
          }
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [API_URL]);
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

 const logout = () => {
  // Just update the state. The API call is now done inside Sidebar.
  setIsAuthenticated(false);
  setToken(null); // If you are still using a token state
};

  // Show a simple loading state while checking cookie
  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  // If not authenticated, show Login
  if (!isAuthenticated) {
    navigate('/a/login?redirect=/admin');
  }
   if (!isAdmin) {
    return (<div className="flex items-center justify-center min-h-screen bg-gray-900/50 px-4">
      <div className="bg-gray-900 shadow-xl rounded-2xl p-8 max-w-md w-full text-center text-white">
        
        <div className="flex justify-center mb-4">
          <div className="bg-red-400 p-4 rounded-full">
            <ShieldAlert className="w-12 h-12 text-red-100" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-200 mb-2">
          Access Denied
        </h1>

        <p className="text-gray-400">
          You don't have access to the administration panel.
          Please contact the administrator if you believe this is a mistake.
        </p>

      </div>
    </div>)
  }

  return (
    <div className="flex bg-black min-h-screen text-white font-sans selection:bg-blue-500/30">
      <Sidebar logout={logout} />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      <div className="w-full">
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
        </Routes>
      </div>
    </div>
  );
};

export default AdminDash;