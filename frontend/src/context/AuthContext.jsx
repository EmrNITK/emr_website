// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';

  useEffect(() => {
    const fetchAuth = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: token },
          withCredentials: true
        });
        
        setUser(response.data.user || response.data); 
      } catch (error) {
        console.error("Authentication failed:", error);
        localStorage.removeItem('token'); 
        localStorage.removeItem('userId'); 
        setUser(null);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchAuth();
  }, []);

  // 1. Updated Logout Method
  const logout = async () => {
    try {
      // Hit the backend to clear the httpOnly cookie/session
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      
      // Clear local storage items
      localStorage.removeItem('userId');
      localStorage.removeItem('token'); // Kept this here just in case!
      
      // Update global state so the UI reacts immediately
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};