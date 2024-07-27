import React from 'react';
import { useNavigate } from 'react-router-dom';


function WelcomeScreen() {
  const navigate = useNavigate();
  

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4">
      <div className="absolute top-0 left-0 w-full h-full bg-fixed bg-cover bg-center opacity-50" style={{ backgroundImage: "url('/path-to-your-background-image.jpg')" }}></div>
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-6xl font-extrabold mb-4 text-center drop-shadow-lg animate-pulse">HealthPay</h1>
        <p className="text-2xl text-center mb-8 drop-shadow-md">Simplify healthcare payments and claims tracking.</p>
        <img src="\welcomeimg.jpeg" alt="Welcome" className="mb-8 w-64 h-64 transform hover:scale-110 transition-transform duration-500 ease-in-out rounded-full shadow-xl" />
        <button
          onClick={handleGetStarted}
          className="bg-black text-white py-3 px-8 rounded-full hover:bg-gray-900 transform hover:scale-110 transition-transform duration-300 ease-in-out shadow-xl"
        >
          Get Started
        </button>
      </div>
      <div className="absolute bottom-4 text-sm text-gray-300">© 2024 HealthPay. All rights reserved.</div>
    </div>
  );
}

export default WelcomeScreen;
