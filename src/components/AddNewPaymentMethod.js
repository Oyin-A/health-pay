// src/components/AddNewPaymentMethod.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { addPaymentMethod } from './authService';

function AddNewPaymentMethod() {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [bankDetails, setBankDetails] = useState({ accountNumber: '', routingNumber: '' });

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (paymentType === 'card') {
      setCardDetails({ ...cardDetails, [name]: value });
    } else {
      setBankDetails({ ...bankDetails, [name]: value });
    }
  };

  const handleAddPaymentMethod = async (e) => {
    e.preventDefault();
    const newMethod = paymentType === 'card' ? cardDetails : bankDetails;
    await addPaymentMethod(paymentType, newMethod);
    navigate('/payment-methods');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-12">
      <header className="bg-black text-white py-4 px-6 flex items-center shadow-md">
        <button onClick={() => navigate(-1)} className="text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">Add New Payment Method</h1>
      </header>
      <main className="flex-grow p-4">
        <form onSubmit={handleAddPaymentMethod} className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">Choose Payment Method</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Payment Type</label>
            <select
              value={paymentType}
              onChange={handlePaymentTypeChange}
              className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Account</option>
            </select>
          </div>
          {paymentType === 'card' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Card Number</label>
                <input
                  type="text"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4 flex space-x-4">
                <div className="w-1/2">
                  <label className="block text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-700">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                  />
                </div>
              </div>
            </>
          )}
          {paymentType === 'bank' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankDetails.accountNumber}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Routing Number</label>
                <input
                  type="text"
                  name="routingNumber"
                  value={bankDetails.routingNumber}
                  onChange={handleInputChange}
                  className="mt-2 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </>
          )}
          <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md">
            Add Payment Method
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

export default AddNewPaymentMethod;
