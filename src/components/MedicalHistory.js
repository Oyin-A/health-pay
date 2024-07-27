import React from 'react';
import { useNavigate } from 'react-router-dom';
import HelpChatWrapper from './HelpChatWrapper';
import { AiOutlineArrowLeft, AiOutlineInfoCircle, AiOutlineCalendar } from 'react-icons/ai';
import { MdMedicalServices } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function MedicalHistory() {
  const navigate = useNavigate();

  const medicalRecords = [
    {
      title: 'General Check-Up',
      doctor: 'Dr. Sarah Johnson',
      date: '2023-09-15',
      status: 'Completed',
      description: 'Routine check-up to monitor health status and update medical records.',
    },
    {
      title: 'Dental Cleaning',
      doctor: 'Dr. Michael Brown',
      date: '2023-08-20',
      status: 'Completed',
      description: 'Scheduled dental cleaning and examination, no issues found.',
    },
    {
      title: 'Eye Examination',
      doctor: 'Dr. Emily Clark',
      date: '2023-07-10',
      status: 'Completed',
      description: 'Routine eye examination, prescription updated for glasses.',
    },
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <HelpChatWrapper>
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-white">
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Medical History</h1>
        <div></div>
      </header>
      <main className="flex-grow p-6 space-y-6 bg-gray-100">
        {medicalRecords.map((record, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            <MdMedicalServices className="text-blue-500 h-12 w-12" />
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{record.title}</h2>
                <Tippy content="More info">
                  <AiOutlineInfoCircle className="text-gray-400 h-6 w-6 cursor-pointer" />
                </Tippy>
              </div>
              <p className="text-gray-600">{record.doctor}</p>
              <p className="text-gray-500 flex items-center">
                <AiOutlineCalendar className="mr-1" /> {formatDate(record.date)} - {record.status}
              </p>
              <p className="text-gray-700 mt-2">{record.description}</p>
            </div>
          </div>
        ))}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Summary</h2>
          <p className="text-gray-700 mt-2">
            This section provides a summary of your medical history, including past appointments and treatments.
            Use the information provided to monitor your health status and keep your records up to date.
          </p>
        </div>
      </main>
      <footer className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 px-6 shadow-md text-center">
        <p className="text-sm">Need assistance? Contact our support team.</p>
        <button
          onClick={() => navigate('/contact-support')}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
        >
          Contact Support
        </button>
      </footer>
    </HelpChatWrapper>
  );
}

export default MedicalHistory;
