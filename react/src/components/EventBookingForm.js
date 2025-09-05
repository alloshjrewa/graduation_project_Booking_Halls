import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, Heart, Star, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventBookingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hallId: id,
    bookingDate: new Date().toISOString().split('T')[0],
    eventDate: '',
    startTime: '',
    endTime: '',
    eventType: '',
    clientName: '',
    email: '',
    phone: '',
    status: 'pending'
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showBookingStatus, setShowBookingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState(null);
  const [hallDetails, setHallDetails] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bookingIdParam = params.get('bookingId');
    if (bookingIdParam) {
      fetchBookingDetails(bookingIdParam);
    }
    

    const fetchHallDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/hall/${id}`);
        setHallDetails(response.data);
      } catch (error) {
        console.error('Error fetching hall details:', error);
      }
    };
    fetchHallDetails();
  }, [id]);

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/bookings/${bookingId}`);
      setFormData(response.data);
      setBookingId(bookingId);
    } catch (error) {
      console.error('Error fetching booking:', error);
    }
  };

  const addToCart = (bookingDetails) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.bookingId === bookingDetails.bookingId);
    
    if (existingItemIndex >= 0) {
      cart[existingItemIndex] = bookingDetails;
    } else {
      cart.push(bookingDetails);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    return (
      formData.eventDate &&
      formData.startTime &&
      formData.endTime &&
      formData.eventType &&
      formData.clientName &&
      formData.email &&
      formData.phone
    );
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8081/api/bookings/check-availability`, {
        params: {
          hallId: id,
          startAt: new Date(`${formData.eventDate}T${formData.startTime}`).toISOString(),
          endAt: new Date(`${formData.eventDate}T${formData.endTime}`).toISOString(),
        }
      });

      if (response.data) {
        setShowBookingStatus(response.data.isBooked ? 'available' : 'booked');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Failed to check hall availability. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      alert('Please fill in all required fields!');
      return;
    }

    setIsLoading(true);
    try {
      formData.startTime = new Date(`${formData.eventDate}T${formData.startTime}`).toISOString();
      formData.endTime = new Date(`${formData.eventDate}T${formData.endTime}`).toISOString();
      
      const response = await axios.post('http://localhost:8081/api/bookings', formData);
      const bookingId = response.data.bookingId;
      const finalPrice = response.data.finalPrice;
        setBookingId(bookingId);
        
        localStorage.setItem('bookingId', bookingId);
        localStorage.setItem('finalPrice', finalPrice);
   
      if (hallDetails) {
        addToCart({
          ...hallDetails,
          type : "hall",
          name:hallDetails.name,
          bookingId: response.data.bookingId,
          eventDate: formData.eventDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          eventType: formData.eventType,
          status: 'pending',
          finalPrice: finalPrice
        });
        navigate("/event-services");
      }

      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingId) {
      setShowBookingStatus(null);
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setIsLoading(true);
    try {
      await axios.patch(`http://localhost:8081/api/bookings/${bookingId}/cancel`);
      setFormData(prev => ({ ...prev, status: 'cancelled' }));
      
      // Remove from cart
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const updatedCart = cart.filter(item => item.bookingId !== bookingId);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      alert('Booking cancelled successfully!');
      setShowBookingStatus(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowBookingStatus(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 p-4 relative">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce">
          <Heart className="w-6 h-6 text-pink-300 opacity-60" />
        </div>
        <div className="absolute top-40 right-20 animate-pulse">
          <Star className="w-8 h-8 text-purple-300 opacity-40" />
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce delay-300">
          <Sparkles className="w-7 h-7 text-indigo-300 opacity-50" />
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse delay-500">
          <Heart className="w-5 h-5 text-pink-400 opacity-70" />
        </div>
      </div>
      {bookingId && formData.status === 'confirmed' && (
        <button
          onClick={handleCancelBooking}
          disabled={isLoading}
          className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition z-50"
          title="Cancel Booking"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 animate-pulse">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {bookingId ? 'Manage Your Booking' : 'Book Your Dream Event'}
          </h1>
          <p className="text-gray-600 text-lg">
            {bookingId ? 'Update or cancel your booking' : 'Let\'s make your special day unforgettable'}
          </p>
        </div>
        <div className=" inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm mb-10 rounded-2xl">
            
              <button
                onClick={() => navigate("/WeddingHalls")}
                className="w-full bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl hover:scale-105 transform transition"
              >
                Back to Wedding Halls
              </button>
          </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300 border border-white/50">
          <div className="space-y-6">
            {/* Event Type Selection */}
            <div className="animate-slide-in-left">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Event Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['Wedding', 'Birthday', 'Anniversary', 'Corporate'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, eventType: type }))}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      formData.eventType === type
                        ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-lg'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    }`}
                  >
                    <div className="font-medium">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Information */}
            <div className="animate-slide-in-right">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 group-hover:border-purple-300"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-in-left">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 group-hover:border-purple-300"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 group-hover:border-purple-300"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 animate-slide-in-right">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Event Date
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 group-hover:border-purple-300"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    Event Start
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 group-hover:border-green-300"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    Event End
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 group-hover:border-red-300"
                    required
                  />
                </div>
              </div>
            </div>

   
            <div className="pt-6 animate-slide-in-up">
              <button
                type="button"
                onClick={bookingId ? handleConfirmBooking : handleCheckout}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-2xl transform hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    {bookingId ? 'Update Booking' : 'Check Availability'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

   
        {showBookingStatus === 'booked' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center animate-bounce">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Hall Already Booked!</h3>
              <p className="text-gray-600 mb-6">This hall is not available on the selected date and time.</p>
              <button
                onClick={() => navigate(0)}
                className="w-full bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl hover:scale-105 transform transition"
              >
                Back to Booking Hall
              </button>
            </div>
          </div>
        )}


        {showBookingStatus === 'available' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center animate-bounce">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Hall Available!</h3>
              <p className="text-gray-600 mb-6">This hall is available for booking. Confirm to proceed.</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-2xl hover:scale-105 transform transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={isLoading}
                  className={`bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-2xl hover:scale-105 transform transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}

     
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center animate-bounce">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {bookingId ? 'Booking Updated!' : 'Booking Confirmed!'}
              </h3>
              <p className="text-gray-600 mb-6">
                {bookingId 
                  ? 'Your booking has been successfully updated.'
                  : 'Your booking has been successfully submitted.'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    navigate('/WeddingHalls');
                  }}
                  className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-2xl hover:scale-105 transform transition"
                >
                  Back to Halls
                </button>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    navigate(`/booking/${bookingId}`);
                  }}
                  className="bg-gradient-to-r from-cyan-400 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl hover:scale-105 transform transition"
                >
                  View Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out 0.2s both;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out 0.4s both;
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out 0.6s both;
        }
      `}</style>
    </div>
  );
}