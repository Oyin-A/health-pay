import React from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Verify Your Email</h1>
        <p className="mt-4 text-gray-600">
          We have sent a verification link to your email. Please check your inbox and click on the link to verify your account.
        </p>
        <p className="mt-4 text-gray-600">Once verified, you can proceed to log in.</p>
        <button
          onClick={handleLogin}
          className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300"
        >
          Log in
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
