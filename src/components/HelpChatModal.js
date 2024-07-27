// src/components/HelpChatModal.js
import React, { useState, useEffect, useRef } from 'react';
import { getAIResponse } from './aiChatService';

function HelpChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInput('');
      setError('');
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      setError('Please enter a message.');
      return;
    }

    setError('');
    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const aiResponse = await getAIResponse(input);
      const aiMessage = { sender: 'ai', text: aiResponse };
      setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
    } catch (error) {
      setError('Failed to fetch AI response. Please try again.');
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
          <h2 className="text-lg font-bold mb-4">Help Chat</h2>
          <div className="h-64 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  message.sender === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
                }`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            className="w-full mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <button
            onClick={onClose}
            className="w-full mt-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
}

export default HelpChatModal;
