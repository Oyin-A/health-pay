import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { FiBell } from 'react-icons/fi';
import { BiLoaderCircle } from 'react-icons/bi';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { getUserDetails } from './authService'; // Assuming you have this service

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    advisor: '',
    date: '',
    time: '',
  });
  const [advisors, setAdvisors] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock function to fetch appointments
    const getAppointments = async () => {
      // Simulate fetching data
      return [
        { id: 1, advisor: 'Dr. John Doe', date: '2023-08-12', time: '10:00 AM' },
        { id: 2, advisor: 'Dr. Jane Smith', date: '2023-08-14', time: '02:00 PM' },
      ];
    };

    const fetchAppointments = async () => {
      const data = await getAppointments();
      setAppointments(data);
      setIsLoading(false);
    };

    // Mock function to fetch advisors
    const getAdvisors = async () => {
      // Simulate fetching data
      return [
        { id: 1, name: 'Dr. John Doe' },
        { id: 2, name: 'Dr. Jane Smith' },
        { id: 3, name: 'Dr. Emily Davis' },
      ];
    };

    const fetchAdvisors = async () => {
      const data = await getAdvisors();
      setAdvisors(data);
    };

    const fetchUserDetails = async () => {
      const user = await getUserDetails();
      setUserDetails(user);
    };

    fetchAppointments();
    fetchAdvisors();
    fetchUserDetails();
  }, []);

  const handleBookAppointment = () => {
    setShowModal(true);
  };

  const handleSaveAppointment = () => {
    // Logic to save a new appointment
    setAppointments([...appointments, newAppointment]);
    setShowModal(false);
    setNewAppointment({ advisor: '', date: '', time: '' });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <BiLoaderCircle className="animate-spin text-6xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-500 to-blue-600 text-white pb-12">
      <header className="bg-black py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-white hover:text-gray-400 transition-all duration-300">
          <AiOutlineArrowLeft className="text-2xl" />
        </button>
        <h1 className="text-2xl font-bold">Appointments</h1>
        <div className="flex items-center space-x-4">
          <Tippy content="Notifications">
            <div className="relative cursor-pointer" onClick={() => alert('Show notifications')}>
              <FiBell className="text-2xl" />
            </div>
          </Tippy>
          <Tippy content="User Profile">
            <div className="cursor-pointer" onClick={() => navigate('/user-profile')}>
              {userDetails?.photoURL ? (
                <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                  {userDetails?.displayName ? getInitials(userDetails.displayName) : 'U'}
                </div>
              )}
            </div>
          </Tippy>
        </div>
      </header>
      <main className="flex-grow p-6 space-y-8">
        <section className="bg-white bg-opacity-90 p-6 rounded-lg shadow-2xl text-black">
          <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold">{appointment.advisor}</h3>
                  <p>{appointment.date}</p>
                  <p>{appointment.time}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No upcoming appointments</p>
            )}
          </div>
        </section>
        <button
          onClick={handleBookAppointment}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          Book Appointment
        </button>
      </main>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Book a New Appointment</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Advisor</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={newAppointment.advisor}
                onChange={(e) => setNewAppointment({ ...newAppointment, advisor: e.target.value })}
              >
                <option value="">Select an advisor</option>
                {advisors.map((advisor) => (
                  <option key={advisor.id} value={advisor.name}>
                    {advisor.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Time</label>
              <input
                type="time"
                className="w-full p-2 border border-gray-300 rounded-md text-black"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition duration-150"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150"
                onClick={handleSaveAppointment}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Appointments;
