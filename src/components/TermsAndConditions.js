import React from 'react';
import { useNavigate } from 'react-router-dom';

function TermsAndConditions() {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div className="w-full bg-black py-4 text-white text-center">
        <h1 className="text-lg font-bold">HealthPay Terms & Conditions</h1>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow px-4 py-8">
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-2xl font-bold text-black">Introduction</h2>
          <p className="text-gray-700">Welcome to HealthPay. Please read these terms and conditions carefully before using our app...</p>
          <h3 className="text-xl font-bold text-black mt-4">User Responsibilities</h3>
          <p className="text-gray-700">As a user, you are responsible for keeping your account information confidential...</p>
          <h3 className="text-xl font-bold text-black mt-4">Data Privacy</h3>
          <p className="text-gray-700">We prioritize your data privacy. All your information is securely stored and managed...</p>
          <h3 className="text-xl font-bold text-black mt-4">Payment Terms</h3>
          <p className="text-gray-700">All payments made through the HealthPay app are processed securely. Please ensure you have sufficient funds...</p>
          <h3 className="text-xl font-bold text-black mt-4">Contact Us</h3>
          <p className="text-gray-700">If you have any questions about these terms, please contact us at support@healthpay.com...</p>
          <h3 className="text-xl font-bold text-black mt-4">License to Use App</h3>
          <p className="text-gray-700">You are granted a limited, non-exclusive, non-transferable license to access and use the HealthPay app...</p>
          <h3 className="text-xl font-bold text-black mt-4">Prohibited Uses</h3>
          <p className="text-gray-700">...</p>
        </div>
        <div className="flex justify-around mt-6 w-full max-w-3xl">
          <button
            onClick={() => navigate('/signup')}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
