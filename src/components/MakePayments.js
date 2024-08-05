import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import HelpChatModal from './HelpChatModal';
import { getUserDetails } from './authService';
import {
  FiArrowLeft, FiUser, FiPlusCircle, FiInfo, FiLoader, FiTrash, FiBell, FiEdit,
} from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCcVisa, faCcMastercard, faCcAmex, faCcDiscover,
} from '@fortawesome/free-brands-svg-icons';
import {
  faCreditCard, faLock,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Modal from 'react-modal';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

Modal.setAppElement('#root');

function MakePayments() {
  const navigate = useNavigate();
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2023-07-20', method: 'Visa **** 1234', amount: '$200', status: 'Completed', transactionId: 'TXN12345' },
    { id: 2, date: '2023-07-18', method: 'Mastercard **** 5678', amount: '$150', status: 'Pending', transactionId: 'TXN12346' },
    { id: 3, date: '2023-07-15', method: 'Amex **** 9101', amount: '$300', status: 'Failed', transactionId: 'TXN12347' }
  ]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

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

  const getInitials = useCallback((name) => {
    return name.split(' ').map(word => word[0]).join('');
  }, []);

  const addNotification = useCallback((message) => {
    setNotifications((prev) => [...prev, { message, timestamp: new Date() }]);
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

  const handleNewPaymentMethodChange = (e) => setNewPaymentMethod(e.target.value);

  const getCardIcon = (method) => {
    if (method.includes('Visa')) return faCcVisa;
    if (method.includes('Mastercard')) return faCcMastercard;
    if (method.includes('Amex')) return faCcAmex;
    if (method.includes('Discover')) return faCcDiscover;
    return faCreditCard;
  };

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter(transaction =>
      transaction.method.toLowerCase().includes(filter.toLowerCase())
    );
    return filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.date) - new Date(b.date);
      }
      return new Date(b.date) - new Date(a.date);
    });
  }, [transactions, filter, sortOrder]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 pb-12 relative transition-colors duration-500">
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 py-4 px-6 shadow-md flex justify-between items-center text-white">
        <button onClick={() => navigate(-1)} className="flex items-center hover:underline">
          <FiArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">Make Payments</h1>
        <div className="flex items-center space-x-4">
          <div className="cursor-pointer" onClick={() => navigate('/user-profile')}>
            {userDetails?.photoURL ? (
              <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                {userDetails?.displayName ? getInitials(userDetails.displayName) : <FiUser className="h-6 w-6" />}
              </div>
            )}
          </div>
        </div>
      </header>
      {isLoading ? (
        <div className="flex-grow flex justify-center items-center">
          <Skeleton count={3} />
        </div>
      ) : (
        <main className="flex-grow p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {userDetails?.displayName || 'User'}!</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Manage your payment methods</h2>
            <div className="space-y-4">
              {transactions.map((method) => (
                <div key={method.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={getCardIcon(method.method)} className="w-8 h-8 text-blue-500 mr-4" />
                    <div className="ml-4">
                      <p className="text-gray-900 font-medium">{method.method}</p>
                      <p className="text-gray-500">Expires 12/23</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tippy content="Set as default payment method">
                      <button className="text-white bg-black py-1 px-3 rounded-md shadow-md">Default</button>
                    </Tippy>
                    <Tippy content="Edit payment method">
                      <button className="text-blue-500 hover:text-blue-700">
                        <FiEdit className="h-5 w-5" />
                      </button>
                    </Tippy>
                    <Tippy content="Remove payment method">
                      <button className="text-red-500 hover:text-red-700" onClick={() => handleRemovePaymentMethod(method)}>
                        <FiTrash className="h-5 w-5" />
                      </button>
                    </Tippy>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <select
                value={newPaymentMethod}
                onChange={handleNewPaymentMethodChange}
                className="w-full bg-gray-100 text-gray-900 py-2 px-4 rounded-md shadow-md"
              >
                <option value="" disabled>Select Payment Method</option>
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
                <option value="discover">Discover</option>
              </select>
              <button
                onClick={handleAddPaymentMethod}
                className="w-full bg-black text-white py-2 px-4 mt-4 rounded-md shadow-md transform transition-transform hover:scale-105 flex items-center justify-center"
              >
                <FiPlusCircle className="mr-2" />
                Add New Payment Method
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faLock} className="w-8 h-8 mr-4 text-yellow-600" />
                  <div>
                    <p className="text-gray-900">Secure Payments Enabled</p>
                    <p className="text-gray-500">Extra security with two-factor authentication</p>
                  </div>
                </div>
                <button onClick={() => addNotification('Secure Payments Disabled')} className="text-white bg-blue-500 py-1 px-3 rounded-md shadow-md hover:bg-blue-600">Disable</button>
              </div>
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
                <div className="flex items-center">
                  <FiBell className="w-8 h-8 mr-4 text-red-600" />
                  <div>
                    <p className="text-gray-900">Payment Notifications</p>
                    <p className="text-gray-500">Receive notifications for all payment actions</p>
                  </div>
                </div>
                <button onClick={() => addNotification('Payment Notifications Enabled')} className="text-white bg-blue-500 py-1 px-3 rounded-md shadow-md hover:bg-blue-600">Enable</button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-bold mb-4">Payment History</h2>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Filter by payment method"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-grow bg-gray-100 text-gray-900 py-2 px-4 rounded-md shadow-md"
              />
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="ml-4 text-white bg-blue-500 py-2 px-4 rounded-md shadow-md hover:bg-blue-600"
              >
                Sort by Date {sortOrder === 'asc' ? '▲' : '▼'}
              </button>
            </div>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-md shadow-sm">
                  <div>
                    <p className="text-gray-900">{transaction.date}</p>
                    <p className="text-gray-500">{transaction.method}</p>
                    <p className="text-gray-400">{transaction.transactionId} - {transaction.status}</p>
                  </div>
                  <p className="text-gray-900">{transaction.amount}</p>
                  <Tippy content="Remove">
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleRemovePaymentMethod(transaction)}>
                      <FiTrash className="h-5 w-5" />
                    </button>
                  </Tippy>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button className="text-white bg-blue-500 py-2 px-4 rounded-md shadow-md hover:bg-blue-600">Previous</button>
              <button className="text-white bg-blue-500 py-2 px-4 rounded-md shadow-md hover:bg-blue-600">Next</button>
            </div>
          </div>
          {notifications.map((notification, index) => (
            <div key={index} className="fixed top-16 right-6 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
              {notification.message}
              <span className="text-sm ml-2">({notification.timestamp.toLocaleTimeString()})</span>
            </div>
          ))}
          <button
            onClick={openHelpChat}
            className="fixed bottom-16 right-6 bg-red-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold transform transition-transform hover:scale-110 hover:bg-red-600"
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
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-900 py-2 px-4 rounded-md shadow-md hover:bg-gray-400">Cancel</button>
            <button onClick={confirmRemovePaymentMethod} className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600">Remove</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default MakePayments;
