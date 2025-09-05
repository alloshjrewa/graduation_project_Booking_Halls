import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DecorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [decor, setDecor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDecor = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/decors/${id}`);
        if (!response.ok) {
          throw new Error('Decor not found');
        }
        const data = await response.json();
        setDecor(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDecor();
  }, [id]);

  const handleAddToCart = () => {
    if (!decor) return;

    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];

    const updatedCart = [...currentCart, {
      id: decor.id,
      name: decor.name,
      images: decor.images,
      price: decor.price,
      type:'decor',
      decorType:decor.type
    }];

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    toast.success(`"${decor.name}" has been added to your cart successfully!`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      style: {
        fontSize: '16px',
      },
    });
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading decor details...</div>;
  }

  if (error || !decor) {
    return (
      <div className="p-10 text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">Decor not found or there was an error loading the data.</h2>
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
        ⬅ Back to Decorations
      </button>

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {decor.images?.length > 0 && (
          <div className="flex justify-center overflow-x-auto space-x-5 p-6">
            {decor.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={decor.name}
                className="w-72 h-56 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
        <div className="p-20 flex flex-col items-center justify-center space-y-6 text-center">
          <h1 className="text-6xl font-bold text-cyan-600">{decor.name}</h1>
          {decor.price && <p className="text-2xl"><strong>💰 Price:</strong> ${decor.price}</p>}
          {decor.type && <p className="text-2xl"><strong>📋 Type:</strong> {decor.type}</p>}
          <p className="text-2xl"><strong>📝 Description:</strong> {decor.description}</p>

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

export default DecorDetails;