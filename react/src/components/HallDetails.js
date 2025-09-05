import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const HallDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);

  useEffect(() => {
    const fetchHall = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/hall/${id}`);
        if (!response.ok) {
          throw new Error('Hall not found');
        }
        const data = await response.json();
        setHall(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHall();
  }, [id]);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(leafletCSS);
      }

      if (!window.L) {
        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';

        return new Promise((resolve) => {
          leafletJS.onload = resolve;
          document.head.appendChild(leafletJS);
        });
      }
    };

    const initMap = async () => {
      try {
        await loadLeaflet();
        if (mapRef.current && window.L && hall && !leafletMapRef.current) {
          const map = window.L.map(mapRef.current, {
            center: [hall.latitude, hall.longitude],
            zoom: 15
          });

          window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          const hallIcon = window.L.divIcon({
            html: '<div style="background: #e74c3c; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">💒</div>',
            iconSize: [30, 30],
            className: 'custom-div-icon'
          });

          const marker = window.L.marker([hall.latitude, hall.longitude], { icon: hallIcon }).addTo(map);

          marker.bindPopup(`
            <div style="min-width: 200px;">
              <strong>💒 ${hall.name}</strong><br/>
              📍 ${hall.location}<br/>
              📞 ${hall.phone}<br/>
              👥 Capacity: ${hall.capacity}<br/>
            </div>
          `);

          marker.openPopup();
          leafletMapRef.current = map;
        }
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    if (showMap && hall) {
      initMap();
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [showMap, hall]);

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading hall details...</div>;
  }

  if (error || !hall) {
    return (
      <div className="p-10 text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">Hall not found or there was an error loading the data.</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12 relative">
      <button
        onClick={() => navigate('/WeddingHalls')}
        className="absolute top-6 left-6 bg-cyan-500 text-white px-4 py-2 rounded-full shadow hover:bg-cyan-600 transition"
      >
        ⬅ Back to Wedding Halls
      </button>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        {hall.images?.length > 0 && (
          <div className="flex justify-center overflow-x-auto space-x-5 p-6">
            {hall.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={hall.name}
                className="w-72 h-56 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
        <div className="p-20 flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-6xl font-bold text-cyan-600">{hall.name}</h1>
          {hall.price_per_day && <p className="text-2xl"><strong>💰 Price per day:</strong> ${hall.price_per_day}</p>}
          {hall.price_per_hour && <p className="text-2xl"><strong>⏳ Price per hour:</strong> ${hall.price_per_hour}</p>}
          {hall.location && <p className="text-2xl"><strong>📍 Location:</strong> {hall.location}</p>}
          {hall.capacity && <p className="text-2xl"><strong>👥 Capacity:</strong> {hall.capacity}</p>}
          {hall.phone && <p className="text-2xl"><strong>📞 Phone:</strong> {hall.phone}</p>}
          <p className="text-2xl"><strong>📝 Description:</strong> {hall.description}</p>

     
          <div className="flex flex-wrap justify-center gap-4 mt-8">
           
            <button
              onClick={() => navigate(`/booking/${id}`)}
              className="bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transform transition"
            >
              Book Now
            </button>

          
            <button
              onClick={() => setShowMap(true)}
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transform transition"
            >
              View on Map
            </button>
          </div>
        </div>
      </div>

     
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl relative">
       
            <button
              onClick={() => setShowMap(false)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center z-50"
            >
              ✕
            </button>
            
            
            <div className="p-4">
              <h2 className="text-2xl font-bold mb-4">📍 {hall.name} Location</h2>
              <div
                ref={mapRef}
                style={{ height: '500px', borderRadius: '10px', border: '2px solid #ccc' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallDetails;