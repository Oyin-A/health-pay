import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await auth.sendPasswordResetEmail(email);
      setMessage('Password reset link has been sent to your email address');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100 px-4 py-8">
      <div className="w-full bg-black py-4 text-white text-center">
        <h1 className="text-lg font-bold">HealthPay</h1>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-black">Forgot Password</h2>
            <p className="text-gray-700">Enter your email address below to receive a password reset link.</p>
          </div>
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Email Address</label>
                <input id="email-address" name="email" type="email" autoComplete="email" required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email Address"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            {message && <p className="text-green-500 text-center">{message}</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div>
              <button type="submit"
                className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Send Reset Link
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Back to Login Page</a>
          </div>
        </div>
      </div>
      <div className="w-full bg-black py-4 text-white text-center">
        <p className="text-sm">Need help? Contact our support team.</p>
        <p className="text-sm">Email: support@healthpay.com</p>
      </div>
    </div>
  );
}

export default ForgotPassword;
