import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Profile from "./assets/profile.webp";
import "./UserOptions.css";

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
    { name: "My Team", func: () => handleNavigate("/teamdetails") },
    { name: "Logout", func: handleLogout },
    { name: "Workshop Hub", func: () => handleNavigate("/workshop") },
  ];

  if (user?.isAdmin) {
    options.unshift({
      name: "Dashboard",
      func: () => handleNavigate("/dashboard"),
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
          {open && <div className="backdrop backdrop-open" onClick={() => setOpen(false)}></div>}

          <div
            className="speed-dial"
            onMouseEnter={() => setOpen(true)}  // Open on hover
            onMouseLeave={() => setOpen(false)} // Close when the mouse leaves
            ref={speedDialRef}
          >
            <div className="speed-dial-icon">
              <img src={Profile} alt="Profile" className="avatar" />
            </div>

            <div className={`speed-dial-actions ${open ? "show" : ""}`}>
              {options.map((item, index) => (
                <button
                  key={index}
                  className="speed-dial-action min-w-24"
                  onClick={item.func}
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
