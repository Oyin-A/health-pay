import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, getUserDetails } from './authService';
import {
  AiOutlineLogout,
  AiOutlineArrowLeft,
  AiOutlineSetting,
  AiOutlineCreditCard,
  AiOutlineLock,
  AiOutlineShareAlt,
  AiOutlineEdit,
  AiOutlineCloudSync,
  AiOutlineUser,
} from 'react-icons/ai';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Modal from 'react-modal';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Loader from './Loader';

Modal.setAppElement('#root');

function UserProfile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [chartData, setChartData] = useState({
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#ef5350'],
      },
    ],
  });

  const auth = getAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userData = await getUserDetails();
        setUserDetails(userData);
        setNewDisplayName(userData.displayName);
        setNewPhotoURL(userData.photoURL || '');
      } catch (error) {
        console.error('Error fetching user details: ', error);
        setUserDetails({
          displayName: 'John Doe',
          email: 'johndoe@example.com',
          photoURL: '',
        });
        setNewDisplayName('John Doe');
        setNewPhotoURL('');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await updateProfile(auth.currentUser, { displayName: newDisplayName, photoURL: newPhotoURL });
      const userDoc = doc(firestore, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, { displayName: newDisplayName, photoURL: newPhotoURL });

      setUserDetails({ ...userDetails, displayName: newDisplayName, photoURL: newPhotoURL });
      setMessage('Profile updated successfully!');
      closeModal();
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayName = userDetails?.displayName || 'User';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100 text-gray-900">
      <header className="py-4 px-6 shadow-md flex justify-between items-center bg-white">
        <button onClick={() => navigate(-1)} className="text-gray-800" aria-label="Go Back">
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Profile</h1>
        <button onClick={handleSignOut} className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition" aria-label="Log Out">
          Log Out
        </button>
      </header>
      <main className="flex-grow p-6 space-y-6">
        {loading ? (
          <Loader />
        ) : userDetails ? (
          <>
            <div className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg relative">
              {userDetails.photoURL ? (
                <img src={userDetails.photoURL} alt="User" className="w-24 h-24 rounded-full shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold text-3xl shadow-lg">
                  {getInitials(displayName)}
                </div>
              )}
              <div className="text-center">
                <h2 className="text-2xl font-bold">{displayName}</h2>
                <p className="text-gray-600">{userDetails.email}</p>
              </div>
              <button
                onClick={handleEditProfile}
                className="absolute top-4 right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-md"
                aria-label="Edit Profile"
              >
                <AiOutlineEdit className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-md text-center shadow-sm">
                  <h3 className="text-lg font-semibold">Total Payments</h3>
                  <p className="text-2xl font-bold">$5000</p>
                  <div className="chart-container mx-auto" style={{ height: '150px', width: '150px' }}>
                    <Doughnut data={chartData} />
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md text-center shadow-sm">
                  <h3 className="text-lg font-semibold">Pending Claims</h3>
                  <p className="text-2xl font-bold">3</p>
                  <div className="chart-container mx-auto" style={{ height: '150px', width: '150px' }}>
                    <Doughnut data={chartData} />
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <ul className="mt-2 space-y-2">
                  <li className="text-gray-700 flex items-center">
                    <AiOutlineCreditCard className="mr-2" /> Paid $200 for Dental Services on 20th July 2023
                  </li>
                  <li className="text-gray-700 flex items-center">
                    <AiOutlineSetting className="mr-2" /> Submitted Claim for Optical Services on 18th July 2023
                  </li>
                  <li className="text-gray-700 flex items-center">
                    <AiOutlineShareAlt className="mr-2" /> Referred John Doe on 15th July 2023
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center bg-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-200 transition">
                  <AiOutlineCloudSync className="h-8 w-8 mb-2 text-blue-600" />
                  <span className="text-lg font-semibold">Insurance Provider</span>
                </button>
                <button className="flex flex-col items-center bg-gray-100 p-4 rounded-md shadow-sm hover:bg-gray-200 transition">
                  <AiOutlineCloudSync className="h-8 w-8 mb-2 text-blue-600" />
                  <span className="text-lg font-semibold">Healthcare Portal</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <Tippy content="Manage your account settings">
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-2 px-4 rounded-md hover:from-teal-600 hover:to-green-600 transition flex items-center justify-center shadow"
                >
                  <AiOutlineSetting className="mr-2" /> Manage Account Settings
                </button>
              </Tippy>
              <Tippy content="View and manage your payment methods">
                <button
                  onClick={() => navigate('/make-payments')}
                  className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-2 px-4 rounded-md hover:from-teal-600 hover:to-green-600 transition flex items-center justify-center shadow"
                >
                  <AiOutlineCreditCard className="mr-2" /> View Payment Methods
                </button>
              </Tippy>
              <Tippy content="Enhance your account security">
                <button
                  onClick={() => navigate('/security')}
                  className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-2 px-4 rounded-md hover:from-teal-600 hover:to-green-600 transition flex items-center justify-center shadow"
                >
                  <AiOutlineLock className="mr-2" /> Enhance Security
                </button>
              </Tippy>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="text-gray-700 text-lg">Loading user details...</div>
          </div>
        )}
        <div className="bg-white p-4 rounded-lg shadow-lg text-center mt-8">
          <h3 className="text-lg font-semibold">Claim your healthcare</h3>
          <p className="text-gray-700">Refer a friend for healthcare benefits!</p>
          <button className="bg-red-500 text-white py-2 px-4 mt-4 rounded-md hover:bg-red-600 transition flex items-center justify-center shadow">
            <AiOutlineShareAlt className="mr-2" /> Share Code
          </button>
        </div>
      </main>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Profile"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="photo" className="block text-gray-700">Profile Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full p-2 border rounded-md"
            />
            {newPhotoURL && <img src={newPhotoURL} alt="Profile Preview" className="w-24 h-24 rounded-full mt-2" />}
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Save
            </button>
          </div>
        </form>
        {message && <p className="text-center mt-4 text-green-500">{message}</p>}
      </Modal>
    </div>
  );
}

export default UserProfile;
