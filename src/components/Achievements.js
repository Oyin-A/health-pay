import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineTrophy } from 'react-icons/ai';
import { FaPiggyBank, FaBriefcase, FaRunning, FaMedal, FaHeart, FaAppleAlt } from 'react-icons/fa';
import Confetti from 'react-confetti';
import Footer from './Footer';
import { getUserDetails } from './authService'; // Assuming you have an authService to get user details
import { FiUser } from 'react-icons/fi';

function Achievements() {
  const navigate = useNavigate();
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getUserDetails();
        setUserDetails(user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

  const achievements = [
    { icon: FaPiggyBank, title: 'Savings Milestone', progress: 100, goal: '$1000', current: '$1000', completed: true },
    { icon: FaBriefcase, title: 'Employer Contribution', progress: 100, goal: '$500', current: '$500', completed: true },
    { icon: FaRunning, title: 'Fitness Goal', progress: 75, goal: '10,000 steps', current: '7,500 steps', completed: false },
    { icon: FaMedal, title: 'Claim Submission', progress: 100, goal: '10 Claims', current: '10 Claims', completed: true },
    { icon: FaHeart, title: 'Healthy Living', progress: 50, goal: '5 Health Check-ups', current: '2 Check-ups', completed: false },
    { icon: FaAppleAlt, title: 'Nutrition Balance', progress: 80, goal: '30 Days of Healthy Eating', current: '24 Days', completed: false }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100 text-gray-900 pb-16">
      <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center">
          <AiOutlineArrowLeft className="h-6 w-6" />
          <span className="ml-2"></span>
        </button>
        <h1 className="text-xl font-bold">Your Achievements</h1>
        <div className="flex items-center space-x-4">
          {userDetails?.photoURL ? (
            <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
              {userDetails?.displayName ? userDetails.displayName[0] : <FiUser className="h-6 w-6" />}
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow p-6 space-y-6">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-lg ${achievement.completed ? 'bg-green-100' : 'bg-white'}`}
          >
            <div className="flex items-center mb-4">
              <achievement.icon className={`w-12 h-12 ${achievement.completed ? 'text-green-500' : 'text-yellow-500'}`} />
              <div className="ml-4">
                <h2 className="text-lg font-bold">{achievement.title}</h2>
                <p className="text-sm text-gray-600">{achievement.current} / {achievement.goal}</p>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {achievement.progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${achievement.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
              </div>
            </div>
            {achievement.completed && <p className="text-center text-green-500 font-bold">Achievement Completed!</p>}
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default Achievements;
