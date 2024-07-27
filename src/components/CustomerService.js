import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

function CustomerService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-16">
      <header className="bg-black text-white py-4 px-6 shadow-md flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold mx-auto">Customer Service</h1>
        <div className="w-6"></div> {/* Placeholder to balance the header */}
      </header>
      <main className="flex-grow p-4 space-y-4 flex flex-col items-center">
        <button className="w-full max-w-md flex items-center justify-between p-4 bg-white rounded-md shadow-md">
          <div className="flex items-center">
            <i className="fas fa-phone-alt text-2xl mr-4"></i>
            <div>
              <h2 className="text-lg font-bold">Call Support</h2>
              <p className="text-gray-700">Speak directly with a support representative.</p>
            </div>
          </div>
        </button>
        <button className="w-full max-w-md flex items-center justify-between p-4 bg-white rounded-md shadow-md">
          <div className="flex items-center">
            <i className="fas fa-comments text-2xl mr-4"></i>
            <div>
              <h2 className="text-lg font-bold">Chat Support</h2>
              <p className="text-gray-700">Get help through live chat with our support team.</p>
            </div>
          </div>
        </button>
        <button className="w-full max-w-md flex items-center justify-between p-4 bg-white rounded-md shadow-md">
          <div className="flex items-center">
            <i className="fas fa-envelope text-2xl mr-4"></i>
            <div>
              <h2 className="text-lg font-bold">Email Support</h2>
              <p className="text-gray-700">Send an email to our support team for assistance.</p>
            </div>
          </div>
        </button>
        <button 
          className="w-full max-w-md flex items-center justify-between p-4 bg-white rounded-md shadow-md"
          onClick={() => navigate('/faq')}
        >
          <div className="flex items-center">
            <i className="fas fa-info-circle text-2xl mr-4"></i>
            <div>
              <h2 className="text-lg font-bold">FAQ</h2>
              <p className="text-gray-700">Find answers to common questions in our FAQ section.</p>
            </div>
          </div>
        </button>
      </main>
      <Footer />
    </div>
  );
}

export default CustomerService;
