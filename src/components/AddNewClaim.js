import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { AiOutlineArrowLeft, AiOutlineInfoCircle } from 'react-icons/ai';

function AddNewClaim() {
  const navigate = useNavigate();
  const [providerName, setProviderName] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [dateOfService, setDateOfService] = useState(new Date());
  const [claimType, setClaimType] = useState('');
  const [document, setDocument] = useState(null); // Optional field
  const [comments, setComments] = useState(''); // Optional field
  const [responseMessage, setResponseMessage] = useState('');

  const generateRandomClaimId = () => {
    return Math.floor(10000 + Math.random() * 90000); // Generate a random 5-digit number
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fetch existing claims from localStorage
    const existingClaims = JSON.parse(localStorage.getItem('claims')) || [];
    const newClaimId = generateRandomClaimId(); // Generate realistic random claim ID

    const newClaim = {
      id: newClaimId, // Use the random ID
      providerName,
      amount: `$${claimAmount}`, 
      date: dateOfService.toLocaleDateString(),
      claimType,
      status: 'Pending',
      document, 
      comments, 
    };

    console.log('New Claim Submitted:', newClaim);

    // Store new claim in localStorage
    const updatedClaims = [...existingClaims, newClaim];
    localStorage.setItem('claims', JSON.stringify(updatedClaims));

    setResponseMessage('Your claim has been submitted successfully!');

    // Clear form fields
    setProviderName('');
    setClaimAmount('');
    setDateOfService(new Date());
    setClaimType('');
    setDocument(null);
    setComments('');

    // Redirect after showing the success message
    setTimeout(() => {
      setResponseMessage('');
      navigate('/make-claims');
    }, 3000);
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
              <Tippy content="Upload receipts or medical reports supporting your claim (optional)">
                <AiOutlineInfoCircle className="inline ml-2 text-gray-500" />
              </Tippy>
            </label>
            <input
              type="file"
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleDocumentUpload}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <label className="block text-gray-700 font-medium">
              Additional Comments
              <Tippy content="Provide any additional information regarding your claim (optional)">
                <AiOutlineInfoCircle className="inline ml-2 text-gray-500" />
              </Tippy>
            </label>
            <textarea
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter any additional information"
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 transition duration-200">
            Submit
          </button>

          {responseMessage && (
            <div className="text-green-500 text-center mt-4">{responseMessage}</div>
          )}
        </form>
      </main>
    </div>
  );
}

export default AddNewClaim;
