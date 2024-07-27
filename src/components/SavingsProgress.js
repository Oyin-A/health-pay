import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Footer from './Footer';
import { AiOutlineArrowLeft, AiOutlineTrophy } from 'react-icons/ai';
import { FaPiggyBank, FaBriefcase, FaHistory } from 'react-icons/fa';
import { MdWbSunny, MdNightsStay } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

ChartJS.register(ArcElement, Tooltip, Legend);

function SavingsProgress() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const data = {
    labels: ['Medical Expenses', 'Insurance Claims', 'Total Savings'],
    datasets: [
      {
        data: [1200, 800, 2000],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-800 text-white' : 'bg-gradient-to-b from-blue-50 to-gray-100 text-gray-900'} pb-16`}>
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-white">
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Savings Progress</h1>
        <div className="flex items-center space-x-2">
          <Tippy content="Toggle Dark Mode">
            <button onClick={toggleDarkMode} className="text-white">
              {darkMode ? <MdWbSunny className="h-6 w-6" /> : <MdNightsStay className="h-6 w-6" />}
            </button>
          </Tippy>
          <Tippy content="Achievements">
            <button onClick={() => navigate('/achievements')} className="text-white">
              <AiOutlineTrophy className="h-6 w-6" />
            </button>
          </Tippy>
        </div>
      </header>
      <main className="flex-grow p-6 space-y-6">
        <section className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <h2 className="text-lg font-bold mb-4">Overall Savings</h2>
          <div className="flex justify-center mb-6" style={{ height: '250px' }}>
            <Pie data={data} options={options} />
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${darkMode ? 'text-blue-200 bg-blue-600' : 'text-blue-600 bg-blue-200'}`}>
                  Savings Progress
                </span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold inline-block ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                  60%
                </span>
              </div>
            </div>
            <div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${darkMode ? 'bg-blue-800' : 'bg-blue-200'}`}>
              <div style={{ width: '60%' }} className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
            </div>
          </div>
          <p className="text-center">You have saved $600 out of your $1000 goal.</p>
        </section>
        <section className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <h2 className="text-lg font-bold mb-4">Detailed Breakdown</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="flex items-center">
                <FaPiggyBank className="w-8 h-8 mr-4 text-gray-800" />
                <p className="text-gray-800">Personal Savings</p>
              </div>
              <p className="text-gray-800">$400</p>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md transition-transform transform hover:scale-105 hover:shadow-lg">
              <div className="flex items-center">
                <FaBriefcase className="w-8 h-8 mr-4 text-gray-800" />
                <p className="text-gray-800">Employer Contributions</p>
              </div>
              <p className="text-gray-800">$200</p>
            </div>
          </div>
        </section>
        <section className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <h2 className="text-lg font-bold mb-4">Savings History</h2>
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md mb-4 transition-transform transform hover:scale-105 hover:shadow-lg">
            <div className="flex items-center">
              <FaHistory className="w-6 h-6 mr-2 text-gray-800" />
              <p className="text-gray-800">January 15, 2023</p>
            </div>
            <p className="text-gray-800">+ $100</p>
          </div>
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md transition-transform transform hover:scale-105 hover:shadow-lg">
            <div className="flex items-center">
              <FaHistory className="w-6 h-6 mr-2 text-gray-800" />
              <p className="text-gray-800">February 10, 2023</p>
            </div>
            <p className="text-gray-800">+ $200</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default SavingsProgress;
