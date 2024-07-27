import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate to the dashboard on component mount
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white">
      <main className="flex flex-col items-center justify-center w-full max-w-md bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900">Welcome!</h2>
          <p className="text-lg text-gray-700">Redirecting to dashboard...</p>
        </div>
      </main>
    </div>
  );
}

export default Login;
