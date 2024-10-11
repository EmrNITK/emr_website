import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../assets/css/Navbar2.css";
import logo2 from "../assets/images/emr_logo.png";
import { FaAlignRight, FaXing } from "react-icons/fa";

function NavBar2() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return (
    <>
      <nav className="navbar2 bg-primaryy">
        <div className="nav2-container">
          <NavLink exact to="/" className="nav2-logo flex justify-between">
            <img src={logo2} alt="logo" className="w-16 h-13" />
          </NavLink>

          <ul className={click ? "nav2-menu active" : "nav2-menu"}>
            <li className="nav2-item">
              <NavLink
                exact
                to="/"
                activeClassName="active"
                className="nav2-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav2-item">
              <NavLink
                exact
                to="/gallery"
                activeClassName="active"
                className="nav2-links"
                onClick={handleClick}
              >
                Gallery
              </NavLink>
            </li>
            <li className="nav2-item">
              <NavLink
                exact
                to="/team"
                activeClassName="active"
                className="nav2-links"
                onClick={handleClick}
              >
                Team
              </NavLink>
            </li>
            <li className="nav2-item">
              <NavLink
                exact
                to="/blog"
                activeClassName="active"
                className="nav2-links"
                onClick={handleClick}
              >
                Blog
              </NavLink>
            </li>
            <li className="nav2-item">
              <NavLink
                exact
                to="/workshop"
                activeClassName="active"
                className="nav2-links"
                onClick={handleClick}
              >
                Workshops
              </NavLink>
            </li>
            <li className="nav2-item">
              <NavLink
                exact
                to="/event"
                activeClassName="active"
                className="nav2-links"
                onClick={handleClick}
              >
                Events
              </NavLink>
            </li>
            <li className="nav2-item">
              <NavLink
                exact
                to="/sponsor"
                activeClassName="active"
                className="nav2-links"
                onClick={handleClick}
              >
                Sponsor
              </NavLink>
            </li>
          </ul>
          <div className="nav2-icon" onClick={handleClick}>
            {click ? <FaXing /> : <FaAlignRight />}
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar2;
