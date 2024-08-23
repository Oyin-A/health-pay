import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiPlusCircle, FiCheckCircle, FiXCircle, FiInfo, FiSearch, FiChevronLeft, FiChevronRight, FiEdit, FiCopy } from 'react-icons/fi';
import { MdPendingActions } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Footer from './Footer';
import HelpChatModal from './HelpChatModal';
import { getUserDetails } from './authService';

function MakeClaims() {
  const navigate = useNavigate();
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isEditing, setIsEditing] = useState(false); 
  const [status, setStatus] = useState(''); 
  const [filterStatus, setFilterStatus] = useState(''); 
  const claimsPerPage = 6;

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getUserDetails();
        setUserDetails(user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();

    const savedClaims = JSON.parse(localStorage.getItem('claims')) || [];
    setClaims(savedClaims);
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  };

  const openHelpChat = () => {
    setIsHelpChatOpen(true);
  };

  const closeHelpChat = () => {
    setIsHelpChatOpen(false);
  };

  const openClaimDetails = (claim) => {
    setSelectedClaim(claim);
    setStatus(claim.status);
    setIsEditing(false);
  };

  const closeClaimDetails = () => {
    setSelectedClaim(null);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
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

  const saveChanges = () => {
    const updatedClaims = claims.map(claim =>
      claim.id === selectedClaim.id ? { ...claim, status } : claim
    );
    setClaims(updatedClaims);
    localStorage.setItem('claims', JSON.stringify(updatedClaims));
    closeClaimDetails(); 
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Claim ID copied to clipboard!');
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

  const totalPages = Math.ceil(filteredClaims.length / claimsPerPage) || 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 pb-12 relative transition-colors duration-500">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 py-4 px-6 shadow-md flex justify-between items-center text-white">
        <button onClick={() => navigate(-1)} className="flex items-center hover:underline">
          <FiArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Claims</h1>
        <div className="flex items-center space-x-4">
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
          <div className="flex items-center space-x-2 bg-gray-100 text-black py-2 px-4 rounded-md shadow-md">
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
            className="bg-gray-100 text-black py-2 px-4 rounded-md shadow-md"
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
        {filteredClaims.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-gray-100 p-6 rounded-lg shadow-lg text-black transform transition-transform hover:scale-105 relative overflow-hidden cursor-pointer hover:shadow-2xl"
                onClick={() => openClaimDetails(claim)}
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${claim.status === 'Pending' ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600' : claim.status === 'Approved' ? 'bg-gradient-to-r from-green-400 via-teal-500 to-blue-600' : 'bg-gradient-to-r from-red-400 via-pink-500 to-purple-600'} animate-pulse`}
                ></div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-800 text-xl font-bold">Claim #{claim.id}</p>
                  <div className="flex items-center space-x-2">
                    <Tippy content="Copy Claim ID">
                      <FiCopy
                        className="text-blue-500 h-6 w-6 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(claim.id);
                        }}
                      />
                    </Tippy>
                    <Tippy content="More details about this claim">
                      <FiInfo className="text-blue-500 h-6 w-6 cursor-pointer" />
                    </Tippy>
                  </div>
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
        ) : (
          <div className="flex justify-center items-center min-h-[200px]">
            <p className="text-gray-600 text-lg">No claims have been submitted yet.</p>
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
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            className="bg-gray-200 text-black py-1 px-3 rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
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
            <div className="mt-4">
              <label htmlFor="status" className="block font-bold mb-2">Status:</label>
              {isEditing ? (
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              ) : (
                <p>{status}</p>
              )}
            </div>
            <div className="mt-4">
              <p className="font-bold">Additional Comments or Documents:</p>
              {selectedClaim.comments || selectedClaim.document ? (
                <div>
                  {selectedClaim.comments && <p>{selectedClaim.comments}</p>}
                  {selectedClaim.document && <p>{selectedClaim.document.name}</p>}
                </div>
              ) : (
                <p>No additional comments or files were submitted.</p>
              )}
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={saveChanges}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MakeClaims;
