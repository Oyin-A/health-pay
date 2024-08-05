import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import HelpChatModal from './HelpChatModal';
import { getUserDetails } from './authService';
import { AiOutlineArrowLeft, AiOutlineInfoCircle, AiOutlineUpload } from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function AddNewClaim() {
  const navigate = useNavigate();
  const [providerName, setProviderName] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [dateOfService, setDateOfService] = useState(new Date());
  const [diagnosisCode, setDiagnosisCode] = useState('');
  const [claimType, setClaimType] = useState('');
  const [document, setDocument] = useState(null);
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getUserDetails();
        setUserDetails(details);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchData();
  }, []);

  const openHelpChat = () => {
    setIsHelpChatOpen(true);
  };

  const closeHelpChat = () => {
    setIsHelpChatOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newClaim = {
      providerName,
      claimAmount,
      dateOfService: dateOfService.toLocaleDateString(),
      diagnosisCode,
      claimType,
      document,
    };

    console.log('New Claim Submitted:', newClaim);

    setResponseMessage('Your claim has been submitted successfully!');

    setProviderName('');
    setClaimAmount('');
    setDateOfService(new Date());
    setDiagnosisCode('');
    setClaimType('');
    setDocument(null);

    setTimeout(() => {
      setResponseMessage('');
      navigate('/make-claims');
    }, 3000); // Navigate after 3 seconds
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('');
  };

  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 pb-12">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 py-4 px-6 shadow-md flex justify-between items-center text-white">
        <button onClick={() => navigate(-1)} className="flex items-center hover:underline">
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold mx-auto">Add New Claim</h1>
        <div className="cursor-pointer" onClick={() => navigate('/user-profile')}>
          {userDetails?.photoURL ? (
            <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
              {userDetails?.displayName ? getInitials(userDetails.displayName) : 'U'}
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <label className="block text-gray-700 font-medium">
              Provider's Name
              <Tippy content="Enter the full name of your healthcare provider">
                <AiOutlineInfoCircle className="inline ml-2 text-gray-500" />
              </Tippy>
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="Enter provider name"
              required
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <label className="block text-gray-700 font-medium">
              Claim Amount
              <Tippy content="Enter the amount you are claiming">
                <AiOutlineInfoCircle className="inline ml-2 text-gray-500" />
              </Tippy>
            </label>
            <input
              type="number"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              placeholder="Enter claim amount"
              required
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <label className="block text-gray-700 font-medium">
              Date of Service
              <Tippy content="Select the date of the service">
                <AiOutlineInfoCircle className="inline ml-2 text-gray-500" />
              </Tippy>
            </label>
            <DatePicker
              selected={dateOfService}
              onChange={(date) => setDateOfService(date)}
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="MM/dd/yyyy"
              placeholderText="Select date of service"
              required
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <label className="block text-gray-700 font-medium">
              Diagnosis Code
              <Tippy content="Enter the diagnosis code provided by your healthcare provider">
                <AiOutlineInfoCircle className="inline ml-2 text-gray-500" />
              </Tippy>
            </label>
            <input
              type="text"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={diagnosisCode}
              onChange={(e) => setDiagnosisCode(e.target.value)}
              placeholder="Enter diagnosis code"
              required
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <label className="block text-gray-700 font-medium">
              Claim Type
              <Tippy content="Select the type of claim">
                <AiOutlineInfoCircle className="inline ml-2 text-gray-500" />
              </Tippy>
            </label>
            <select
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              required
            >
              <option value="">Select claim type</option>
              <option value="medical">Medical</option>
              <option value="dental">Dental</option>
              <option value="vision">Vision</option>
            </select>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <label className="block text-gray-700 font-medium">
              Upload Supporting Documents
              <Tippy content="Upload receipts or medical reports supporting your claim">
                <AiOutlineInfoCircle className="inline ml-2 text-gray-500" />
              </Tippy>
            </label>
            <input
              type="file"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleDocumentUpload}
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 transition duration-200">
            Submit
          </button>
          {responseMessage && (
            <div className="text-green-500 text-center mt-4">{responseMessage}</div>
          )}
        </form>
        <button
          onClick={openHelpChat}
          className="fixed bottom-16 right-6 bg-red-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold"
        >
          ?
        </button>
      </main>
      <Footer />
      <HelpChatModal isOpen={isHelpChatOpen} onClose={closeHelpChat} />
    </div>
  );
}

export default AddNewClaim;
