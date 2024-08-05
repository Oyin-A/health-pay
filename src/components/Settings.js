import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import {
  AiOutlineArrowLeft,
  AiOutlineSafetyCertificate,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineQuestionCircle,
  AiOutlineDatabase,
  AiOutlineLogout,
  AiOutlineDelete,
  AiOutlineBell,
  AiOutlineInfoCircle,
} from 'react-icons/ai';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { FaLanguage } from 'react-icons/fa';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [textSize, setTextSize] = useState('text-base');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const confirmDeletion = () => {
    setShowConfirmation(false);
    alert('Account deleted');
  };

  const handleTextSizeChange = (size) => {
    setTextSize(size);
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg');
    document.documentElement.classList.add(size);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} pb-16`}>
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-white">
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
        <div></div>
      </header>
      <main className="px-6 flex-grow space-y-6 mt-8">
        <section className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Security Preferences</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150">
              <span>Two-Factor Authentication</span>
              <AiOutlineSafetyCertificate className="text-xl" />
            </button>
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
              onClick={() => setShowConfirmation(true)}
            >
              <span>Account Deletion</span>
              <AiOutlineDelete className="text-xl" />
            </button>
          </div>
        </section>
        <section className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150">
              <span>Email Notifications</span>
              <input type="checkbox" className="form-checkbox" />
              <AiOutlineMail className="text-xl" />
            </div>
            <div className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150">
              <span>SMS Notifications</span>
              <input type="checkbox" className="form-checkbox" />
              <AiOutlinePhone className="text-xl" />
            </div>
            <div className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150">
              <span>Push Notifications</span>
              <input type="checkbox" className="form-checkbox" />
              <AiOutlineBell className="text-xl" />
            </div>
          </div>
        </section>
        <section className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Data Sharing Permissions</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150">
              <span>Manage Permissions</span>
              <AiOutlineDatabase className="text-xl" />
            </button>
          </div>
        </section>
        <section className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">App Preferences</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150">
              <span>Language Settings</span>
              <FaLanguage className="text-xl" />
            </button>
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
              onClick={toggleDarkMode}
            >
              <span>Theme Settings</span>
              {darkMode ? <MdOutlineLightMode className="text-xl" /> : <MdOutlineDarkMode className="text-xl" />}
            </button>
            <div className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150">
              <span>Text Size</span>
              <div className="flex items-center space-x-2">
                <button
                  className={`px-2 py-1 rounded ${textSize === 'text-sm' ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                  onClick={() => handleTextSizeChange('text-sm')}
                >
                  Small
                </button>
                <button
                  className={`px-2 py-1 rounded ${textSize === 'text-base' ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                  onClick={() => handleTextSizeChange('text-base')}
                >
                  Medium
                </button>
                <button
                  className={`px-2 py-1 rounded ${textSize === 'text-lg' ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                  onClick={() => handleTextSizeChange('text-lg')}
                >
                  Large
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Support</h2>
          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
              onClick={() => navigate('/faq')}
            >
              <span>FAQs</span>
              <AiOutlineQuestionCircle className="text-xl" />
            </button>
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
              onClick={() => navigate('/customer-service')}
            >
              <span>Contact Customer Service</span>
              <AiOutlinePhone className="text-xl" />
            </button>
          </div>
        </section>
        <section className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Help & Guides</h2>
          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
              onClick={() => navigate('/tutorials')}
            >
              <span>User Guides</span>
              <AiOutlineInfoCircle className="text-xl" />
            </button>
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
              onClick={() => navigate('/video-tutorials')}
            >
              <span>Video Tutorials</span>
              <AiOutlineInfoCircle className="text-xl" />
            </button>
          </div>
        </section>
        <section className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="space-y-4">
            <button
              className="w-full flex items-center justify-between p-4 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-150"
              onClick={() => navigate('/login')}
            >
              <span>Logout</span>
              <AiOutlineLogout className="text-xl" />
            </button>
          </div>
        </section>
      </main>
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Account Deletion</h2>
            <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition duration-150"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150"
                onClick={confirmDeletion}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Settings;
