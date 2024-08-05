import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HelpChatModal from './HelpChatModal';
import {
  AiOutlineArrowLeft,
  AiOutlineInfoCircle,
  AiOutlineCalendar,
  AiOutlineFilePdf,
  AiOutlinePlus,
  AiOutlinePrinter,
  AiOutlineSearch,
} from 'react-icons/ai';
import { MdMedicalServices } from 'react-icons/md';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Footer from './Footer';


Modal.setAppElement('#root');

function MedicalHistory() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecord, setNewRecord] = useState({ title: '', doctor: '', date: '', status: '', description: '' });
  const [detailedRecord, setDetailedRecord] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isHelpChatOpen, setIsHelpChatOpen] = useState(false);

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

  const medications = [
    {
      name: 'Ibuprofen',
      dosage: '200 mg',
      frequency: 'Twice a day',
      startDate: '2023-01-10',
      endDate: '2023-01-20',
    },
    {
      name: 'Amoxicillin',
      dosage: '500 mg',
      frequency: 'Three times a day',
      startDate: '2023-02-05',
      endDate: '2023-02-15',
    },
  ];

  const allergies = [
    {
      allergen: 'Peanuts',
      reaction: 'Hives, swelling, difficulty breathing',
    },
    {
      allergen: 'Penicillin',
      reaction: 'Rash, itching',
    },
  ];

  const immunizations = [
    {
      vaccine: 'COVID-19',
      date: '2022-12-01',
      status: 'Completed',
    },
    {
      vaccine: 'Influenza',
      date: '2022-10-15',
      status: 'Completed',
    },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Title', 'Doctor', 'Date', 'Status', 'Description']],
      body: medicalRecords.map((record) => [record.title, record.doctor, record.date, record.status, record.description]),
    });
    doc.save('MedicalRecords.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  const openAddRecordModal = () => {
    setIsModalOpen(true);
  };

  const closeAddRecordModal = () => {
    setIsModalOpen(false);
  };

  const handleAddRecord = () => {
    medicalRecords.push(newRecord);
    setNewRecord({ title: '', doctor: '', date: '', status: '', description: '' });
    closeAddRecordModal();
  };

  const openDetailedView = (record) => {
    setDetailedRecord(record);
  };

  const closeDetailedView = () => {
    setDetailedRecord(null);
  };

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = startDate ? new Date(record.date) >= startDate : true;
    const matchesEndDate = endDate ? new Date(record.date) <= endDate : true;
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  const openHelpChat = () => {
    setIsHelpChatOpen(true);
  };

  const closeHelpChat = () => {
    setIsHelpChatOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-16">
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-white hover:text-gray-300 transition duration-200">
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-semibold">Medical History</h1>
        <div className="flex space-x-4">
          <button onClick={handlePrint} className="text-white hover:text-gray-300 transition duration-200">
            <AiOutlinePrinter className="h-6 w-6" />
          </button>
          <button onClick={handleDownload} className="text-white hover:text-gray-300 transition duration-200">
            <AiOutlineFilePdf className="h-6 w-6" />
          </button>
          <button onClick={openAddRecordModal} className="text-white hover:text-gray-300 transition duration-200">
            <AiOutlinePlus className="h-6 w-6" />
          </button>
        </div>
      </header>
      <main className="flex-grow p-6 space-y-6 bg-gray-50">
        <div className="flex items-center bg-white p-4 rounded-lg shadow">
          <AiOutlineSearch className="text-gray-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search medical records..."
            value={searchTerm}
            onChange={handleSearch}
            className="ml-2 w-full bg-transparent outline-none"
          />
        </div>
        <div className="flex space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText="Start Date"
            className="bg-white p-2 rounded-md shadow"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText="End Date"
            className="bg-white p-2 rounded-md shadow"
          />
        </div>
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 rounded-md ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} transition`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button
            className={`py-2 px-4 rounded-md ${activeTab === 'medications' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} transition`}
            onClick={() => setActiveTab('medications')}
          >
            Medications
          </button>
          <button
            className={`py-2 px-4 rounded-md ${activeTab === 'allergies' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} transition`}
            onClick={() => setActiveTab('allergies')}
          >
            Allergies
          </button>
          <button
            className={`py-2 px-4 rounded-md ${activeTab === 'immunizations' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'} transition`}
            onClick={() => setActiveTab('immunizations')}
          >
            Immunizations
          </button>
        </div>
        {activeTab === 'history' && (
          filteredRecords.map((record, index) => (
            <div
              key={index}
              onClick={() => openDetailedView(record)}
              className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-xl cursor-pointer"
            >
              <MdMedicalServices className="text-blue-500 h-12 w-12" />
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-medium">{record.title}</h2>
                  <Tippy content="More info">
                    <AiOutlineInfoCircle className="text-gray-400 h-6 w-6 cursor-pointer" />
                  </Tippy>
                </div>
                <p className="text-gray-600">{record.doctor}</p>
                <p className="text-gray-500 flex items-center">
                  <AiOutlineCalendar className="mr-1" /> {record.date} - {record.status}
                </p>
                <p className="text-gray-700 mt-2">{record.description}</p>
              </div>
            </div>
          ))
        )}
        {activeTab === 'medications' && (
          medications.map((medication, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex-grow">
                <h2 className="text-xl font-medium">{medication.name}</h2>
                <p className="text-gray-600">{medication.dosage} - {medication.frequency}</p>
                <p className="text-gray-500">
                  <AiOutlineCalendar className="mr-1" /> {medication.startDate} to {medication.endDate}
                </p>
              </div>
            </div>
          ))
        )}
        {activeTab === 'allergies' && (
          allergies.map((allergy, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex-grow">
                <h2 className="text-xl font-medium">{allergy.allergen}</h2>
                <p className="text-gray-700">{allergy.reaction}</p>
              </div>
            </div>
          ))
        )}
        {activeTab === 'immunizations' && (
          immunizations.map((immunization, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex-grow">
                <h2 className="text-xl font-medium">{immunization.vaccine}</h2>
                <p className="text-gray-500">
                  <AiOutlineCalendar className="mr-1" /> {immunization.date} - {immunization.status}
                </p>
              </div>
            </div>
          ))
        )}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Summary</h2>
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
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
        >
          Contact Support
        </button>
      </footer>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeAddRecordModal}
        contentLabel="Add New Medical Record"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Medical Record</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={newRecord.title}
              onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="doctor" className="block text-gray-700">Doctor</label>
            <input
              type="text"
              id="doctor"
              name="doctor"
              value={newRecord.doctor}
              onChange={(e) => setNewRecord({ ...newRecord, doctor: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={newRecord.date}
              onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-700">Status</label>
            <input
              type="text"
              id="status"
              name="status"
              value={newRecord.status}
              onChange={(e) => setNewRecord({ ...newRecord, status: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={newRecord.description}
              onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={closeAddRecordModal} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition">
              Cancel
            </button>
            <button type="button" onClick={handleAddRecord} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
              Save
            </button>
          </div>
        </form>
      </Modal>
      {detailedRecord && (
        <Modal
          isOpen={!!detailedRecord}
          onRequestClose={closeDetailedView}
          contentLabel="Detailed Medical Record"
          className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">{detailedRecord.title}</h2>
          <p className="text-gray-700"><strong>Doctor:</strong> {detailedRecord.doctor}</p>
          <p className="text-gray-700"><strong>Date:</strong> {detailedRecord.date}</p>
          <p className="text-gray-700"><strong>Status:</strong> {detailedRecord.status}</p>
          <p className="text-gray-700 mt-4">{detailedRecord.description}</p>
          <button onClick={closeDetailedView} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            Close
          </button>
        </Modal>
      )}
      <button
        onClick={openHelpChat}
        className="fixed bottom-16 right-6 bg-red-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-3xl font-bold transform transition-transform hover:scale-110 hover:bg-red-600"
      >
        ?
      </button>
      <Footer />
      <HelpChatModal isOpen={isHelpChatOpen} onClose={closeHelpChat} />
    </div>
  );
}

export default MedicalHistory;
