// pages/AdminDash.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

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

const AdminDash = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  // 1. Check if Cookie is valid on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${API_URL}/check-auth`, { withCredentials: true });
        setIsAuthenticated(true);
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
    return <Login setToken={handleLoginSuccess} />;
  }

  return (
    <div className="flex bg-black min-h-screen text-white font-sans selection:bg-blue-500/30">
      <Sidebar logout={logout} />
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />
      
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/workshops" />} />
          
          {/* Admin Routes */}
          <Route path="/workshops" element={<Workshops />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/team" element={<Team />} />
          <Route path="/sponsors" element={<Sponsors />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDash;