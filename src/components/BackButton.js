// src/components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="absolute left-4 top-4 bg-gray-200 p-2 rounded-full"
      style={{ zIndex: 10 }}
    >
      <span role="img" aria-label="back">🔙</span> {/* You can replace this with an icon */}
    </button>
  );
}

export default BackButton;
