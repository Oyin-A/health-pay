import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, MagnifyingGlassIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';

function Footer() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black py-2 flex justify-around items-center text-white">
      <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center">
        <HomeIcon className="h-6 w-6" />
      </button>
      <button onClick={() => navigate('/search')} className="flex flex-col items-center">
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>
      <button onClick={() => navigate('/settings')} className="flex flex-col items-center">
        <Cog6ToothIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default Footer;
