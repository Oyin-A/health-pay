import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const Header = ({ navigate, toggleDarkMode, darkMode, userDetails, getInitials }) => {
  return (
    <header className="bg-black py-4 px-6 shadow-md flex justify-between items-center">
      <button onClick={() => navigate(-1)} className="text-white flex items-center hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="ml-2">Back</span>
      </button>
      <h1 className="text-2xl font-bold">Make Payments</h1>
      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} className="text-white transition-transform transform hover:scale-110">
          {darkMode ? <FontAwesomeIcon icon={faSun} className="h-6 w-6" /> : <FontAwesomeIcon icon={faMoon} className="h-6 w-6" />}
        </button>
        <div className="cursor-pointer" onClick={() => navigate('/user-profile')}>
          {userDetails?.photoURL ? (
            <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
              {userDetails?.displayName ? getInitials(userDetails.displayName) : 'U'}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
