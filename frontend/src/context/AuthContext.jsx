import React, { createContext, useState, useEffect } from "react";
import { getUserById } from "../api/apiService";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null; // Check if savedUser is valid JSON
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null; // Return null if parsing fails
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  const login = (userData) => {
    setUser(userData.user);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    alert("Logged Out Successfully");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tempOtpJwt");
  };

  const updateUser = async () => {
    const updatedUser = await getUserById(user._id);
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  useEffect(() => {
    // Optionally, you can implement additional logic here
    // (e.g., refresh tokens, etc.)
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
