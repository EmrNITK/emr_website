import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import emrlogo from "../assets/emrlogo.png";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 left-0 w-full p-4 sm:px-1 text-white shadow-md z-50 flex justify-between items-center bg-white/5 backdrop-blur-lg">
      <p className="text-sm sm:text-xs font-semibold text-white-300 md:w-[50%] md:ml-4">
        <Link to="/">
          <img src={emrlogo} alt="logo" className="w-16 h-13" />
        </Link>
      </p>
      <div className="flex justify-end items-center md:w-[50%] right-0 mx-2">
        {user ? (
          <>
            <span className="mr-2 md:mr-4  text-white-200 md:text-base   text-xs mx-1">
              Hi, {user.name}
            </span>
            {/* <Link
              to="/teamdetails"
              className="px-2 sm:px-1 py-2 md:px-4 md:py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4"
            >
              My Team
            </Link> */}
            <button
              onClick={logout}
              className="bg-green-500 hover:bg-red-600 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 px-4 sm:px-1 py-2 md:px-4 md:py-2"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-2 sm:px-1 py-2 md:px-4 md:py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-2 sm:px-1 py-2 md:px-4 md:py-2 rounded-md text-xs md:text-base  font-semibold mx-1 md:mx-4 bg-green-500 hover:bg-green-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
