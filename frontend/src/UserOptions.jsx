import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Profile from "./assets/profile.webp";
import "./UserOptions.css";

const SpeedDial = () => {
  const { user, logout } = useContext(AuthContext); 
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };
  console.log(user.isAdmin)

  const handleLogout = () => {
    logout();
    navigate("/workshop");
  };

  const options = [
    { name: "Home", func: () => handleNavigate("/") },
    { name: "My Team", func: () => handleNavigate("/teamdetails") },
    { name: "Logout", func: handleLogout },
  ];

  // If the user is an admin, add the "Dashboard" option
  if (user?.isAdmin) {
    options.unshift({ name: "Dashboard", func: () => handleNavigate("/dashboard") });
  }

  return (
    <div>
      <div className="speed-dial">
        <div className="speed-dial-icon" onClick={() => setOpen(!open)}>
          <img
            src={Profile}
            alt="Profile"
            className="avatar"
          />
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
  );
};

export default SpeedDial;
