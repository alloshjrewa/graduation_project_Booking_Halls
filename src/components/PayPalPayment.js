import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './StripePayment.css';

const PayPalPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [paypalReady, setPaypalReady] = useState(false);
    const paypalScriptLoaded = useRef(false); // Track if the script has loaded
    const paypalButtonsRendered = useRef(false);

    const { cartItems, totalPrice, payedPrice, paymentOption = 0 } = location.state || {
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
        setClientEmail(user.username || '');
    }, []);

    useEffect(() => {
        if (!paypalScriptLoaded.current) {
            const script = document.createElement('script');
            script.src = `https://www.sandbox.paypal.com/sdk/js?client-id=AajjejyN1LMy7GpMH93KKrlXTkDRJgAuObycpCxIN0l31NgqepmnasOF4b7ROgXlzEaHn1F7mvezj2X3&currency=USD`;
            script.onload = () => {
                setPaypalReady(true);
                paypalScriptLoaded.current = true;
            };
            script.onerror = (err) => {
                console.error("Failed to load PayPal SDK script", err);
                setError("Failed to load PayPal. Please try again later.");
            };

            document.body.appendChild(script);

            // Cleanup function to prevent removeChild error
            return () => {
                try {
                    document.body.removeChild(script);
                } catch (e) {
                    // Ignore the error if the script has already been removed
                    console.warn("Attempted to remove PayPal script but it was not found", e);
                }
            };
        }
    }, []);

    useEffect(() => {
        if (paypalReady && !paypalButtonsRendered.current) {
            renderPayPalButtons();
        }
    }, [paypalReady]);

    const renderPayPalButtons = () => {
        if (window.paypal && !paypalButtonsRendered.current && !document.getElementById('paypal-button-container').hasChildNodes()) {
            paypalButtonsRendered.current = true;
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: safeTotalPrice(),
                            },
                        }],
                    });
                },
                 onApprove: async (data, actions) => {
        setLoading(true);
        try {
            const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            const paymentDetails = await actions.order.capture();

            console.log("Payment Details:", paymentDetails);
            console.log("Payment ID:", paymentDetails.id); // Log payment ID
            
            // Extract payerId (ensure this logic is correct based on paymentDetails structure)
            let payerId = null;
            if (paymentDetails?.payer?.payer_info?.payer_id) {
                payerId = paymentDetails.payer.payer_info.payer_id;
            } else if (paymentDetails?.payer?.id) {
                payerId = paymentDetails.payer.id;
            } else if (paymentDetails?.purchase_units && paymentDetails?.purchase_units[0]?.payments?.captures[0]?.id) {
                payerId = paymentDetails?.purchase_units[0]?.payments?.captures[0]?.id
            }

            console.log("Payer ID:", payerId); // Log payer ID

            if (!payerId) {
                console.error("Payer ID not found in paymentDetails");
                setError("Payer ID not found. Payment cannot be processed.");
                setLoading(false);
                return;
            }

            await axios.post('http://localhost:8081/api/payments/paypal-payment', {
                clientName,
                clientEmail,
                payedPrice: safeTotalPrice(),
                totalPrice,
                source: "sale",
                currency: 'usd',
                bookingID: bookingId,
                paymentMethod: "PayPal",
                horror: paymentOption,
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
                })),
                returnUrl: "http://localhost:3000/success",
                cancelUrl: "http://localhost:3000/cancel",
                paymentId: paymentDetails.id, // Pass paymentId explicitly
                payerId: payerId,             // Pass payerId explicitly
            });

                        setSucceeded(true);
                        localStorage.removeItem('cart');
                        localStorage.removeItem('bookingId');
                        localStorage.removeItem('finalPrice');

                        toast.success('Payment successful with PayPal! 🎉', {
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
                        setError('Payment failed. Try again.');
                        console.error(err);
                    } finally {
                        setLoading(false);
                    }
                },
                onError: (err) => {
                    console.error('PayPal Error:', err);
                    setError('Payment failed. Please try again.');
                }
            }).render('#paypal-button-container');
        }
    };

    return (
        <div className="stripe-payment-container">
            <h2>Complete Your Payment with PayPal</h2>
            <p className="total-amount">Total: ${safeTotalPrice()}</p>

            {succeeded ? (
                <div className="success-message">
                    <h3>Payment Successful!</h3>
                    <p>Redirecting to homepage...</p>
                </div>
            ) : (
                <div className="payment-form">
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

                    <div id="paypal-button-container" style={{ marginTop: '20px' }}></div>

                    {error && <div className="error-message">{error}</div>}
                    {loading && <p>Processing payment...</p>}
                </div>
            )}
        </div>
    );
};

export default PayPalPayment;