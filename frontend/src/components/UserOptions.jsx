import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Profile from "../assets/profile.webp";

const SpeedDial = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const speedDialRef = useRef(null);

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false); // Close the menu
  };

  const handleLogout = () => {
    logout();
    navigate("/workshop");
    setOpen(false); // Close the menu
  };

  const options = [
    { name: "Home", func: () => handleNavigate("/") },
    { name: "Logout", func: handleLogout },
    { name: "Synapse", func: () => handleNavigate("/synapse") },
    { name: "Change Password", func: () => handleNavigate("/change-password") },
  ];

  if (user?.isAdmin) {
    options.unshift({
      name: "Team Dashboard",
      func: () => handleNavigate("/dashboard"),
    });
    options.unshift({
      name: "User Dashboard",
      func: () => handleNavigate("/userdashboard"),
    });
  }

  const handleClickOutside = (e) => {
    if (speedDialRef.current && !speedDialRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {user && (
        <div>
          {/* Backdrop */}
          {open && (
            <div
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md z-50"
              onClick={() => setOpen(false)}
            ></div>
          )}

          <div
            className="fixed bottom-8 right-16 flex flex-col items-center z-50"
            onMouseEnter={() => setOpen(true)} // Open on hover
            onMouseLeave={() => setOpen(false)} // Close when the mouse leaves
            onTouchStart={() => setOpen(true)}
            ref={speedDialRef}
          >
            <div className="w-16 h-16 rounded-full bg-opacity-70 bg-gray-800 flex justify-center items-center cursor-pointer shadow-lg transition-all duration-300 ease-in-out">
              <img src={Profile} alt="Profile" className="w-full h-full rounded-full" />
            </div>

            <div
              className={`flex flex-col items-center absolute bottom-16 transition-all duration-300 ease-in-out ${
                open ? "block" : "hidden"
              }`}
            >
              {options.map((item, index) => (
                <button
                  key={index}
                  className="bg-gray-900 text-gray-300 p-2 rounded-md cursor-pointer shadow-md transition-all duration-300 ease-in-out mb-2 w-full max-w-[200px] text-center hover:bg-transparent hover:border-2 hover:border-gray-800 whitespace-nowrap"
                  onClick={() => {
                    item.func();
                    setOpen(false);
                  }}
                  style={{ transform: `translateY(${-(index + 1)}px)` }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SpeedDial;
