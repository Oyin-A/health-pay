import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { BiLoaderCircle, BiSearch, BiMicrophone, BiFilter, BiSort } from 'react-icons/bi';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import Modal from 'react-modal';
import { FaStar, FaRegStar } from 'react-icons/fa';

Modal.setAppElement('#root');

function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filter, setFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Distance');
  const [voiceSearch, setVoiceSearch] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [mapError, setMapError] = useState(false);

  const searchResults = [
    // Example data - replace with actual search results
    { id: 1, name: 'Dr. John Doe', type: 'Doctor', location: '123 Main St', lat: 37.7749, lng: -122.4194, rating: 4.5, reviews: 12 },
    { id: 2, name: 'General Hospital', type: 'Hospital', location: '456 Health Ave', lat: 37.7799, lng: -122.4294, rating: 4.2, reviews: 20 },
    { id: 3, name: 'City Pharmacy', type: 'Pharmacy', location: '789 Medicine Rd', lat: 37.7849, lng: -122.4394, rating: 3.8, reviews: 8 },
  ];

  const filteredResults = searchResults
    .filter(result => filter === 'All' || result.type === filter)
    .filter(result => result.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'Distance') return a.distance - b.distance;
      if (sortOption === 'Rating') return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleVoiceSearch = () => {
    if (!voiceSearch) {
      setVoiceSearch(true);
      const recognition = new window.webkitSpeechRecognition();
      recognition.start();
      recognition.onresult = (event) => {
        setSearchTerm(event.results[0][0].transcript);
        setVoiceSearch(false);
      };
      recognition.onerror = () => {
        setVoiceSearch(false);
      };
    }
  };

  const openModal = (place) => {
    setSelectedPlace(place);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPlace(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-16">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 py-4 px-6 shadow-md flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-white hover:text-gray-400 transition-all duration-300">
          <AiOutlineArrowLeft className="h-6 w-6" />
        </button>
        <div className="relative w-full max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search for healthcare providers, services, insurance plans..."
            className="w-full px-4 py-2 rounded-full shadow-md text-gray-700 focus:outline-none"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <BiSearch className="absolute top-3 right-10 text-gray-400" />
          <BiMicrophone className="absolute top-3 right-3 text-gray-400 cursor-pointer" onClick={handleVoiceSearch} />
        </div>
      </header>
      <main className="flex-grow px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <BiFilter className="text-gray-600" />
            <select
              className="bg-white border rounded-md p-2"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Doctor">Doctors</option>
              <option value="Hospital">Hospitals</option>
              <option value="Pharmacy">Pharmacies</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <BiSort className="text-gray-600" />
            <select
              className="bg-white border rounded-md p-2"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="Distance">Sort by Distance</option>
              <option value="Rating">Sort by Rating</option>
              <option value="Name">Sort by Name</option>
            </select>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center mt-6">
            <BiLoaderCircle className="animate-spin text-3xl text-blue-500" />
          </div>
        )}
        {searchTerm && !isLoading && (
          <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-gray-700 text-lg font-semibold mb-2">Search Results</h2>
            {filteredResults.length > 0 ? (
              filteredResults.map(result => (
                <div
                  key={result.id}
                  onClick={() => openModal(result)}
                  className="cursor-pointer py-2 px-4 rounded-md hover:bg-gray-100 transition duration-150 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-blue-500 font-semibold">{result.name}</h3>
                    <p className="text-gray-500">{result.type} - {result.location}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-500">{Array.from({ length: 5 }, (_, i) => i < result.rating ? <FaStar key={i} /> : <FaRegStar key={i} />)}</span>
                    <span className="ml-2 text-gray-500">({result.reviews})</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No results found</div>
            )}
          </div>
        )}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Nearby Healthcare Providers</h2>
          <LoadScript
            googleMapsApiKey="AIzaSyBurBvVQtMRzrS1CvsoGm0hiGH6Doa28SM"
            onError={() => setMapError(true)}
            onLoad={() => setMapError(false)}
          >
            {!mapError ? (
              <GoogleMap
                mapContainerClassName="w-full h-64 rounded-lg shadow-lg"
                center={{ lat: 37.7749, lng: -122.4194 }}
                zoom={14}
              >
                {searchResults.map(result => (
                  <Marker
                    key={result.id}
                    position={{ lat: result.lat, lng: result.lng }}
                    onClick={() => openModal(result)}
                  />
                ))}
                {selectedPlace && (
                  <InfoWindow
                    position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div>
                      <h4>{selectedPlace.name}</h4>
                      <p>{selectedPlace.location}</p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-200 rounded-lg shadow-lg">
                <p className="text-gray-700">Oops! Something went wrong. This page didn't load Google Maps correctly.</p>
              </div>
            )}
          </LoadScript>
        </div>
      </main>
      <Footer />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Provider Details"
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-24"
      >
        {selectedPlace && (
          <div>
            <h2 className="text-2xl font-bold mb-2">{selectedPlace.name}</h2>
            <p className="text-gray-600 mb-4">{selectedPlace.location}</p>
            <p className="text-gray-700 mb-4">Type: {selectedPlace.type}</p>
            <div className="flex items-center">
              <span className="text-yellow-500">{Array.from({ length: 5 }, (_, i) => i < selectedPlace.rating ? <FaStar key={i} /> : <FaRegStar key={i} />)}</span>
              <span className="ml-2 text-gray-500">({selectedPlace.reviews} reviews)</span>
            </div>
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Search;
