import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { MdErrorOutline } from 'react-icons/md';

function SignUp() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!displayName) errors.displayName = 'Display Name is required';
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    setError({});
    setLoading(true);

    try {
      console.log('Attempting to create user with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);

      await updateProfile(userCredential.user, { displayName });
      console.log('Profile updated with display name:', displayName);

      const user = userCredential.user;
      const userDocRef = doc(firestore, 'users', user.uid);

      await setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        paymentMethods: []
      });

      console.log('User document created in Firestore:', user.uid);
      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during sign-up:', error);
      setLoading(false);
      setError({ general: error.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-br from-indigo-900 to-transparent animate-gradient-x"></div>
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Sign Up</h2>
          <p className="text-lg text-gray-200 font-poppins">Create your HealthPay account to manage healthcare expenses and track insurance claims easily.</p>
        </div>
        <form className="w-full space-y-6" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="displayName" className="sr-only">Display Name</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              className="appearance-none rounded-lg block w-full px-5 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            {error.displayName && (
              <p className="text-red-600 text-sm flex items-center mt-1">
                <MdErrorOutline className="mr-1" /> {error.displayName}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-lg block w-full px-5 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && (
              <p className="text-red-600 text-sm flex items-center mt-1">
                <MdErrorOutline className="mr-1" /> {error.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-lg block w-full px-5 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && (
              <p className="text-red-600 text-sm flex items-center mt-1">
                <MdErrorOutline className="mr-1" /> {error.password}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-lg block w-full px-5 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error.confirmPassword && (
              <p className="text-red-600 text-sm flex items-center mt-1">
                <MdErrorOutline className="mr-1" /> {error.confirmPassword}
              </p>
            )}
          </div>
          {error.general && (
            <p className="text-red-600 text-center">{error.general}</p>
          )}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"></path>
                </svg>
              ) : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-200">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-300 hover:text-indigo-100 transition-colors duration-300">
              Sign In
            </Link>
          </p>
        </div>
      </main>
      <footer className="w-full bg-black py-4 text-gray-200 text-center">
        <p className="text-sm">Need help? Contact our support team.</p>
        <p className="text-sm">Email: support@healthpay.com</p>
      </footer>
    </div>
  );
}

export default SignUp;
