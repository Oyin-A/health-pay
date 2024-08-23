import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase'; // Import your Firebase configuration
import { MdErrorOutline, MdCheckCircleOutline } from 'react-icons/md';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setError('Failed to send password reset email.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-6 p-8 bg-gray-100 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Reset Your Password</h1>
        <form onSubmit={handlePasswordReset}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {message && (
            <p className="text-green-600 text-sm flex items-center mt-2">
              <MdCheckCircleOutline className="mr-1" /> {message}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm flex items-center mt-2">
              <MdErrorOutline className="mr-1" /> {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition duration-200"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
