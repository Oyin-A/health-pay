import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authenticateUser } from '../services/healthcareProviderService';

function LinkHealthcareProvider() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get('code');

    if (code) {
      authenticateUser(code).then((data) => {
        // Save tokens in local storage or state
        localStorage.setItem('accessToken', data.access_token);
        navigate('/dashboard');
      });
    }
  }, [location, navigate]);

  const handleLinkAccount = () => {
    const authUrl = 'https://api.healthcareprovider.com/oauth/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI';
    window.location.href = authUrl;
  };

  return (
    <div className="link-healthcare-provider">
      <button onClick={handleLinkAccount} className="px-4 py-2 bg-blue-500 text-white rounded-md">
        Link Healthcare Provider
      </button>
    </div>
  );
}

export default LinkHealthcareProvider;
