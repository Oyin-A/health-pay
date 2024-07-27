import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import HelpChatModal from './HelpChatModal';
import { getUserDetails } from './authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover } from '@fortawesome/free-brands-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Modal from 'react-modal';
import { faTrashAlt, faEdit, faUniversity, faSun, faMoon, faSpinner, faPlusCircle, faLock, faBell,faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faSomeBrandIcon } from '@fortawesome/free-brands-svg-icons';
import { faSomeRegularIcon } from '@fortawesome/free-regular-svg-icons';


Modal.setAppElement('#root');

const SecuritySetting = ({ icon, color, title, description, buttonText, onClick }) => (
  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
    <div className="flex items-center">
      <FontAwesomeIcon icon={icon} className={`w-8 h-8 mr-4 ${color}`} />
      <div>
        <p className="text-gray-800">{title}</p>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
    <button onClick={onClick} className="text-white bg-blue-500 py-1 px-3 rounded-md shadow-md hover:bg-blue-600">{buttonText}</button>
  </div>
);
const getCardIcon = (cardType) => {
    switch(cardType) {
        case 'visa':
            return <FontAwesomeIcon icon={faCcVisa} />;
        case 'mastercard':
            return <FontAwesomeIcon icon={faCcMastercard} />;
        case 'amex':
            return <FontAwesomeIcon icon={faCcAmex} />;
        // Add more card types as needed
        default:
            return <FontAwesomeIcon icon={faCreditCard} />;
    }
};

const TransactionItem = ({ transaction, onRemove }) => (
  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
    <div>
      <p className="text-gray-800">{transaction.date}</p>
      <p className="text-gray-500">{transaction.method}</p>
    </div>
    <p className="text-gray-800">{transaction.amount}</p>
    <Tippy content="Remove">
      <button className="text-red-500 hover:text-red-700" onClick={() => onRemove(transaction)}>
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </Tippy>
  </div>
);

const PaymentMethod = ({ method, onRemove }) => (
  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
    <div className="flex items-center">
      <FontAwesomeIcon icon={getCardIcon(method)} className="w-8 h-8 mr-4" />
      <div>
        <p className="text-gray-800">{method.method}</p>
        <p className="text-gray-500">Expires 12/23</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <button className="text-white bg-black py-1 px-3 rounded-md shadow-md">Default</button>
      <Tippy content="Edit">
        <button className="text-blue-500 hover:text-blue-700">
          <FontAwesomeIcon icon={faEdit} />
        </button>
      </Tippy>
      <Tippy content="Remove">
        <button className="text-red-500 hover:text-red-700" onClick={() => onRemove(method)}>
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </Tippy>
    </div>
  </div>
);

function MakePayments() {
  const navigate = useNavigate();
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getUserDetails();
        setUserDetails(details);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUserDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const openHelpChat = () => setIsHelpChatOpen(true);
  const closeHelpChat = () => setIsHelpChatOpen(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getInitials = useCallback((name) => {
    return name.split(' ').map(word => word[0]).join('');
  }, []);

  const addNotification = useCallback((message) => {
    setNotifications((prev) => [...prev, message]);
    setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 3000);
  }, []);

  const handleAddPaymentMethod = () => {
    addNotification('Payment method added successfully!');
    // navigate to add new payment method page
  };

  const handleRemovePaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    setIsModalOpen(true);
  };

  const confirmRemovePaymentMethod = () => {
    addNotification(`${selectedPaymentMethod.method} removed successfully!`);
    setIsModalOpen(false);
    // Implement the removal logic here
  };

  const getCardIcon = (method) => {
    if (method.includes('Visa')) return faCcVisa;
    if (method.includes('Mastercard')) return faCcMastercard;
    if (method.includes('Amex')) return faCcAmex;
    if (method.includes('Discover')) return faCcDiscover;
    return faUniversity;
  };

  const handleNewPaymentMethodChange = (e) => setNewPaymentMethod(e.target.value);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction =>
      transaction.method.toLowerCase().includes(filter.toLowerCase())
    );
  }, [transactions, filter]);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gradient-to-r from-green-400 to-blue-500 text-white'} pb-12 relative transition-colors duration-500`}>
      <header className="bg-black py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-white flex items-center hover:underline">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-2">Back</span>
        </button>
        <h1 className="text-2xl font-bold">Make Payments</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="text-white transition-transform transform hover:scale-110">
            {darkMode ? <FontAwesomeIcon icon={faSun} className="h-6 w-6" /> : <FontAwesomeIcon icon={faMoon} className="h-6 w-6" />}
          </button>
          <div className="cursor-pointer" onClick={() => navigate('/user-profile')}>
            {userDetails?.photoURL ? (
              <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                {userDetails?.displayName ? getInitials(userDetails.displayName) : 'U'}
              </div>
            )}
          </div>
        </div>
      </header>
      {isLoading ? (
        <div className="flex-grow flex justify-center items-center">
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
      ) : (
        <main className="flex-grow p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {userDetails?.displayName || 'User'}!</h2>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-black">Manage your payment methods</h2>
            <div className="space-y-4">
              {filteredTransactions.map((method) => (
                <PaymentMethod key={method.id} method={method} onRemove={handleRemovePaymentMethod} />
              ))}
            </div>
            <div className="mt-6">
              <select
                value={newPaymentMethod}
                onChange={handleNewPaymentMethodChange}
                className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-md shadow-md"
              >
                <option value="" disabled>Select Payment Method</option>
      <FontAwesomeIcon icon={faCcVisa} />
      <FontAwesomeIcon icon={faCcMastercard} />
      <FontAwesomeIcon icon={faCcAmex} />
      <FontAwesomeIcon icon={faCcDiscover} />
                  <FontAwesomeIcon icon={faTrashAlt} />
            <FontAwesomeIcon icon={faEdit} />
            <FontAwesomeIcon icon={faUniversity} />
            <FontAwesomeIcon icon={faSun} />
            <FontAwesomeIcon icon={faMoon} />
            <FontAwesomeIcon icon={faSpinner} />
            <FontAwesomeIcon icon={faPlusCircle} />
            <FontAwesomeIcon icon={faLock} />
            <FontAwesomeIcon icon={faBell} />

              </select>
              <button
                onClick={handleAddPaymentMethod}
                className="w-full bg-black text-white py-2 px-4 mt-4 rounded-md shadow-md transform transition-transform hover:scale-105 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                Add New Payment Method
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-black">Security Settings</h2>
            <div className="space-y-4">
              <SecuritySetting 
                icon={faLock} 
                color="text-yellow-600" 
                title="Secure Payments Enabled" 
                description="Extra security with two-factor authentication" 
                buttonText="Disable" 
                onClick={() => addNotification('Secure Payments Disabled')}
              />
              <SecuritySetting 
                icon={faLock} 
                color="text-red-600" 
                title="Payment Notifications" 
                description="Receive notifications for all payment actions" 
                buttonText="Enable" 
                onClick={() => addNotification('Payment Notifications Enabled')}
              />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-black">Payment History</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Filter by payment method"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-grow bg-gray-200 text-gray-900 py-2 px-4 rounded-md shadow-md"
              />
            </div>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} onRemove={handleRemovePaymentMethod} />
              ))}
            </div>
          </div>
          {notifications.map((notification, index) => (
            <div key={index} className="fixed top-16 right-6 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
              <FontAwesomeIcon icon={faBell} className="mr-2" /> {notification}
            </div>
          ))}
          <button
            onClick={openHelpChat}
            className="fixed bottom-16 right-6 bg-red-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold transform transition-transform hover:scale-110"
          >
            ?
          </button>
        </main>
      )}
      <Footer />
      <HelpChatModal isOpen={isHelpChatOpen} onClose={closeHelpChat} />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirm Remove Payment Method"
        className="fixed inset-0 flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">Remove Payment Method</h2>
          <p>Are you sure you want to remove {selectedPaymentMethod?.method}?</p>
          <div className="mt-6 flex justify-end space-x-4">
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-md hover:bg-gray-400">Cancel</button>
            <button onClick={confirmRemovePaymentMethod} className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600">Remove</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MakePayments;
