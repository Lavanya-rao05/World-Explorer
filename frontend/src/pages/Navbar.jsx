import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react"; // Install if not already: `npm install lucide-react`

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="fixed min-w-screen top-0 left-0 z-50 bg-transparent backdrop-blur-lg shadow-md px-6 flex items-center border-b-1 justify-between w-full">
        {/* Logo */}
        <div className="z-50">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition duration-300"
          >
            <img
              src="/Explorer2.png"
              alt="WorldExplorer Logo"
              className="w-30 h-20 ml-5 object-contain" 
            />
 
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8 font-medium text-lg">
          <Link to="/" className="hover:text-blue-400 transition duration-300">
            Home
          </Link>
          <Link
            to="/explore"
            className="hover:text-blue-400 transition duration-300"
          >
            Explore
          </Link>
          <Link
            to="/planner"
            className="hover:text-blue-400 transition duration-300"
          >
            Plan My Trip
          </Link>
        </div>

        {/* Hamburger for Mobile */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Profile/Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full bg-gray-900 hover:bg-blue-400 transition duration-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <img
              src="https://avatar.iran.liara.run/public/11"
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-900 rounded-lg shadow-lg border border-blue-500 z-50 overflow-hidden">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-lg font-bold text-white hover:text-blue-400 hover:rounded-none"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-lg font-bold text-white hover:text-blue-400 hover:rounded-none"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-lg font-bold text-white hover:text-blue-400 hover:rounded-none"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 z-40 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out p-6 z-50 flex flex-col space-y-4`}
      >
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="text-white text-xl font-medium hover:text-blue-400"
        >
          Home
        </Link>
        <Link
          to="/explore"
          onClick={() => setMobileMenuOpen(false)}
          className="text-white text-xl font-medium hover:text-blue-400"
        >
          Explore
        </Link>
        <Link
          to="/planner"
          onClick={() => setMobileMenuOpen(false)}
          className="text-white text-xl font-medium hover:text-blue-400"
        >
          Plan My Trip
        </Link>

        <div className="border-t border-gray-700 mt-4 pt-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-white text-xl font-medium hover:text-blue-400"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-xl font-medium hover:text-blue-400"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-xl font-medium hover:text-blue-400"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Optional backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Navbar;
