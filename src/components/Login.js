import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from './authService';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/login', { email, password });
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      setError('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white px-4">
      <main className="relative flex flex-col items-center justify-center z-10 space-y-6 w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">Welcome!</h2>
          <p className="text-lg text-gray-700">Enter your details to login</p>
        </div>
        <form className="w-full space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-lg block w-full px-5 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 bg-white"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type={passwordVisible ? 'text' : 'password'}
              autoComplete="current-password"
              required
              className="appearance-none rounded-lg block w-full px-5 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300 bg-white"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={handlePasswordToggle}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">Forgot password?</a>
            </div>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path d="M12 2a10 10 0 0 1 0 20" className="opacity-75" fill="currentColor" />
                </svg>
              ) : 'Log in'}
            </button>
          </div>
        </form>
        <div className="mt-8 text-center w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-700">or</span>
            </div>
          </div>
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center shadow-lg transition duration-300"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.283 10.356h-8.327v3.451h4.843c-.693 1.907-2.446 3.285-4.843 3.285-2.947 0-5.344-2.42-5.344-5.4s2.397-5.4 5.344-5.4c1.466 0 2.788.558 3.804 1.461l2.847-2.868c-1.822-1.752-4.237-2.831-6.851-2.831-5.622 0-10.178 4.573-10.178 10.184s4.556 10.184 10.178 10.184c5.487 0 9.778-4.246 10.179-9.623.014-.215.02-.429.02-.646v-1.805h-4.674v-.001z" />
              </svg>
              <span className="ml-2">Sign in with Google</span>
            </button>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
