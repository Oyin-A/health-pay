import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentMethods = ({
  transactions,
  handleRemovePaymentMethod,
  handleAddPaymentMethod,
  getCardIcon
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddNewPaymentMethod = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);

    // Create a payment method using Stripe.js
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      setMessage(error.message);
      setIsProcessing(false);
    } else {
      // Optionally: Send paymentMethod.id to your backend to save it.
      handleAddPaymentMethod(paymentMethod.id);
      setMessage('Payment method added successfully!');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-black">Manage your payment methods</h2>
      <div className="space-y-4">
        {transactions.map((method, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
            <div className="flex items-center">
              <FontAwesomeIcon icon={getCardIcon(method.method)} className="w-8 h-8 mr-4" />
              <div>
                <p className="text-gray-800">{method.method}</p>
                <p className="text-gray-500">Expires 12/23</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-white bg-black py-1 px-3 rounded-md shadow-md">Default</button>
              <Tippy content="Edit">
                <button className="text-blue-500 hover:text-blue-700">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </Tippy>
              <Tippy content="Remove">
                <button className="text-red-500 hover:text-red-700" onClick={() => handleRemovePaymentMethod(method)}>
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </Tippy>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <CardElement className="p-4 bg-gray-200 rounded-md shadow-md" />
        <button
          onClick={handleAddNewPaymentMethod}
          disabled={isProcessing}
          className="w-full bg-black text-white py-2 px-4 mt-4 rounded-md shadow-md transform transition-transform hover:scale-105 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
          {isProcessing ? 'Processing...' : 'Add New Payment Method'}
        </button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default PaymentMethods;
