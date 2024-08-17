import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { FaCheckCircle, FaStar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';
import Footer from './Footer';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { getUserDetails } from './authService';
import { BiLoaderCircle } from 'react-icons/bi';

Modal.setAppElement('#root');

const providers = [
  { id: 1, name: 'Dr. John Doe', type: 'Doctor', specialties: 'Cardiology, Pediatrics', rating: 4.5, availability: 'Mon-Fri 9am-5pm', description: 'Specialist in Cardiology with over 20 years of experience.' },
  { id: 2, name: 'General Hospital', type: 'Hospital', specialties: 'Emergency, Surgery', rating: 4.2, availability: '24/7', description: 'A full-service hospital offering comprehensive care.' },
  { id: 3, name: 'City Pharmacy', type: 'Pharmacy', specialties: 'Prescriptions, Health Supplies', rating: 3.8, availability: 'Mon-Sat 8am-8pm', description: 'Your go-to pharmacy for prescriptions and health supplies.' },
  { id: 4, name: 'Dr. Jane Smith', type: 'Doctor', specialties: 'Dermatology, Allergies', rating: 4.9, availability: 'Mon-Thu 10am-6pm', description: 'Dermatologist with a focus on skin allergies and treatments.' },
  { id: 5, name: 'Sunrise Clinic', type: 'Clinic', specialties: 'Family Medicine, General Practice', rating: 4.7, availability: 'Mon-Fri 8am-6pm', description: 'A family clinic providing general health services.' },
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getUserDetails();
        setUserDetails(user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleProviderChange = (e) => {
    setSelectedProvider(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const openConfirmationModal = () => {
    if (selectedProvider && selectedDate && selectedTime) {
      setModalIsOpen(true);
    } else {
      alert("Please select a provider, date, and time to book an appointment.");
    }
  };

  const confirmAppointment = () => {
    const appointment = {
      provider: providers.find(p => p.id === parseInt(selectedProvider)),
      date: selectedDate,
      time: selectedTime,
    };
    setAppointments([...appointments, appointment]);
    setModalIsOpen(false);
    alert('Appointment confirmed! A confirmation notification has been sent.');
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 bg-gray-100 text-gray-900">
      <header className="sticky top-0 z-50 py-4 px-6 shadow-md flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <button onClick={() => navigate(-1)} className="text-white hover:text-gray-400 transition-all duration-300">
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Book an Appointment</h1>
        <div className="flex items-center space-x-4">
          {!isLoading && userDetails && (
            <Tippy content="User Profile">
              <div className="cursor-pointer" onClick={() => navigate('/user-profile')}>
                {userDetails.photoURL ? (
                  <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                    {userDetails.displayName ? getInitials(userDetails.displayName) : 'U'}
                  </div>
                )}
              </div>
            </Tippy>
          )}
        </div>
      </header>

      <main className="flex-grow px-6 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4">Select Provider</h2>
          <select
            value={selectedProvider}
            onChange={handleProviderChange}
            className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-md shadow-md mb-4"
          >
            <option value="" disabled>Select a Provider</option>
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name} - {provider.type}
              </option>
            ))}
          </select>
          {selectedProvider && (
            <div className="bg-blue-100 text-blue-900 p-4 rounded-md shadow-md mb-4">
              <h3 className="text-xl font-semibold">{providers.find(p => p.id === parseInt(selectedProvider))?.name}</h3>
              <p>{providers.find(p => p.id === parseInt(selectedProvider))?.description}</p>
              <p><strong>Specialties:</strong> {providers.find(p => p.id === parseInt(selectedProvider))?.specialties}</p>
              <div className="flex items-center">
                <span className="text-yellow-500 flex">
                  {[...Array(5)].map((_, i) => (
                    i < providers.find(p => p.id === parseInt(selectedProvider))?.rating ? <FaStar key={i} /> : <FaStar key={i} className="text-gray-300" />
                  ))}
                </span>
                <span className="ml-2 text-gray-500">({providers.find(p => p.id === parseInt(selectedProvider))?.rating} stars)</span>
              </div>
              <p><strong>Availability:</strong> {providers.find(p => p.id === parseInt(selectedProvider))?.availability}</p>
            </div>
          )}

          <h2 className="text-lg font-bold mb-4">Choose Date</h2>
          <div className="mb-4">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="MMMM d, yyyy"
              className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-md shadow-md"
              placeholderText="Select a date"
            />
          </div>

          <h2 className="text-lg font-bold mb-4">Choose Time</h2>
          <select
            value={selectedTime}
            onChange={handleTimeChange}
            className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-md shadow-md"
          >
            <option value="" disabled>Select a Time</option>
            {timeSlots.map((time, index) => (
              <option key={index} value={time}>
                {time}
              </option>
            ))}
          </select>

          <button
            onClick={openConfirmationModal}
            className="w-full bg-blue-500 text-white py-2 px-4 mt-6 rounded-md shadow-md transform transition-transform hover:scale-105"
          >
            Confirm Appointment
          </button>
        </div>
      </main>

      <Footer />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Appointment Confirmation"
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-24"
      >
        <h2 className="text-2xl font-bold mb-4">Appointment Confirmation</h2>
        <p className="text-gray-700 mb-4">
          You have selected an appointment with <strong>{providers.find(p => p.id === parseInt(selectedProvider))?.name}</strong> on <strong>{selectedDate?.toLocaleDateString()}</strong> at <strong>{selectedTime}</strong>.
        </p>
        <div className="flex items-center mb-4">
          <FaCheckCircle className="text-green-500 mr-2" />
          <p className="text-gray-700">Your appointment is confirmed.</p>
        </div>
        <button onClick={confirmAppointment} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          Close
        </button>
      </Modal>
    </div>
  );
}

export default BookAppointment;
