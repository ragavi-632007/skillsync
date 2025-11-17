import React, { useState } from 'react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  onLogout: () => void;
  onViewProfile: (userId: number) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, onViewProfile }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewProfile(currentUser.id);
    setMenuOpen(false);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800/80 backdrop-blur-md border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xl font-bold tracking-wider text-white">SkillSync</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-900 text-gray-300 placeholder-gray-400 focus:outline-none focus:placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Find skills or people..."
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative ml-4">
            <div>
              <button onClick={() => setMenuOpen(!menuOpen)} type="button" className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                <span className="sr-only">Open user menu</span>
                <img className="h-8 w-8 rounded-full" src={currentUser.profilePicture} alt="" />
              </button>
            </div>
            {menuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                <a href="#" onClick={handleProfileClick} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700" role="menuitem">Your Profile</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700" role="menuitem">Sign out</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;