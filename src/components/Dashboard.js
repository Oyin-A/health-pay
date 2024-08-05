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
import Notification from './Notification';

function Dashboard() {
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([
    'Your appointment is confirmed.',
    'Your payment has been processed.',
    'You have a new message from your doctor.',
  ]); // Example notification messages
  const [showNotifications, setShowNotifications] = useState(false); // State to control notification display
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getUserDetails();
        console.log('Fetched user details:', user); // Log user details
        setUserDetails(user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const openHelpChat = () => {
    setIsHelpChatOpen(true);
  };

  const closeHelpChat = () => {
    setIsHelpChatOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications); // Toggle notification display
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <BiLoaderCircle className="animate-spin text-6xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 text-white pb-12">
      <header className="bg-black py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome to HealthPay!</h1>
        <div className="flex items-center space-x-4">
          <Tippy content="Notifications">
            <div className="relative cursor-pointer" onClick={handleBellClick}>
              <FiBell className="text-2xl" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
          </Tippy>
          <Tippy content="User Profile">
            <div className="cursor-pointer" onClick={() => navigate('/user-profile')}>
              {userDetails?.photoURL ? (
                <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                  {userDetails?.displayName ? getInitials(userDetails.displayName) : 'U'}
                </div>
              )}
            </div>
          </Tippy>
        </div>
      </header>
      <main className="flex-grow p-6 space-y-8">
        {showNotifications && (
          <Notification notifications={notifications} onClose={handleBellClick} />
        )}
        <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-2xl text-black transform transition-transform hover:scale-105">
          <Carousel
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            stopOnHover={true}
          >
            <div className="p-4 text-center">
              <h2 className="text-gray-800 text-2xl font-bold">BMI</h2>
              <p className="text-gray-800 text-3xl font-semibold">22.5</p>
              <p className="text-gray-500">Healthy Weight</p>
            </div>
            <div className="p-4 text-center">
              <h2 className="text-gray-800 text-2xl font-bold">Heart Rate</h2>
              <p className="text-gray-800 text-3xl font-semibold">72 bpm</p>
              <p className="text-gray-500">Normal</p>
            </div>
            <div className="p-4 text-center">
              <h2 className="text-gray-800 text-2xl font-bold">Blood Pressure</h2>
              <p className="text-gray-800 text-3xl font-semibold">120/80 mmHg</p>
              <p className="text-gray-500">Normal</p>
            </div>
            <div className="p-4 text-center">
              <h2 className="text-gray-800 text-2xl font-bold">Daily Steps</h2>
              <p className="text-gray-800 text-3xl font-semibold">10,000 steps</p>
              <p className="text-gray-500">Goal Achieved</p>
            </div>
          </Carousel>
        </div>
        <div className="flex space-x-4">
          <div
            className="flex-1 bg-white bg-opacity-90 p-6 rounded-lg shadow-2xl text-center cursor-pointer transform transition-transform hover:scale-105 hover:bg-opacity-100"
            onClick={() => navigate('/make-claims')}
          >
            <h3 className="text-gray-800 text-xl font-bold">Make Claims</h3>
          </div>
          <div
            className="flex-1 bg-white bg-opacity-90 p-6 rounded-lg shadow-2xl text-center cursor-pointer transform transition-transform hover:scale-105 hover:bg-opacity-100"
            onClick={() => navigate('/make-payments')}
          >
            <h3 className="text-gray-800 text-xl font-bold">Make Payments</h3>
          </div>
        </div>
        <div className="bg-black bg-opacity-80 p-6 rounded-lg shadow-2xl text-white">
          <h3 className="text-lg font-bold mb-4">Track Expenses</h3>
          <div className="grid grid-cols-2 gap-4">
            <div
              className="bg-gray-800 p-6 rounded-lg text-center cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-700"
              onClick={() => navigate('/medical-history')}
            >
              <p className="text-lg">Medical History</p>
              <p className="text-2xl font-bold">6</p>
            </div>
            <div
              className="bg-gray-800 p-6 rounded-lg text-center cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-700"
              onClick={() => navigate('/financial')}
            >
              <p className="text-lg">Financial</p>
              <p className="text-2xl font-bold">4</p>
            </div>
            <div
              className="bg-gray-800 p-6 rounded-lg text-center cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-700"
              onClick={() => navigate('/savings-progress')}
            >
              <p className="text-lg">Savings Progress</p>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-gray-500">35%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                  <div style={{ width: '35%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                </div>
              </div>
            </div>
            <div
              className="bg-gray-800 p-6 rounded-lg text-center cursor-pointer transform transition-transform hover:scale-105 hover:bg-gray-700"
              onClick={() => navigate('/transactions')}
            >
              <p className="text-lg">Transactions</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>
        <button
          onClick={openHelpChat}
          className="fixed bottom-16 right-6 bg-red-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold transform transition-transform hover:scale-110 hover:bg-red-600"
        >
          ?
        </button>
      </main>
      <Footer />
      <HelpChatModal isOpen={isHelpChatOpen} onClose={closeHelpChat} />
    </div>
  );
}

export default Dashboard;
