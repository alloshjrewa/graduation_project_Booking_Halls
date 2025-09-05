import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Service not found');
        }
        const data = await response.json();
        console.log("Received data from API:", data); 
        setService(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleAddToCart = () => {
    if (!service) return;

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    const updatedCart = [...currentCart, {
      id: service.id,
      name: service.name, 
      price:  service.price,
       images: service.images,
      description: service.description,
      typeService: service.type ,
      type:'service'
    }];

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    toast.success(`"${service.service_name || service.name}" has been added to your cart successfully!`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading service details...</div>;
  }

  if (error || !service) {
    return (
      <div className="p-10 text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">Service not found or there was an error loading the data.</h2>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-12 relative">
      <ToastContainer />
      
      <button
        onClick={() => navigate('/event-services')}
        className="absolute top-6 left-6 bg-cyan-500 text-white px-4 py-2 rounded-full shadow hover:bg-cyan-600 transition"
      >
        ⬅ Back to Services
      </button>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {service.images?.length > 0 && (
          <div className="flex justify-center overflow-x-auto space-x-5 p-6">
            {service.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={service.service_name || service.name}
                className="w-72 h-56 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
        <div className="p-20 flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-6xl font-bold text-cyan-600">
            {service.service_name || service.name || 'Unnamed Service'}
          </h1>
          
          {(service.service_price || service.price) && (
            <p className="text-2xl"><strong>💰 Price:</strong> ${ service.price}</p>
          )}
          
          {service.type && <p className="text-2xl"><strong>📋 Type:</strong> {service.type}</p>}
          
          <p className="text-2xl">
            <strong>📝 Description:</strong> { service.description || 'No description available'}
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-8 bg-gradient-to-r from-cyan-400 to-pink-500 text-white px-8 py-4 rounded-full font-bold hover:scale-105 transform transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;