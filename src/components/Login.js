import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import your Firebase configuration
import { FcGoogle } from 'react-icons/fc';
import { FaUniversity } from 'react-icons/fa';
import { MdErrorOutline } from 'react-icons/md';

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState({ google: false, bank: false });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const errorMessages = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'Your account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/network-request-failed': 'Network error. Please try again later.',
    'default': 'An unexpected error occurred. Please try again.'
  };

  const validate = () => {
    const errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      setErrors({ general: errorMessages[error.code] || errorMessages['default'] });
    }
  };

  const handleSSO = (provider) => {
    setSsoLoading({ ...ssoLoading, [provider]: true });
    // Simulate an SSO login
    setTimeout(() => {
      setSsoLoading({ ...ssoLoading, [provider]: false });
      navigate('/dashboard');
    }, 1000); // Simulating a 1-second delay for SSO login
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-br from-indigo-900 to-transparent animate-gradient-x"></div>
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-8">
        <div className="text-center mb-8">
          <p className="text-xl text-gray-200 font-poppins">Enter your details to log in</p>
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
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-lg block w-full px-5 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Email address"
            />
            {errors.email && (
              <p className="text-red-600 text-sm flex items-center mt-1">
                <MdErrorOutline className="mr-1" /> {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-lg block w-full px-5 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-600 text-sm flex items-center mt-1">
                <MdErrorOutline className="mr-1" /> {errors.password}
              </p>
            )}
          </div>
          {errors.general && (
            <p className="text-red-600 text-center mt-4">{errors.general}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-200 font-poppins">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-indigo-300 hover:text-indigo-100 transition-colors duration-300">
                Forgot your password?
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 shadow-lg"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
                </svg>
              ) : 'Log in'}
            </button>
          </div>
        </form>
        <p className="text-center text-lg text-gray-200 mt-6 font-poppins">or</p>
        <div className="w-full space-y-4">
          <button
            onClick={() => handleSSO('google')}
            className="w-full flex items-center justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300 shadow-lg"
            disabled={ssoLoading.google}
            aria-busy={ssoLoading.google}
          >
            {ssoLoading.google ? (
              <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
              </svg>
            ) : (
              <>
                <FcGoogle className="mr-3 h-6 w-6" />
                Sign in with Google
              </>
            )}
          </button>
          <button
            onClick={() => handleSSO('bank')}
            className="w-full flex items-center justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 shadow-lg"
            disabled={ssoLoading.bank}
            aria-busy={ssoLoading.bank}
          >
            {ssoLoading.bank ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
              </svg>
            ) : (
              <>
                <FaUniversity className="mr-3 h-6 w-6" />
                Sign in with Bank
              </>
            )}
          </button>
        </div>
        <p className="text-center text-sm text-gray-200 mt-6 font-poppins">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-indigo-300 hover:text-indigo-100 transition-colors duration-300 cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </main>
    </div>
  );
}

export default Login;
