import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactTyped as Typed } from 'react-typed';

function WelcomeScreen() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-400 to-blue-600 text-white px-4">
      <div className="absolute top-0 left-0 w-full h-full bg-fixed bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}></div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="text-7xl font-pacifico text-white mb-6 drop-shadow-lg animate-pulse">
          Welcome to HealthPay
        </h1>
        <p className="text-3xl text-white mb-8 drop-shadow-md font-poppins">
          An app where you can manage
        </p>
        <Typed
          className="text-4xl text-yellow-300 mb-12 drop-shadow-md font-poppins"
          strings={[
            'claims',
            'health bills',
            'advisor appointments',
            'insurance policies',
            'medical records',
            'target goals',
            'saving progress',
            'medical history',
            'appointments',
            'and much more!'
          ]}
          typeSpeed={50}
          backSpeed={30}
          loop
        />
        <img src="/welcomeimg.jpeg" alt="Welcome" className="mb-8 w-64 h-64 transform hover:scale-110 transition-transform duration-500 ease-in-out rounded-full shadow-xl" />
        <button
          onClick={handleGetStarted}
          className="bg-yellow-500 text-black py-4 px-10 rounded-full hover:bg-yellow-600 transform hover:scale-110 transition-transform duration-300 ease-in-out shadow-2xl"
        >
          Get Started
        </button>
      </div>
      <div className="absolute bottom-4 text-sm text-gray-300">© 2024 HealthPay. All rights reserved.</div>
    </div>
  );
}

export default WelcomeScreen;
