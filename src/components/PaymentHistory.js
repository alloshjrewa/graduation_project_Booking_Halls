import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      setErrorMessage('User not logged in.');
      setLoading(false);
      return;
    }

    const email = JSON.parse(userData).username;

    axios
      .get(`http://localhost:8081/api/paymenthistory/${email}`)
      .then((response) => {
        setPayments(response.data);
        setSuccessMessage('Payment history loaded successfully.');
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Error fetching payment history.');
        setLoading(false);
      });
  }, []);

  const goBackHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gradient-to-r from-blue-300 to-pink-300 text-white font-sans relative">
      <div className="max-w-6xl mx-auto bg-white/20 p-8 rounded-xl shadow-lg backdrop-blur-md relative">

        {/* Back Button */}
        <button
          onClick={goBackHome}
          className="absolute top-6 left-6 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow z-10"
        >
          ← Back to Home
        </button>

        {/* Content Section */}
        <div className="pt-16">
          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-100 text-red-800">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-100 text-green-800">
              {successMessage}
            </div>
          )}

          <h2 className="text-center text-3xl font-bold mb-8 text-white drop-shadow">
            <i className="fa fa-credit-card mr-2" />
            Payment History
          </h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : payments.length === 0 ? (
            <p className="text-center">No payment history found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto bg-white text-black rounded-lg shadow">
                <thead className="bg-pink-500 text-white">
                  <tr>
                    <th className="py-3 px-4 border">Timestamp</th>
                    <th className="py-3 px-4 border">User Name</th>
                    <th className="py-3 px-4 border">User Email</th>
                    <th className="py-3 px-4 border">Amount</th>
                    <th className="py-3 px-4 border">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                    >
                      <td className="py-2 px-4 border">
                        {new Date(payment.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {payment.user?.name || 'N/A'}
                      </td>
                      <td className="py-2 px-4 border">
                        {payment.user?.email || 'N/A'}
                      </td>
                      <td className="py-2 px-4 border">
                        {payment.payment?.amount?.toFixed(2) || '0.00'}
                      </td>
                      <td className="py-2 px-4 border">
                        {payment.details || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentHistory;
