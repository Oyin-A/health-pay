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
  AiOutlineClose,
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

Modal.setAppElement('#root');

function UserProfile() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newPhotoURL, setNewPhotoURL] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newDateOfBirth, setNewDateOfBirth] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newSecurityQuestion, setNewSecurityQuestion] = useState('');
  const [newSecurityAnswer, setNewSecurityAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hovering, setHovering] = useState(false); // Track hover state for image
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

  const storage = getStorage();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const userData = await getUserDetails();
        setUserDetails(userData);
        setNewDisplayName(userData.displayName);
        setNewPhotoURL(userData.photoURL || '');
        setNewPhoneNumber(userData.phoneNumber || '');
        setNewAddress(userData.address || '');
        setNewDateOfBirth(userData.dateOfBirth || '');
        setNewGender(userData.gender || '');
        setNewSecurityQuestion(userData.securityQuestion || '');
        setNewSecurityAnswer(userData.securityAnswer || '');
      } catch (error) {
        console.error('Error fetching user details: ', error);
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
    setMessage("");
    try {
      // Update the user's profile with the new display name and photo URL
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName,
        photoURL: newPhotoURL, // Now using the Firebase Storage URL
      });

      // Update the user's document in Firestore
      const userDoc = doc(firestore, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, {
        displayName: newDisplayName,
        photoURL: newPhotoURL, // Update Firestore with the same URL
        phoneNumber: newPhoneNumber,
        address: newAddress,
        dateOfBirth: newDateOfBirth,
        gender: newGender,
        securityQuestion: newSecurityQuestion,
        securityAnswer: newSecurityAnswer,
      });

      // Update local state to reflect the new data
      setUserDetails({ ...userDetails, displayName: newDisplayName, photoURL: newPhotoURL });

      setMessage("Profile updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating profile: ", error);
      setMessage(`Error updating profile: ${error.message}`);
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

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
      try {
        // Upload file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the user's photo URL
        setNewPhotoURL(downloadURL);

      } catch (error) {
        console.error("Error uploading photo: ", error);
        setMessage("Error uploading photo. Please try again.");
      }
    }
  };

  const handleRemovePhoto = async () => {
    try {
      // Update the user's profile and Firestore document to remove the photo URL
      await updateProfile(auth.currentUser, { photoURL: null });
      const userDoc = doc(firestore, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, { photoURL: null });

      // Remove the photo URL from the local state
      setNewPhotoURL('');
      setUserDetails({ ...userDetails, photoURL: null });
    } catch (error) {
      console.error("Error removing photo: ", error);
      setMessage("Error removing photo. Please try again.");
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
                <div className="relative" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
                  <img src={userDetails.photoURL} alt="User" className="w-24 h-24 rounded-full shadow-lg" />
                  {hovering && (
                    <button
                      onClick={handleRemovePhoto}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      aria-label="Remove Photo"
                    >
                      <AiOutlineClose className="h-4 w-4" />
                    </button>
                  )}
                </div>
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
            <label htmlFor="phone" className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="dob" className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={newDateOfBirth}
              onChange={(e) => setNewDateOfBirth(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-gray-700">Gender</label>
            <select
              id="gender"
              name="gender"
              value={newGender}
              onChange={(e) => setNewGender(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="securityQuestion" className="block text-gray-700">Security Question</label>
            <input
              type="text"
              id="securityQuestion"
              name="securityQuestion"
              value={newSecurityQuestion}
              onChange={(e) => setNewSecurityQuestion(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="securityAnswer" className="block text-gray-700">Security Answer</label>
            <input
              type="text"
              id="securityAnswer"
              name="securityAnswer"
              value={newSecurityAnswer}
              onChange={(e) => setNewSecurityAnswer(e.target.value)}
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
            {newPhotoURL && (
              <div className="relative mt-2 w-24 h-24">
                <img
                  src={newPhotoURL}
                  alt="Profile Preview"
                  className="rounded-full w-full h-full"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  aria-label="Remove Photo"
                >
                  <AiOutlineClose className="h-4 w-4" />
                </button>
              </div>
            )}
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
