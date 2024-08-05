// src/components/HelpChatModal.js
import React, { useState, useEffect, useRef } from 'react';
import { getAIResponse } from './aiChatService';
import { AiOutlineClose, AiOutlineSend, AiOutlineMessage } from 'react-icons/ai';

const previewMessages = [
  "How can I reset my password?",
  "What are your business hours?",
  "Where can I find the user guide?",
];

function HelpChatModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setInput('');
      setError('');
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) {
      setError('Please enter a message.');
      return;
    }

    setError('');
    const userMessage = { sender: 'user', text: messageText };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setLoading(true);
    try {
      const aiResponse = await getAIResponse(messageText);
      const aiMessage = { sender: 'ai', text: aiResponse };
      setMessages((prevMessages) => [...prevMessages, userMessage, aiMessage]);
    } catch (error) {
      setError('Failed to fetch AI response. Please try again.');
    } finally {
      setLoading(false);
    }

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage(input);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-black">Help Chat</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <AiOutlineClose className="h-6 w-6" />
            </button>
          </div>
          <div className="h-64 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  message.sender === 'user' ? 'bg-blue-100 text-right text-black' : 'bg-gray-100 text-left text-black'
                }`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {messages.length === 0 && (
            <div className="mb-4">
              <h3 className="text-gray-600 mb-2">Try asking:</h3>
              {previewMessages.map((preview, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(preview)}
                  className="w-full mb-2 p-2 text-left bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-black"
                >
                  <AiOutlineMessage className="inline mr-2" />
                  {preview}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-grow p-2 border border-gray-300 rounded-md text-black"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={() => handleSendMessage(input)}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              <AiOutlineSend className="h-5 w-5" />
            </button>
          </div>
          {loading && <p className="text-blue-500 mt-2">Sending...</p>}
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
