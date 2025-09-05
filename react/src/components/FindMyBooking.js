import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function FindMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [hallNames, setHallNames] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  }, [showModal]);

  const fetchHallName = async (hallId) => {
    if (!hallId || hallNames[hallId]) return;
    try {
      const response = await axios.get(`http://localhost:8081/api/hall/${hallId}`);
      setHallNames(prev => ({ ...prev, [hallId]: response.data.name }));
    } catch (err) {
      console.error('Error fetching hall name:', err);
      setHallNames(prev => ({ ...prev, [hallId]: 'Unknown Hall' }));
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/bookings/${bookingId}`);
      localStorage.setItem('bookingId', bookingId);
      console.log(bookingId);
      alert(`Booking details fetched successfully for ID: ${bookingId}`);
    } catch (error) {
      console.error('Error fetching booking:', error);
      alert('Failed to fetch booking details. Please try again. ');
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser(storedUser);
      fetchUserBookings(storedUser.username);
    } else {
      setLoading(false);
      setError('Please login to view your bookings');
    }
  }, []);

  const fetchUserBookings = async (username) => {
    if (!username) return;
    try {
      const response = await axios.get(`http://localhost:8081/api/bookings/search?username=${encodeURIComponent(username)}`);
      setBookings(response.data);
      response.data.forEach(booking => {
        if (booking.hallId) {
          fetchHallName(booking.hallId);
        }
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
        // Make the API call to initiate the refund
        const refundResponse = await axios.patch(
            `http://localhost:8081/api/bookings/${bookingId}/refund`
        );

        if (refundResponse.status === 200) {
            // Update booking status locally
            setBookings(bookings.map(booking =>
                booking.id === bookingId ? { ...booking, status: 'Cancelled' } : booking
            ));

            // Update cart
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const updatedCart = cart.filter(item => item.bookingId !== bookingId);
            localStorage.setItem('cart', JSON.stringify(updatedCart));

            alert('Booking cancelled and refund initiated successfully!');
        } else {
            alert('Booking cancelled, but refund initiation failed. Please contact support.');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking and initiate refund. Please try again.');
    }
};

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const calculateTotalPrice = (booking) => {
    const hallPrice = booking.hallBookingPrice || 0;
     const cartItemsForBooking = cartItems;

    if(booking.status == "Pending"){
    const servicePrice = cartItemsForBooking.reduce((total, item) => {
        if (item.type === 'service') {
            return total + (item.price || 0); // Sum service prices
        }
        return total;
    }, 0);
    const decorPrice = cartItemsForBooking.reduce((total, item) => {
        if (item.type === 'decor') {
            return total + (item.price || 0); // Sum service prices
        }
        return total;
    }, 0);

    // Total price calculation
    const totalPrice = hallPrice + servicePrice + decorPrice;

    console.log('Total Price Calculation:', totalPrice); // Log total for debugging

    return totalPrice.toFixed(2);
  }else {
    return booking.totalPrice.toFixed(2);
  }
};

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px' }}>Loading your bookings...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#dc3545' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: "'Roboto', sans-serif" }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(to right, #66cef6, #f666b1)',
            border: 'none',
            color: 'white',
            fontSize: '14px',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Home
        </button>
      </div>

      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        {currentUser ? `${currentUser.name}'s Bookings` : 'My Bookings'}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {bookings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            width: '100%',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '18px', color: '#6c757d' }}>No bookings found</p>
            <p style={{ color: '#6c757d' }}>You don't have any bookings yet.</p>
          </div>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} style={{
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              padding: '20px',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '10px',
                borderBottom: '1px solid #eee'
              }}>
                <h3 style={{ margin: 0, color: '#333' }}>
                  {hallNames[booking.hallId] || booking.serviceName || 'Hall Booking'}
                </h3>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  backgroundColor:
                    booking.status === 'Pending' ? '#fff3cd' :
                      booking.status === 'Completed' ? '#d4edda' :
                        booking.status === 'Cancelled' ? '#f8d7da' : '#e2e3e5',
                  color:
                    booking.status === 'Pending' ? '#856404' :
                      booking.status === 'Completed' ? '#155724' :
                        booking.status === 'Cancelled' ? '#721c24' : '#383d41'
                }}>
                  {booking.status}
                </span>
              </div>

              <div style={{ marginBottom: '15px' }}>
                {booking.startAt && (
                  <p style={{ margin: '5px 0', color: '#555' }}>
                    <strong style={{ color: '#333' }}>Date:</strong> {new Date(booking.startAt).toLocaleDateString()}
                  </p>
                )}
                {booking.startTime && booking.endTime && (
                  <p style={{ margin: '5px 0', color: '#555' }}>
                    <strong style={{ color: '#333' }}>Time:</strong> {booking.startTime.split('T')[1].substring(0, 5)} - {booking.endTime.split('T')[1].substring(0, 5)}
                  </p>
                )}
                {booking.startAt && booking.endAt && !booking.startTime && !booking.endTime && (
                  <p style={{ margin: '5px 0', color: '#555' }}>
                    <strong style={{ color: '#333' }}>Time:</strong> {booking.startAt.split('T')[1].substring(0, 5)} - {booking.endAt.split('T')[1].substring(0, 5)}
                  </p>
                )}
                <p style={{ margin: '5px 0', color: '#555' }}>
                  <strong style={{ color: '#333' }}>Hall Booking Price:</strong> ${booking.hallBookingPrice?.toFixed(2) || '0.00'}
                </p>
                <p style={{ margin: '5px 0', color: '#555' }}>
                  <strong style={{ color: '#333' }}>Total Price:</strong> ${booking.status == "Pending" ? calculateTotalPrice(booking) : booking.totalPrice }
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px', gap: '10px' }}>
                <button
                  onClick={() => openModal(booking)}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: '#66cef6',
                    color: 'white'
                  }}>
                  <FontAwesomeIcon icon={faEye} /> View Details
                </button>

                {(booking.status === 'Pending' || booking.status === 'Completed' ||booking.status === 'InProgress') && (
                  <button
                    onClick={() => handleCancelBooking(booking.id || booking._id)}
                    style={{
                      padding: '8px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: '#dc3545',
                      color: 'white'
                    }}>
                    <FontAwesomeIcon icon={faTimes} /> Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && selectedBooking && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>Booking Details</h2>
            <p><strong>Hall:</strong> {hallNames[selectedBooking.hallId] || selectedBooking.serviceName || 'Hall Booking'}</p>
            <p><strong>Type:</strong> {selectedBooking.type || 'N/A'}</p>
            <p><strong>Status:</strong> {selectedBooking.status || 'N/A'}</p>
            <p><strong>Event Date:</strong> {selectedBooking.eventDate ? new Date(selectedBooking.eventDate).toLocaleDateString() : 
              selectedBooking.startAt ? new Date(selectedBooking.startAt).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Time:</strong> {selectedBooking.startTime ? selectedBooking.startTime.split('T')[1].substring(0, 5) : 
              selectedBooking.startAt ? selectedBooking.startAt.split('T')[1].substring(0, 5) : 'N/A'} - 
              {selectedBooking.endTime ? selectedBooking.endTime.split('T')[1].substring(0, 5) : 
              selectedBooking.endAt ? selectedBooking.endAt.split('T')[1].substring(0, 5) : 'N/A'}</p>
            <p><strong>Hall Booking Price:</strong> ${selectedBooking.hallBookingPrice?.toFixed(2) || '0.00'}</p>
            <p><strong>Total Price:</strong> ${calculateTotalPrice(selectedBooking)}</p>

            {selectedBooking.status !== 'Cancelled' && selectedBooking.status !== 'Completed' && (
              <>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '30px'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '45%' }}>
                     {selectedBooking.status === 'Pending' && (
                    <button
                      onClick={() => {
                        setShowModal(false);
                        navigate('/stripe-payment', {
                       state: {
                      cartItems: [selectedBooking, ...cartItems.filter(item => item.bookingId === (selectedBooking.id || selectedBooking._id))],
                      payedPrice :calculateTotalPrice(selectedBooking), 
                      totalPrice: calculateTotalPrice(selectedBooking),
                      paymentType: 'stripe',
                      paymentOption: false
                      }
                     });

                      }}
                      style={{
                        background: '#66cef6',
                        color: 'white',
                        padding: '10px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Pay Full Amount Stripe
                    </button>
                     )}
                    {selectedBooking.status === 'Pending' && (
                      <button
                        onClick={() => {
                          setShowModal(false);
                          const horrorAmount = (parseFloat(calculateTotalPrice(selectedBooking)) * 0.3).toFixed(2);
                          navigate('/stripe-payment', {
                          state: {
                        cartItems: [selectedBooking, ...cartItems.filter(item => item.bookingId === (selectedBooking.id || selectedBooking._id))],
                        payedPrice : horrorAmount,
                        totalPrice: (parseFloat(calculateTotalPrice(selectedBooking))).toFixed(2),
                         paymentType: 'stripe',
                         paymentOption: true
                        }
                        });
                        }}
                        style={{
                          background: '#66cef6',
                          color: 'white',
                          padding: '10px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Pay a Horror Stripe
                      </button>
                    )}

                    {selectedBooking.status === 'InProgress' && (
                      <button
                        onClick={() => {
                          setShowModal(false);
                          const remainingAmount = (parseFloat(calculateTotalPrice(selectedBooking)) * 0.7).toFixed(2);
                          navigate('/stripe-payment', {
                            state: {
                              cartItems: [selectedBooking, ...cartItems.filter(item => item.bookingId === (selectedBooking.id || selectedBooking._id))],
                               payedPrice : remainingAmount,
                              totalPrice: (parseFloat(calculateTotalPrice(selectedBooking))).toFixed(2),
                              paymentType: 'stripe',
                              paymentOption: 0
                            }
                          });
                        }}
                        style={{
                          background: '#66cef6',
                          color: 'white',
                          padding: '10px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Pay the Remaining Amount With Stripe
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '45%' }}>
                       {selectedBooking.status === 'Pending' && (
                    <button
                      onClick={() => {
                        setShowModal(false);
                        navigate('/paypal-payment', {
                          state: {
                            cartItems: [selectedBooking, ...cartItems.filter(item => item.bookingId === (selectedBooking.id || selectedBooking._id))],
                             payedPrice :calculateTotalPrice(selectedBooking), 
                            totalPrice: calculateTotalPrice(selectedBooking),
                            paymentType: 'paypal',
                            paymentOption: 0
                          }
                        });
                      }}
                      style={{
                        background: '#f666b1',
                        color: 'white',
                        padding: '10px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Pay Full Amount Paypal
                    </button>
                       )}
                    {selectedBooking.status === 'Pending' && (
                      <button
                        onClick={() => {
                          setShowModal(false);
                          const horrorAmount = (parseFloat(calculateTotalPrice(selectedBooking)) * 0.3).toFixed(2);
                          navigate('/paypal-payment', {
                            state: {
                              cartItems: [selectedBooking, ...cartItems.filter(item => item.bookingId === (selectedBooking.id || selectedBooking._id))],
                              payedPrice : horrorAmount,
                              totalPrice: (parseFloat(calculateTotalPrice(selectedBooking))).toFixed(2),
                              paymentType: 'paypal',
                              paymentOption: 1
                            }
                          });
                        }}
                        style={{
                          background: '#f666b1',
                          color: 'white',
                          padding: '10px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Pay a Horror PayPal
                      </button>
                    )}

                    {selectedBooking.status === 'InProgress' && (
                      <button
                        onClick={() => {
                          setShowModal(false);
                          const remainingAmount = (parseFloat(calculateTotalPrice(selectedBooking)) * 0.7).toFixed(2);
                          navigate('/paypal-payment', {
                            state: {
                              cartItems: [selectedBooking, ...cartItems.filter(item => item.bookingId === (selectedBooking.id || selectedBooking._id))],
                              payedPrice : remainingAmount,
                              totalPrice: (parseFloat(calculateTotalPrice(selectedBooking))).toFixed(2),
                              paymentType: 'paypal',
                              paymentOption: 0
                            }
                          });
                        }}
                        style={{
                          background: '#f666b1',
                          color: 'white',
                          padding: '10px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        Pay the Remaining Amount With PayPal
                      </button>
                    )}
                  </div>
                </div>
                <div style={{
                  marginTop: '25px',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '15px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => fetchBookingDetails(selectedBooking.id || selectedBooking._id)}
                    style={{
                      background: 'linear-gradient(to right, #66cef6, #f666b1)',
                      color: 'white',
                      padding: '10px 20px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer'
                    }}
                  >
                    Get
                  </button>
                </div>
              </>
            )}

            <button onClick={() => setShowModal(false)} style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              fontSize: '18px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#888'
            }}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FindMyBookings;