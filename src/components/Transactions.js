import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { getUserDetails } from './authService';
import {
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlineSortAscending,
  AiOutlineSortDescending,
  AiOutlineArrowLeft,
  AiOutlinePieChart,
  AiOutlineDollarCircle,
} from 'react-icons/ai';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import 'tailwindcss/tailwind.css';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const transactions = [
  { date: '2023-10-13', description: "Doctor's Visit", amount: 120.00, status: 'Completed' },
  { date: '2023-10-10', description: 'Prescription', amount: 45.00, status: 'Pending' },
  { date: '2023-10-07', description: 'Lab Tests', amount: 200.00, status: 'Completed' },
  { date: '2023-10-05', description: 'Insurance Claim', amount: 500.00, status: 'Pending' },
  { date: '2023-10-02', description: 'Consultation Fee', amount: 75.00, status: 'Completed' },
];

const Transactions = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState({ status: 'all', amount: 'all', startDate: '', endDate: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const transactionsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getUserDetails();
        setUserDetails(details);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = transactions
      .filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter((transaction) => filter.status === 'all' || transaction.status === filter.status)
      .filter(
        (transaction) =>
          filter.amount === 'all' ||
          (filter.amount === 'under100' && transaction.amount < 100) ||
          (filter.amount === 'over100' && transaction.amount >= 100)
      );

    if (filter.startDate) {
      filtered = filtered.filter(
        (transaction) => new Date(transaction.date) >= new Date(filter.startDate)
      );
    }

    if (filter.endDate) {
      filtered = filtered.filter(
        (transaction) => new Date(transaction.date) <= new Date(filter.endDate)
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, filter]);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleSort = () => {
    const sortedTransactions = [...filteredTransactions].sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date)
    );
    setFilteredTransactions(sortedTransactions);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('');
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const applyFilters = () => {
    setIsFilterModalOpen(false);
  };

  const calculateCategoryTotals = () => {
    const categories = {
      "Doctor's Visit": 0,
      Prescription: 0,
      'Lab Tests': 0,
      'Insurance Claim': 0,
      'Consultation Fee': 0,
    };

    transactions.forEach((transaction) => {
      if (categories[transaction.description] !== undefined) {
        categories[transaction.description] += transaction.amount;
      }
    });

    return categories;
  };

  const categoryTotals = calculateCategoryTotals();
  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-purple-50 pb-16">
      <header className="bg-black text-white py-4 px-6 shadow-md flex justify-between items-center relative">
        <button
          onClick={() => navigate(-1)}
          className="text-white hover:text-gray-400 transition-all duration-300"
        >
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold mx-auto">Transactions</h1>
        <div className="cursor-pointer" onClick={() => navigate('/user-profile')}>
          {userDetails?.photoURL ? (
            <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full shadow-md" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
              {userDetails?.displayName ? getInitials(userDetails.displayName) : 'U'}
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center bg-white rounded-lg shadow-md p-2 w-full max-w-lg">
            <AiOutlineSearch className="text-gray-600 w-6 h-6 ml-2" />
            <input
              type="text"
              placeholder="Search transactions"
              className="flex-grow p-2 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center justify-center bg-white rounded-lg shadow-md p-2"
            >
              <AiOutlineFilter className="text-gray-600 w-6 h-6" />
              <span className="ml-2">Filter</span>
            </button>
            <button
              onClick={handleSort}
              className="flex items-center justify-center bg-white rounded-lg shadow-md p-2"
            >
              {sortOrder === 'asc' ? (
                <AiOutlineSortAscending className="text-gray-600 w-6 h-6" />
              ) : (
                <AiOutlineSortDescending className="text-gray-600 w-6 h-6" />
              )}
              <span className="ml-2">Sort</span>
            </button>
            <button
              onClick={() => setIsInsightModalOpen(true)}
              className="flex items-center justify-center bg-white rounded-lg shadow-md p-2"
            >
              <AiOutlinePieChart className="text-gray-600 w-6 h-6" />
              <span className="ml-2">Insights</span>
            </button>
          </div>
        </div>
        {currentTransactions.length ? (
          currentTransactions.map((transaction, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg flex justify-between items-center transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => handleTransactionClick(transaction)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div>
                <p className="text-gray-500">
                  {format(parseISO(transaction.date), 'dd MMM yyyy')}
                </p>
                <p className="font-semibold text-gray-800">{transaction.description}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">${transaction.amount.toFixed(2)}</p>
                <p
                  className={`text-sm ${
                    transaction.status === 'Completed' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.status}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No transactions found</p>
        )}
        <div className="flex justify-center mt-6">
          {Array.from(
            { length: Math.ceil(filteredTransactions.length / transactionsPerPage) },
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-blue-500 border border-blue-500'
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </main>
      <Footer />
      <Modal open={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} center>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Filter Transactions</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center bg-white rounded-lg shadow-md p-2 w-full max-w-md">
              <label htmlFor="status" className="mr-2 text-gray-600">
                Status:
              </label>
              <select
                id="status"
                name="status"
                className="p-2 outline-none rounded-md"
                value={filter.status}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="flex items-center bg-white rounded-lg shadow-md p-2 w-full max-w-md">
              <label htmlFor="amount" className="mr-2 text-gray-600">
                Amount:
              </label>
              <select
                id="amount"
                name="amount"
                className="p-2 outline-none rounded-md"
                value={filter.amount}
                onChange={handleFilterChange}
              >
                <option value="all">All</option>
                <option value="under100">Under $100</option>
                <option value="over100">Over $100</option>
              </select>
            </div>
            <div className="flex items-center bg-white rounded-lg shadow-md p-2 w-full max-w-md">
              <label htmlFor="startDate" className="mr-2 text-gray-600">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="p-2 outline-none rounded-md"
                value={filter.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="flex items-center bg-white rounded-lg shadow-md p-2 w-full max-w-md">
              <label htmlFor="endDate" className="mr-2 text-gray-600">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="p-2 outline-none rounded-md"
                value={filter.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={applyFilters}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </Modal>
      <Modal open={!!selectedTransaction} onClose={() => setSelectedTransaction(null)} center>
        {selectedTransaction && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
            <p>
              <strong>Date:</strong> {format(parseISO(selectedTransaction.date), 'dd MMM yyyy')}
            </p>
            <p>
              <strong>Description:</strong> {selectedTransaction.description}
            </p>
            <p>
              <strong>Amount:</strong> ${selectedTransaction.amount.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {selectedTransaction.status}
            </p>
          </div>
        )}
      </Modal>
      <Modal open={isInsightModalOpen} onClose={() => setIsInsightModalOpen(false)} center>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Transaction Insights</h2>
          <Pie data={data} />
        </div>
      </Modal>
    </div>
  );
};

export default Transactions;
