import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'animate.css';
import { motion } from 'framer-motion';
import axios from 'axios';

function Onboarding() {
  const navigate = useNavigate();
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    // Simulate an API call to fetch the features dynamically
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('/api/features'); // Assume an API endpoint exists
        setFeatures(response.data);
      } catch (error) {
        console.error('Error fetching features:', error);
        // Fallback to default features if API fails
        setFeatures([
          {
            img: 'claim.jpeg',
            title: 'Track Insurance Claims',
            description: 'Stay updated with real-time claim status.',
          },
          {
            img: 'savprog.jpeg',
            title: 'Manage Transactions',
            description: 'Easily handle all your healthcare payments.',
          },
          {
            img: 'medhist.jpeg',
            title: 'Secure Data Sharing',
            description: 'Share and manage your healthcare data securely.',
          },
        ]);
      }
    };

    fetchFeatures();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-200 via-purple-300 to-red-400 text-gray-900 overflow-hidden">
      <main className="flex-grow flex flex-col items-center justify-center px-4 space-y-24">
        <motion.div
          className="text-center animate__animated animate__fadeInDown"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-6xl font-extrabold mb-6">Welcome to HealthPay</h1>
          <p className="text-2xl mt-4">Manage your healthcare payments effortlessly</p>
        </motion.div>

        <section className="space-y-32 w-full">
          {features.map((feature, index) => (
            <motion.div
              className="text-center animate__animated animate__fadeIn"
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.3 }}
              variants={{
                hidden: { opacity: 0, y: 100 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <img
                src={feature.img}
                alt={feature.title}
                className="mx-auto mb-4 w-64 h-64 object-cover rounded-full shadow-2xl transition-transform duration-500 hover:scale-105"
              />
              <h3 className="text-3xl font-semibold">{feature.title}</h3>
              <p className="text-lg mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </section>

        <section className="w-full text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-4xl font-bold">Why Choose HealthPay?</h2>
            <p className="text-xl mt-4">We simplify healthcare payments and claims tracking for you.</p>
            <p className="text-lg mt-4">Secure, reliable, and easy-to-use platform designed for your healthcare needs.</p>
          </motion.div>
        </section>

        <section className="w-full text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-xl mt-4">Join thousands of users who trust HealthPay for their healthcare payments.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 w-full max-w-md py-3 px-4 rounded-md text-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Get Started
            </button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

export default Onboarding;
