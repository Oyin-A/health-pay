// backend/stripe.js

const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = new Stripe('your-secret-key-here'); 

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
