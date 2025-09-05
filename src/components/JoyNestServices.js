import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight, Star, Calendar, Users, Music,
  Camera, Flower, Sparkles, Heart,
  Utensils, Car
} from 'lucide-react';

const icons = {
  'wedding-planning': <Heart className="w-6 h-6" />,
  'event-planning': <Calendar className="w-6 h-6" />,
  'catering': <Utensils className="w-6 h-6" />,
  'photography': <Camera className="w-6 h-6" />,
  'entertainment': <Music className="w-6 h-6" />,
  'floral-decor': <Flower className="w-6 h-6" />,
  'venue-decor': <Sparkles className="w-6 h-6" />,
  'transportation': <Car className="w-6 h-6" />
};

const JoyNestServices = () => {
  const [services, setServices] = useState([]);
  const [decorations, setDecorations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('wedding-planning');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [frequentCombinations, setFrequentCombinations] = useState([]);

  const navigate = useNavigate();

  const isService = (item) => item && typeof item === 'object' && item.hasOwnProperty('providers');

  // Fetch services
  useEffect(() => {
    fetch('http://localhost:8081/api/services')
      .then(res => res.json())
      .then(data => setServices(data.filter(item => item.isActive)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Fetch decorations
  useEffect(() => {
    fetch('http://localhost:8081/api/decors')
      .then(res => res.json())
      .then(data => setDecorations(data.filter(item => item.isActive)))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Fetch Apriori combinations
  useEffect(() => {
    const fetchApriori = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/apriori/run?minSupport=0.5");
        let data = await res.json();

        // Sort by support DESC, then by item count DESC
        data = data.sort((a, b) => {
          if (b.support !== a.support) return b.support - a.support;
          return b.items.length - a.items.length;
        });

        setFrequentCombinations(data);
      } catch (err) {
        console.error("Failed to fetch Apriori results:", err);
      }
    };
    fetchApriori();
  }, []);

  const serviceCategories = [...new Set(services.map(item => item.type))].map(type => ({
    id: type,
    label: type.replace(/-/g,' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const decorationCategories = [...new Set(decorations.map(item => item.type))].map(type => ({
    id: type,
    label: type.replace(/-/g,' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const filteredItems = [
    ...services.filter(item => item.type === activeCategory),
    ...decorations.filter(item => item.type === activeCategory)
  ];

  const ServiceCard = ({ item, isDecoration }) => {
    const [hovered, setHovered] = useState(false);

    const handleViewDetails = () => {
      navigate(isDecoration ? `/decor-details/${item.id}` : `/service-details/${item.id}`);
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative overflow-hidden">
          <img src={item.images?.[0] || ''} alt={item.name}
               className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"/>
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current"/>
          </div>
          {hovered && (
            <button onClick={handleViewDetails}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white rounded-md px-4 py-2">
              {isDecoration ? 'View Decoration Details' : 'View Service Details'}
            </button>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-pink-600">${item.price || 0}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const getItemImage = (name) => {
    const allItems = [...services, ...decorations];
    const found = allItems.find(item => item.name.toLowerCase() === name.toLowerCase());
    return found?.images?.[0] || '';
  };

  // Pick the top 1 and next 2
  const mostWanted = frequentCombinations.slice(0, 1);
  const otherPopular = frequentCombinations.slice(1, 3);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <div className="p-4 flex justify-between">
        <button onClick={() => navigate('/')} className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-full shadow transition">⬅ Back to Home</button>
        <button onClick={() => navigate('/find-my-booking')} className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-full shadow transition">Go to Checkout</button>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            JoyNest <span className="text-pink-200">Services</span>
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Creating unforgettable moments with our comprehensive event planning and decoration services
          </p>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="container mx-auto px-6 py-8 flex gap-8">
        {/* Left Column */}
        <div className="w-3/5 flex flex-col gap-6">
          {/* Categories Sidebar */}
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Categories</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Users className="w-5 h-5 mr-2 text-pink-500" /> Services
              </h3>
              <div className="space-y-2">
                {serviceCategories.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center group ${
                            activeCategory === cat.id
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}>
                    <span>{cat.label}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-purple-500" /> Decorations
              </h3>
              <div className="space-y-2">
                {decorationCategories.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                          className={`w-full text-left px-4 py-3 rounded-lg flex justify-between items-center group ${
                            activeCategory === cat.id
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}>
                    <span>{cat.label}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeCategory === cat.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filtered Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredItems.map(item => (
              <ServiceCard key={item.id} item={item} isDecoration={!isService(item)} />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-2/5 flex flex-col gap-6 overflow-y-auto max-h-[75vh] pr-2">
          {mostWanted.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-pink-100 via-purple-100 to-indigo-100 p-6 rounded-xl shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">Most Wanted</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {mostWanted[0].items.map((name, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className="border rounded-lg p-2 flex flex-col items-center w-28 bg-white shadow-lg cursor-pointer"
                  >
                    <img src={getItemImage(name)} alt={name} className="w-20 h-20 object-cover rounded-md mb-1"/>
                    <span className="text-sm font-medium text-gray-800">{name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {otherPopular.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4 justify-center"
            >
              <h2 className="text-lg font-bold w-full text-gray-800 mb-3">Other Popular</h2>
              {otherPopular.map((combo, idx) => (
                <div key={idx} className="flex flex-wrap gap-2 justify-center w-full">
                  {combo.items.map((name, i) => (
                    <motion.div
                      key={`${idx}-${i}`}
                      whileHover={{ scale: 1.1 }}
                      className="border rounded-lg p-2 flex flex-col items-center w-24 bg-gray-50 shadow-sm cursor-pointer"
                    >
                      <img src={getItemImage(name)} alt={name} className="w-16 h-16 object-cover rounded-md mb-1"/>
                      <span className="text-xs font-medium text-gray-700">{name}</span>
                    </motion.div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoyNestServices;
