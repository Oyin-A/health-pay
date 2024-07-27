// src/components/HelpChatWrapper.js
import React, { useState } from 'react';
import Footer from './Footer';
import HelpChatModal from './HelpChatModal';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

const HelpChatWrapper = ({ children }) => {
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);

  const openHelpChat = () => {
    setIsHelpChatOpen(true);
  };

  const closeHelpChat = () => {
    setIsHelpChatOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-12 relative">
      <div className="flex-grow">{children}</div>
      <Footer />
      <button
        onClick={openHelpChat}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        <AiOutlineQuestionCircle />
      </button>
      <HelpChatModal isOpen={isHelpChatOpen} onClose={closeHelpChat} />
    </div>
  );
};

export default HelpChatWrapper;
