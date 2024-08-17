import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineArrowLeft, AiOutlineStar, AiFillStar, AiOutlineSearch, AiOutlineLoading3Quarters, AiOutlineClose, AiOutlineFilter, AiOutlineSortAscending, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { FaPhoneAlt, FaGlobe, FaCalendarAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import Footer from './Footer';
import Tippy from '@tippyjs/react';
import { FiBell, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserDetails } from './authService';

Modal.setAppElement('#root');

const Search = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Rating');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
  const [userDetails, setUserDetails] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Example search results
  const searchResults = [
    { id: 1, name: 'Dr. John Doe', type: 'Doctor', location: '123 Main St', rating: 4.5, reviews: 12, specialties: ['Cardiology', 'Pediatrics'], availability: 'Mon-Fri 9am-5pm', phone: '+1 (234) 567-890', website: 'https://example.com' },
    { id: 2, name: 'General Hospital', type: 'Hospital', location: '456 Health Ave', rating: 4.2, reviews: 20, specialties: ['Emergency', 'Surgery'], availability: '24/7', phone: '+1 (234) 123-456', website: 'https://example.com' },
    { id: 3, name: 'City Pharmacy', type: 'Pharmacy', location: '789 Medicine Rd', rating: 3.8, reviews: 8, specialties: ['Prescriptions', 'Health Supplies'], availability: 'Mon-Sat 8am-8pm', phone: '+1 (234) 567-891', website: 'https://example.com' },
    { id: 4, name: 'Dr. Jane Smith', type: 'Doctor', location: '321 Health Blvd', rating: 4.9, reviews: 18, specialties: ['Dermatology', 'Allergies'], availability: 'Mon-Thu 10am-6pm', phone: '+1 (234) 678-123', website: 'https://example.com' },
    { id: 5, name: 'Sunrise Clinic', type: 'Clinic', location: '654 Wellness Rd', rating: 4.7, reviews: 22, specialties: ['Family Medicine', 'General Practice'], availability: 'Mon-Fri 8am-6pm', phone: '+1 (234) 789-234', website: 'https://example.com' },
    { id: 6, name: 'Health Plus Pharmacy', type: 'Pharmacy', location: '876 Care Ave', rating: 4.0, reviews: 10, specialties: ['Prescriptions', 'Vaccinations'], availability: 'Mon-Sun 7am-10pm', phone: '+1 (234) 890-345', website: 'https://example.com' },
  ];

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Simulate API call and filter results based on the searchTerm
    if (searchTerm) {
      setIsLoading(true);
      setTimeout(() => {
        const filtered = searchResults.filter(result =>
          result.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 1000);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const toggleFavorite = (providerId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (providerId) => favorites.includes(providerId);

  const openModal = (provider) => {
    setSelectedProvider(provider);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProvider(null);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('');
  };

  const handleLogout = () => {
    // Handle user logout
    console.log('User logged out');
  };

  const handleBookAppointment = (id) => {
    navigate(`/book-appointment/${id}`);
    closeModal();
  };

  const filteredResults = results
    .filter(result => filter === 'All' || result.specialties.includes(filter))
    .sort((a, b) => sortOption === 'Rating' ? b.rating - a.rating : a.name.localeCompare(b.name));

  return (
    <div className={`min-h-screen flex flex-col pb-16 bg-gray-100 text-gray-900`}>
      <header className="sticky top-0 z-50 py-4 px-6 shadow-md flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-600">
        <button onClick={() => navigate(-1)} className="text-white hover:text-gray-400 transition-all duration-300">
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <div className="relative w-full max-w-lg mx-auto flex items-center">
          <input
            type="text"
            placeholder="Search for healthcare providers..."
            className="w-full px-4 py-2 rounded-full shadow-md focus:outline-none bg-white text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <AiOutlineSearch className="absolute right-3 text-gray-400" />
          {searchTerm && <AiOutlineClose className="absolute right-10 text-gray-400 cursor-pointer" onClick={() => setSearchTerm('')} />}
        </div>
        <div className="relative" ref={userMenuRef}>
          <Tippy content="User Profile">
            <div className="cursor-pointer" onClick={handleUserMenuToggle}>
              {userDetails?.photoURL ? (
                <img src={userDetails.photoURL} alt="User" className="w-10 h-10 rounded-full border-2 border-white" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                  {userDetails?.displayName ? getInitials(userDetails.displayName) : 'U'}
                </div>
              )}
            </div>
          </Tippy>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-md shadow-lg z-50">
              <ul>
                <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => navigate('/user-profile')}>
                  <FiUser className="mr-2" /> Profile
                </li>
                <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={() => navigate('/settings')}>
                  <FiSettings className="mr-2" /> Settings
                </li>
                <li className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
                  <FiLogOut className="mr-2" /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <AiOutlineFilter className="text-gray-600" />
            <select
              className="border rounded-md p-2 bg-white text-gray-900"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Emergency">Emergency</option>
              <option value="Surgery">Surgery</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Allergies">Allergies</option>
              <option value="Prescriptions">Prescriptions</option>
              <option value="Vaccinations">Vaccinations</option>
              <option value="Family Medicine">Family Medicine</option>
              <option value="General Practice">General Practice</option>
              <option value="Health Supplies">Health Supplies</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <AiOutlineSortAscending className="text-gray-600" />
            <select
              className="border rounded-md p-2 bg-white text-gray-900"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="Rating">Sort by Rating</option>
              <option value="Name">Sort by Name</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center mt-6">
            <AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : (
          <AnimatePresence>
            {filteredResults.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 bg-white rounded-lg shadow-lg p-4"
              >
                <h2 className="text-lg font-semibold mb-2">Search Results</h2>
                {filteredResults.map(result => (
                  <motion.div
                    key={result.id}
                    className="cursor-pointer py-2 px-4 rounded-md transition duration-150 flex justify-between items-center"
                    onClick={() => openModal(result)}
                  >
                    <div>
                      <h3 className="text-blue-500 font-semibold">{result.name}</h3>
                      <p className="text-gray-500">{result.type} - {result.location}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 flex">
                        {[...Array(5)].map((_, i) => (
                          i < result.rating ? <AiFillStar key={i} /> : <AiOutlineStar key={i} />
                        ))}
                      </span>
                      <span className="ml-2 text-gray-500">({result.reviews} reviews)</span>
                      <button
                        className="ml-4 text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(result.id);
                        }}
                      >
                        {isFavorite(result.id) ? <AiFillHeart className="h-6 w-6" /> : <AiOutlineHeart className="h-6 w-6" />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center text-gray-500">No results found</div>
            )}
          </AnimatePresence>
        )}
      </main>

      <Footer />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Provider Details"
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-24"
      >
        {selectedProvider && (
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedProvider.name}</h2>
            <p className="text-gray-600 mb-4">{selectedProvider.location}</p>
            <p className="text-gray-700 mb-4">Type: {selectedProvider.type}</p>
            <p className="text-gray-700 mb-4">Specialties: {selectedProvider.specialties.join(', ')}</p>
            <p className="text-gray-700 mb-4">Availability: {selectedProvider.availability}</p>
            <div className="flex items-center mb-4">
              <FaPhoneAlt className="mr-2 text-gray-700" /> 
              <a href={`tel:${selectedProvider.phone}`} className="text-blue-500">{selectedProvider.phone}</a>
            </div>
            <div className="flex items-center mb-4">
              <FaGlobe className="mr-2 text-gray-700" /> 
              <a href={selectedProvider.website} target="_blank" rel="noopener noreferrer" className="text-blue-500">Visit Website</a>
            </div>
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="mr-2 text-gray-700" /> 
              <button className="text-blue-500" onClick={() => handleBookAppointment(selectedProvider.id)}>Book Appointment</button>
            </div>
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Search;
