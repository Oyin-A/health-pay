import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Footer from './Footer';
import HelpChatModal from './HelpChatModal';
import { getUserDetails } from './authService';
import { FiBell } from 'react-icons/fi';
import { BiLoaderCircle } from 'react-icons/bi';
import 'tippy.js/dist/tippy.css';
import Tippy from '@tippyjs/react';
import '@fortawesome/fontawesome-free/css/all.min.css';



function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 text-white pb-12">
      <header className="bg-black py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome to HealthPay!</h1>
      </header>
      <main className="flex-grow p-6 space-y-8">
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-2xl text-black">
          <h2>Sample Content</h2>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard