import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import HelpChatModal from './HelpChatModal';
import { getUserDetails } from './authService';
import {
  FiArrowLeft,
  FiUser,
  FiPlusCircle,
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiLoader,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { MdPendingActions } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('');
}

function MakeClaims() {
  const navigate = useNavigate();
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const claimsPerPage = 6;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await getUserDetails();
        setUserDetails(details);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();

    // Mock data for claims
    setClaims([
      { id: 12345, date: '01/10/2023', amount: '$500.00', status: 'Pending' },
      { id: 12346, date: '01/11/2023', amount: '$300.00', status: 'Approved' },
      { id: 12347, date: '01/12/2023', amount: '$200.00', status: 'Rejected' },
      { id: 12348, date: '01/13/2023', amount: '$700.00', status: 'Pending' },
      { id: 12349, date: '01/14/2023', amount: '$900.00', status: 'Approved' },
      { id: 12350, date: '01/15/2023', amount: '$100.00', status: 'Rejected' },
      { id: 12351, date: '01/16/2023', amount: '$250.00', status: 'Pending' },
      { id: 12352, date: '01/17/2023', amount: '$350.00', status: 'Approved' },
      { id: 12353, date: '01/18/2023', amount: '$450.00', status: 'Rejected' },
    ]);
  }, []);

  const openHelpChat = () => {
    setIsHelpChatOpen(true);
  };

  const closeHelpChat = () => {
    setIsHelpChatOpen(false);
  };

  const openClaimDetails = (claim) => {
    setSelectedClaim(claim);
  };

  const closeClaimDetails = () => {
    setSelectedClaim(null);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSortChange = (sortField) => {
    const sortedClaims = [...claims].sort((a, b) => {
      if (sortField === 'amount') {
        return parseFloat(a.amount.replace('$', '')) - parseFloat(b.amount.replace('$', ''));
      } else if (sortField === 'date') {
        return new Date(a.date) - new Date(b.date);
      } else {
        return a.status.localeCompare(b.status);
      }
    });
    setClaims(sortedClaims);
  };

  const filteredClaims = claims.filter((claim) =>
    (claim.id.toString().includes(searchTerm) ||
      claim.date.includes(searchTerm) ||
      claim.amount.includes(searchTerm) ||
      claim.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus ? claim.status === filterStatus : true)
  );

  const indexOfLastClaim = currentPage * claimsPerPage;
  const indexOfFirstClaim = indexOfLastClaim - claimsPerPage;
  const currentClaims = filteredClaims.slice(indexOfFirstClaim, indexOfLastClaim);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'} pb-12 relative transition-colors duration-500`}>
      <header className="bg-black py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-white flex items-center hover:underline">
          <FiArrowLeft className="h-6 w-6" />
          
        </button>
        <h1 className="text-2xl font-bold">Claims</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="text-white transition-transform transform hover:scale-110">
            {darkMode ? <FiSun className="h-6 w-6" /> : <FiMoon className="h-6 w-6" />}
          </button>
          <div className="cursor-pointer" onClick={() => navigate('/user-profile')}>
            {userDetails?.photoURL ? (
              <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                {userDetails?.displayName ? getInitials(userDetails.displayName) : <FiUser className="h-6 w-6" />}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow p-6 space-y-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 bg-white text-black py-2 px-4 rounded-md shadow-md">
            <FiSearch className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search claims..."
              className="bg-transparent focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={filterStatus}
            onChange={handleFilterChange}
            className="bg-white text-black py-2 px-4 rounded-md shadow-md"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={() => navigate('/add-new-claim')}
            className="bg-yellow-500 text-white py-2 px-4 rounded-md transform transition-transform hover:scale-105 flex items-center space-x-2 shadow-md"
          >
            <FiPlusCircle className="text-2xl" />
            <span>Add Claim</span>
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Sort by:</span>
          <button onClick={() => handleSortChange('date')} className="bg-gray-200 text-black py-1 px-3 rounded-md shadow-md">
            Date
          </button>
          <button onClick={() => handleSortChange('amount')} className="bg-gray-200 text-black py-1 px-3 rounded-md shadow-md">
            Amount
          </button>
          <button onClick={() => handleSortChange('status')} className="bg-gray-200 text-black py-1 px-3 rounded-md shadow-md">
            Status
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <FiLoader className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white p-6 rounded-lg shadow-lg text-black transform transition-transform hover:scale-105 relative overflow-hidden cursor-pointer hover:shadow-2xl"
                onClick={() => openClaimDetails(claim)}
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${claim.status === 'Pending' ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600' : claim.status === 'Approved' ? 'bg-gradient-to-r from-green-400 via-teal-500 to-blue-600' : 'bg-gradient-to-r from-red-400 via-pink-500 to-purple-600'} animate-pulse`}
                ></div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-800 text-xl font-bold">Claim #{claim.id}</p>
                  <Tippy content="More details about this claim">
                    <FiInfo className="text-blue-500 h-6 w-6 cursor-pointer" />
                  </Tippy>
                </div>
                <p className="text-gray-500">Submitted on {claim.date}</p>
                <p className="text-gray-800 text-lg">{claim.amount}</p>
                <p
                  className={`font-bold flex items-center space-x-2 ${claim.status === 'Pending' ? 'text-yellow-500' : claim.status === 'Approved' ? 'text-green-500' : 'text-red-500'}`}
                >
                  {claim.status === 'Pending' ? (
                    <MdPendingActions className="text-2xl" />
                  ) : claim.status === 'Approved' ? (
                    <FiCheckCircle className="text-2xl" />
                  ) : (
                    <FiXCircle className="text-2xl" />
                  )}
                  <span>{claim.status}</span>
                </p>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            className="bg-gray-200 text-black py-1 px-3 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <div className="text-black">
            Page {currentPage} of {Math.ceil(filteredClaims.length / claimsPerPage)}
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            className="bg-gray-200 text-black py-1 px-3 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === Math.ceil(filteredClaims.length / claimsPerPage)}
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={openHelpChat}
          className="fixed bottom-16 right-6 bg-red-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold transform transition-transform hover:scale-110"
        >
          ?
        </button>
      </main>
      <Footer />
      <HelpChatModal isOpen={isHelpChatOpen} onClose={closeHelpChat} />
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-md text-black relative max-w-lg w-full transform transition-transform duration-300 scale-105">
            <button onClick={closeClaimDetails} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Claim Details</h2>
            <p><strong>Claim ID:</strong> {selectedClaim.id}</p>
            <p><strong>Date Submitted:</strong> {selectedClaim.date}</p>
            <p><strong>Amount:</strong> {selectedClaim.amount}</p>
            <p><strong>Status:</strong> {selectedClaim.status}</p>
            <p className="mt-4">Detailed information about the claim </p>
          </div>
        </div>
      )}
      {notifications.map((notification, index) => (
        <div key={index} className="fixed top-16 right-6 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
          {notification}
        </div>
      ))}
    </div>
  );
}

export default MakeClaims;
