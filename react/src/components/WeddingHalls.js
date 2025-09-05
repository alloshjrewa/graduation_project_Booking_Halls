import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const WeddingHalls = () => {
  const [hallsData, setHallsData] = useState([]);
  const [error, setError] = useState(null);
  const [bookedHalls, setBookedHalls] = useState(new Set());
  const [hoveredHall, setHoveredHall] = useState(null); // 🆕 لتتبع الـ hover
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/api/halls')
      .then((response) => {
        setHallsData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching halls:', error);
        setError('Failed to load halls. Please check your connection.');
      });
  }, []);

  const handleBooking = (hallId) => {
    const newBookedHalls = new Set(bookedHalls);
    if (newBookedHalls.has(hallId)) {
      newBookedHalls.delete(hallId);
    } else {
      newBookedHalls.add(hallId);
    }
    setBookedHalls(newBookedHalls);
  };

  const handleViewDetails = (hall) => {
    navigate(`/WeddingHalls/${hall.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      {/* NavBar */}
      <nav className="fixed top-0 w-full bg-white bg-opacity-95 backdrop-blur-md shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            JoyNest
          </div>
          <div className="flex space-x-6 text-gray-600 font-semibold">
            <Link to="/" className="hover:text-pink-500 transition"><b>Home</b></Link>
            <Link to="/event-services" className="hover:text-pink-500 transition"><b>Services & Decors</b></Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg">
            Event Halls
          </h1>
          <p className="text-xl text-gray-600">
            Discover the perfect venue for your special moments
          </p>
        </div>

        {error && (
          <div className="text-center text-red-500 font-semibold my-8">
            {error}
          </div>
        )}

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {hallsData.map((hall) => (
            <div
              key={hall.id}
              className="group bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-500"
            >
              {/* صورة القاعة وزر View Details */}
              <div
                className="relative overflow-hidden h-64 rounded-t-2xl"
                onMouseEnter={() => setHoveredHall(hall.id)}
                onMouseLeave={() => setHoveredHall(null)}
              >
                <img
                  src={hall.images[0]}
                  alt={hall.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {hoveredHall === hall.id && (
                  <button
                    onClick={() => handleViewDetails(hall)}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white rounded-md px-4 py-2 transition duration-300 shadow-md"
                  >
                    View Details
                  </button>
                )}
              </div>

              {/* محتوى البطاقة */}
              <div className="p-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent mb-2">
                  {hall.name}
                </h3>
                <p className="text-gray-600 mb-3">{hall.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-semibold">Hourly:</span>
                    <span className="text-cyan-600">
                      ${hall.price_per_hour?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-800 font-semibold">Daily:</span>
                    <span className="text-cyan-600">
                      ${hall.price_per_day?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                  {hall.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-800 font-semibold">Phone:</span>
                      <span className="text-cyan-600">{hall.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-xl font-bold mb-2 text-white">JoyNest</h4>
            <p className="text-slate-400">Making your dreams come true with unforgettable events.</p>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-2">Company</h5>
            <ul className="space-y-1 text-slate-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-2">Support</h5>
            <ul className="space-y-1 text-slate-400">
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold mb-2">Follow Us</h5>
            <ul className="space-y-1 text-slate-400">
              <li><a href="#" className="hover:text-white">Facebook</a></li>
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-slate-400 text-sm">
          &copy; 2025 JoyNest. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default WeddingHalls;
