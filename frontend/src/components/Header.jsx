import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-0 w-full bg-purple-700 p-4 text-white shadow-md z-50 flex justify-between items-center">
  <h1 className="text-xl sm:text-2xl font-semibold text-yellow-300">Workshop Hub</h1>
  <div className="flex items-center space-x-2">
    {user ? (
      <>
        <span className="mr-2 sm:mr-4 text-yellow-200 text-sm sm:text-base">Hello, {user.name}</span>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-2 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base font-semibold"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <Link
          to="/login"
          className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-sm sm:text-base font-semibold"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-2 sm:px-4 py-1 sm:py-2 bg-green-500 hover:bg-green-600 rounded-md text-sm sm:text-base font-semibold"
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
