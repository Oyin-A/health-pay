// src/components/PaymentForm.js

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const { error: backendError, clientSecret } = await axios.post('/api/stripe/create-payment-intent', {
      amount: 2000, // Example amount in cents
      currency: 'usd',
    }).then((res) => res.data);

    if (backendError) {
      setMessage(backendError.message);
      setIsProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      setMessage('Payment successful!');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={isProcessing} type="submit">
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default PaymentForm;
