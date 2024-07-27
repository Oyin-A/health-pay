import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HelpChatWrapper from './HelpChatWrapper';
import { getAccountBalance, getHSA } from './financialService';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import {
  AiOutlineDollarCircle,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineBell,
  AiOutlineArrowLeft,
  AiOutlineInfoCircle,
  AiOutlineStar
} from 'react-icons/ai';
import { FaHandsHelping, FaRegLightbulb, FaPodcast, FaCheckCircle } from 'react-icons/fa';
import { FiBarChart2 } from 'react-icons/fi';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function Financial() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [hsa, setHSA] = useState({ balance: 0, contributions: [], withdrawals: [] });
  const [advice, setAdvice] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [expenseTrendsData, setExpenseTrendsData] = useState({ labels: [], datasets: [] });
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const accountBalance = await getAccountBalance();
      setBalance(accountBalance);

      const hsaDetails = await getHSA();
      setHSA(hsaDetails);

      // Example advice data
      setAdvice([
        { title: 'Save on Prescription Drugs', content: 'Consider generic brands or using a discount card.' },
        { title: 'Health Insurance Tips', content: 'Check if your insurance covers annual checkups.' },
        { title: 'Regular Check-ups', content: 'Schedule regular check-ups to catch health issues early.' },
        { title: 'Healthy Lifestyle', content: 'Maintain a balanced diet and exercise regularly to prevent diseases.' },
      ]);

      // Example podcasts data
      setPodcasts([
        { title: 'Managing Healthcare Costs', link: '#' },
        { title: 'Understanding Health Insurance', link: '#' },
      ]);

      // Example notifications data
      setNotifications([
        { message: 'New financial advice available!', link: '#', icon: <AiOutlineInfoCircle className="text-xl text-purple-600" /> },
        { message: 'Your HSA balance has been updated.', link: '#', icon: <AiOutlineDollarCircle className="text-xl text-purple-600" /> },
        { message: 'Check out new partners with discounts.', link: '#', icon: <FaRegLightbulb className="text-xl text-purple-600" /> },
      ]);

      // Example goals data
      setGoals([
        { title: 'Save $500 for Emergency Fund', progress: 80 },
        { title: 'Reduce Monthly Medical Expenses', progress: 60 },
      ]);

      // Example expense trends data
      const data = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
          {
            label: 'Monthly Expenses',
            data: [65, 59, 80, 81, 56],
            fill: false,
            backgroundColor: '#FF6384',
            borderColor: '#FF6384',
          },
        ],
      };

      setExpenseTrendsData(data);
    };

    fetchData();
  }, []);

  return (
    <HelpChatWrapper>
      <header className="bg-black py-4 px-6 shadow-md flex justify-between items-center text-white">
        <button onClick={() => navigate(-1)} className="text-white hover:text-gray-400 transition-all duration-300">
          <AiOutlineArrowLeft className="text-2xl" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Financial Insights</h1>
          <p className="text-sm">Get personalized tips, connect with advisors, and discover cheaper partners to optimize your healthcare finances.</p>
        </div>
        <AiOutlineBell className="text-2xl cursor-pointer" />
      </header>
      <main className="flex-grow p-6 space-y-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <section className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg flex justify-between items-center transition-transform hover:scale-102">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Account Balance</h2>
            <p className="text-2xl text-purple-600">${balance.toFixed(2)}</p>
          </div>
          <AiOutlineDollarCircle className="text-4xl text-purple-600" />
        </section>

        <section className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg transition-transform hover:scale-102">
          <h2 className="text-lg font-semibold text-gray-800">Top Saving Strategies</h2>
          <div className="space-y-4">
            {advice.map((tip, index) => (
              <Tippy content={tip.content} key={index}>
                <div className="bg-gray-100 p-4 rounded-lg cursor-pointer flex items-center space-x-4 transition-transform hover:scale-102">
                  <AiOutlineInfoCircle className="text-3xl text-purple-600" />
                  <h3 className="text-md font-semibold text-gray-800">{tip.title}</h3>
                </div>
              </Tippy>
            ))}
          </div>
        </section>

        <section className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg transition-transform hover:scale-102">
          <h2 className="text-lg font-semibold text-gray-800">Connect with Advisors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer transition-transform hover:scale-102">
              <AiOutlineUser className="text-4xl text-purple-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800 mt-2">Virtual Advisors</h3>
              <p className="text-sm text-gray-600 mt-1">Access professional financial advisors for personalized advice.</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <AiOutlineStar className="text-yellow-500" />
                <p className="text-gray-600">4.8/5</p>
              </div>
              <button className="mt-2 text-purple-600">Leave Feedback</button>
            </div>
            <div
              className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer transition-transform hover:scale-102"
              onClick={() => navigate('/appointments')}
            >
              <AiOutlineCalendar className="text-4xl text-purple-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800 mt-2">Schedule Appointment</h3>
              <p className="text-sm text-gray-600 mt-1">Book virtual or in-person meetings with financial advisors.</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer transition-transform hover:scale-102">
              <FaHandsHelping className="text-4xl text-purple-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800 mt-2">Chat Support</h3>
              <p className="text-sm text-gray-600 mt-1">Real-time chat with financial advisors for quick questions and guidance.</p>
            </div>
          </div>
        </section>

        <section className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg transition-transform hover:scale-102">
          <h2 className="text-lg font-semibold text-gray-800">Cheaper Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer transition-transform hover:scale-102">
              <FiBarChart2 className="text-4xl text-purple-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800 mt-2">Preferred Providers</h3>
              <p className="text-sm text-gray-600 mt-1">List of healthcare providers, pharmacies, and services offering discounts or partnerships.</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer transition-transform hover:scale-102">
              <FaRegLightbulb className="text-4xl text-purple-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800 mt-2">Cheaper Partners</h3>
              <p className="text-sm text-gray-600 mt-1">Highlight partners providing quality care at lower costs, with user reviews and ratings.</p>
            </div>
          </div>
        </section>

        <section className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg transition-transform hover:scale-102">
          <h2 className="text-lg font-semibold text-gray-800">Your Spending Trends</h2>
          <div className="h-64">
            <Line data={expenseTrendsData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-800">Category Breakdown</h3>
            <ul className="space-y-2">
              <li className="flex justify-between text-gray-600">
                <span>Medical Bills:</span>
                <span>$200</span>
              </li>
              <li className="flex justify-between text-gray-600">
                <span>Prescriptions:</span>
                <span>$150</span>
              </li>
              <li className="flex justify-between text-gray-600">
                <span>Insurance:</span>
                <span>$300</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg transition-transform hover:scale-102">
          <h2 className="text-lg font-semibold text-gray-800">Financial Goals</h2>
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg transition-transform hover:scale-102">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold text-gray-800">{goal.title}</h3>
                  <FaCheckCircle className={`text-2xl ${goal.progress === 100 ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-gray-500">{goal.progress}%</span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div style={{ width: `${goal.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-600"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg transition-transform hover:scale-102">
          <h2 className="text-lg font-semibold text-gray-800">Learn More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer transition-transform hover:scale-102">
              <FaPodcast className="text-4xl text-purple-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800 mt-2">Podcasts</h3>
              <ul>
                {podcasts.map((podcast, index) => (
                  <li key={index} className="py-2">
                    <a href={podcast.link} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600">{podcast.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center cursor-pointer transition-transform hover:scale-102">
              <AiOutlineUser className="text-4xl text-purple-600 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800 mt-2">Articles & Guides</h3>
              <p className="text-sm text-gray-600 mt-1">Access a library of articles and guides on managing healthcare finances.</p>
              <ul>
                {podcasts.map((podcast, index) => (
                  <li key={index} className="py-2">
                    <a href={podcast.link} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600">{podcast.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg transition-transform hover:scale-102">
          <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} className="py-2 border-b flex items-center space-x-2">
                {notification.icon}
                <a href={notification.link} className="text-sm text-purple-600">{notification.message}</a>
              </li>
            ))}
          </ul>
        </section>

        <button
          onClick={() => alert('Advisor Chat Coming Soon!')}
          className="fixed bottom-16 right-6 bg-red-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold transition-transform hover:scale-105 hover:bg-red-600"
        >
          ?
        </button>
      </main>
    </HelpChatWrapper>
  );
}

export default Financial;
