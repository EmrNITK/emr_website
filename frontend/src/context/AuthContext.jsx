// context/AuthContext.js

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
    console.log("usedata", userData.user);
    setUser(userData.user);
    setIsLoggedIn(true);
    // Persist only the user object in localStorage
    localStorage.setItem("user", JSON.stringify(userData.user));
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    alert("Logged Out Successfully");
    // Remove user data from localStorage
    localStorage.removeItem("user");
  };

  const updateUser = (updatedUser) => {
    console.log("updatedUser", updatedUser);

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }

  useEffect(() => {
    // Optionally, you can implement additional logic here
    // (e.g., refresh tokens, etc.)
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
