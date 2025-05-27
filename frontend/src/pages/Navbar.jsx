import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed min-w-screen top-0 left-0 z-50 bg-transparent backdrop-blur-lg shadow-md px-6 py-4 flex items-center border-b-1 justify-between">
      
      {/* Logo - Left */}
      <div className="text-2xl font-bold">
        <Link to="/" className="hover:text-blue-400 transition duration-300">
          <span className="text-blue-400">World</span>Explorer
        </Link>
      </div>

      {/* Center Nav Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-8 font-medium text-lg">
        <Link to="/" className="hover:text-blue-400 transition duration-300">Home</Link>
        <Link to="/explore" className="hover:text-blue-400 transition duration-300">Explore</Link>
        <Link to="/planner" className="hover:text-blue-400 transition duration-300">Plan My Trip</Link>
      </div>

      {/* Account Button - Right */}
      <div className="flex items-center">
        <button
          className="w-10 h-10 rounded-full bg-gray-900 hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 p-0"
        >
          <img
            src="https://avatar.iran.liara.run/public/11"
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
