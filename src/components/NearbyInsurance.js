// src/components/NearbyInsurance.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';

function NearbyInsurance() {
  const [insuranceProviders, setInsuranceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Latitude:', latitude, 'Longitude:', longitude);

          try {
            // Fetch nearby insurance providers using OpenStreetMap's Nominatim API
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/search`, 
              {
                params: {
                  q: 'insurance',
                  format: 'json',
                  limit: 10,
                  lat: latitude,
                  lon: longitude,
                  bounded: 1,
                  viewbox: `${longitude-0.1},${latitude+0.1},${longitude+0.1},${latitude-0.1}`
                },
              }
            );

            console.log('Nominatim API response:', response);

            if (response.status === 200) {
              setInsuranceProviders(response.data);
            } else {
              setError('Error fetching insurance providers');
            }
            setLoading(false);
          } catch (err) {
            console.error('Error fetching nearby insurance providers:', err);
            setError('Failed to fetch nearby insurance providers.');
            setLoading(false);
          }
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Failed to get your location.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading nearby insurance providers...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-16">
      <header className="bg-white py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-BLACK">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold mx-auto">Nearby Insurance Providers</h1>
      </header>
      <main className="flex-grow p-4 space-y-4">
        {insuranceProviders.length > 0 ? (
          insuranceProviders.map((provider) => (
            <div key={provider.place_id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold">{provider.display_name}</h2>
              <p className="text-gray-700">{provider.display_name}</p>
            </div>
          ))
        ) : (
          <div>No nearby insurance providers found.</div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default NearbyInsurance;
