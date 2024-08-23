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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validate = () => {
    const errors = {};
    if (!displayName) errors.displayName = 'Display Name is required';
    if (!email) errors.email = 'Email is required';
    else if (!validateEmail(email)) errors.email = 'Invalid email format';

    if (!password) errors.password = 'Password is required';
    else if (!validatePassword(password)) {
      errors.password = 'Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character';
    }

    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (!phoneNumber) errors.phoneNumber = 'Phone number is required';
    else if (!validatePhoneNumber(phoneNumber)) errors.phoneNumber = 'Invalid phone number format';

    if (!address) errors.address = 'Address is required';
    if (!dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!gender) errors.gender = 'Gender is required';
    if (!securityQuestion) errors.securityQuestion = 'Security question is required';
    if (!securityAnswer) errors.securityAnswer = 'Security answer is required';
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });

      const user = userCredential.user;
      const userDocRef = doc(firestore, 'users', user.uid);

      await setDoc(userDocRef, {
        displayName: user.displayName,
        email: user.email,
        phoneNumber,
        address,
        dateOfBirth,
        gender,
        securityQuestion,
        securityAnswer,
        photoURL: user.photoURL,
        paymentMethods: [],
      });

      setLoading(false);
      navigate('/dashboard');
    } catch (error) {
      setLoading(false);
      setError({ general: error.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-60"></div>
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg p-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-2">Sign Up</h2>
          <p className="text-lg text-gray-200">Create your HealthPay account to manage your healthcare expenses and track insurance claims effortlessly.</p>
        </div>
        <form className="w-full space-y-6" onSubmit={handleSignUp}>
          <div className="relative">
            <input
              id="displayName"
              name="displayName"
              type="text"
              required
              className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
              placeholder="Full Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            {error.displayName && (
              <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                <MdErrorOutline className="mr-1" /> {error.displayName}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error.email && (
              <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                <MdErrorOutline className="mr-1" /> {error.email}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <div className="relative w-1/2">
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {error.phoneNumber && (
                <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                  <MdErrorOutline className="mr-1" /> {error.phoneNumber}
                </p>
              )}
            </div>
            <div className="relative w-1/2">
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
              {error.dateOfBirth && (
                <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                  <MdErrorOutline className="mr-1" /> {error.dateOfBirth}
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <input
              id="address"
              name="address"
              type="text"
              required
              className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
              placeholder="Home Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {error.address && (
              <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                <MdErrorOutline className="mr-1" /> {error.address}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <div className="relative w-1/2">
              <select
                id="gender"
                name="gender"
                required
                className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {error.gender && (
                <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                  <MdErrorOutline className="mr-1" /> {error.gender}
                </p>
              )}
            </div>
            <div className="relative w-1/2">
              <input
                id="securityQuestion"
                name="securityQuestion"
                type="text"
                required
                className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
                placeholder="Security Question"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
              />
              {error.securityQuestion && (
                <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                  <MdErrorOutline className="mr-1" /> {error.securityQuestion}
                </p>
              )}
            </div>
          </div>

          <div className="relative">
            <input
              id="securityAnswer"
              name="securityAnswer"
              type="text"
              required
              className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
              placeholder="Security Answer"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
            />
            {error.securityAnswer && (
              <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                <MdErrorOutline className="mr-1" /> {error.securityAnswer}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error.password && (
              <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                <MdErrorOutline className="mr-1" /> {error.password}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              required
              className="appearance-none rounded-lg w-full px-5 py-3 bg-white bg-opacity-80 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-opacity-100 transition duration-300"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error.confirmPassword && (
              <p className="text-red-600 text-sm absolute top-full mt-1 flex items-center">
                <MdErrorOutline className="mr-1" /> {error.confirmPassword}
              </p>
            )}
          </div>
          {error.general && (
            <p className="text-red-600 text-center mt-4">{error.general}</p>
          )}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition duration-300 shadow-lg"
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
            <Link to="/login" className="font-medium text-pink-300 hover:text-pink-100 transition-colors duration-300">
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
