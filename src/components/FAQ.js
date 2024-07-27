import React from 'react';
import { faqs } from './data';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function FAQ() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-16">
      <header className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold mx-auto">FAQs</h1>
      </header>
      <main className="px-6 flex-grow">
        <div className="mt-6 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-2">{faq.question}</h2>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default FAQ;
