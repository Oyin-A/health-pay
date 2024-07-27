import React from 'react';
import { useNavigate } from 'react-router-dom';

function WelcomeAfterAcceptance() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div className="w-full bg-black py-4 text-white text-center fixed top-0 left-0 right-0 z-10">
        <h1 className="text-lg font-bold">HealthPay</h1>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow px-4 mt-20 mb-20">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden p-6 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Welcome to HealthPay</h2>
          <p className="text-gray-700 mb-8">Thank you for accepting the terms and conditions. You can now start using our app to manage your healthcare payments effortlessly.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 mb-4"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            Go to Profile
          </button>
        </div>
      </div>
      <div className="w-full bg-black py-4 text-white text-center fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-center space-x-4">
          <a href="/privacy-policy" className="text-sm">Privacy Policy</a>
          <a href="/terms-of-service" className="text-sm">Terms of Service</a>
          <a href="/contact-us" className="text-sm">Contact Us</a>
        </div>
      </div>
    </div>
  );
}

export default WelcomeAfterAcceptance;
