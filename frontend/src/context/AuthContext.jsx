import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Load user from localStorage or set to null
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    // Persist user data in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    alert("Logged Out Successfully");
    // Remove user data from localStorage
    localStorage.removeItem("user");
  };

  useEffect(() => {
    // Optionally, you can implement additional logic here
    // (e.g., refresh tokens, etc.)
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
