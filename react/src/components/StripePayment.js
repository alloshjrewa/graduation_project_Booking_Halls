import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StripePayment.css';
import { comma } from 'postcss/lib/list';

const StripePayment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [succeeded, setSucceeded] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const { cartItems, totalPrice,payedPrice , paymentOption = 0 } = location.state || {
    cartItems: [],
    totalPrice: 0,
  };

  const bookingId = localStorage.getItem('bookingId');

  const safeTotalPrice = () => {
    try {
      return Number(payedPrice).toFixed(2);
    } catch {
      return "0.00";
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    setClientName(user.name || '');
    setClientEmail(user.email || '');
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    try {
      const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) throw stripeError;
      
      const intentResponse = await axios.post('http://localhost:8081/api/payments/create-payment-intent', {
        clientName,
        clientEmail,
        payedPrice: safeTotalPrice(),
        totalPrice: totalPrice,
        currency: 'usd',
        source: paymentMethod.id,
        bookingID: bookingId,
        paymentMethod: "Stripe",
        horror : paymentOption,
        hallName: currentCart.find(item => item.type === 'hall')?.name,
        service: currentCart.filter(item => item.type === 'service').map(item => ({
          id: item.id,
          name: item.name,
          price: item.price
        })),
        decors: currentCart.filter(item => item.type === 'decor').map(item => ({
          id: item.id,
          name: item.name,
          price: item.price
        }))
      });

      const { clientSecret } = intentResponse.data;

      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) throw confirmError;

      setSucceeded(true);
      localStorage.removeItem('cart');
      localStorage.removeItem('bookingId');
      localStorage.removeItem('finalPrice');

      toast.success('Payment successful! 🎉 Redirecting to homepage...', {
        position: 'top-center',
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      setTimeout(() => {
        navigate('/');
      }, 3500);

    } catch (err) {
      setError(err.message);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-payment-container">
      <h2>Complete Your Payment</h2>
      <p className="total-amount">Total: ${safeTotalPrice()}</p>

      {succeeded ? (
        <div className="success-message">
          <h3>Payment Successful!</h3>
          <p>Redirecting to homepage.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
            />
          </div>

          <div className="card-element-container">
            <label>Card Details</label>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
              }}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="pay-button"
          >
            {loading ? 'Processing...' : `Pay $${safeTotalPrice()}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default StripePayment;
