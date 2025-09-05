import React from 'react';
import { useLocation, Link } from 'react-router-dom'; // نستخدم useLocation لاستقبال البيانات

function CheckoutPage() {
  const location = useLocation();
  const { cartItems, totalCartPrice } = location.state || { cartItems: [], totalCartPrice: 0 }; // استلام البيانات

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Checkout
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty. Please add services to proceed to checkout.</p>
            <Link to="/services" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-md">
              Browse Services
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-gray-800">Total:</span>
                <span className="text-3xl font-bold text-gradient-to-r from-purple-600 to-pink-600">
                  ${totalCartPrice.toFixed(2)}
                </span>
              </div>

              {/* هنا يمكن إضافة نموذج معلومات الدفع */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Information</h3>
                {/*Placeholder for payment form*/}
                <p className="text-gray-600">Payment gateway integration would go here (e.g., Stripe, PayPal form).</p>
                {/* <input type="text" placeholder="Card Number" className="w-full p-3 border rounded mb-3" />
                <div className="flex space-x-3 mb-4">
                  <input type="text" placeholder="MM/YY" className="w-1/2 p-3 border rounded" />
                  <input type="text" placeholder="CVC" className="w-1/2 p-3 border rounded" />
                </div>
                <input type="text" placeholder="Cardholder Name" className="w-full p-3 border rounded" /> */}
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
                Complete Purchase
              </button>
            </div>
          </>
        )}
      </div>
      <style jsx>{`
        .text-gradient-to-r {
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
          --tw-gradient-stops: var(--tw-gradient-from, #8b5cf6), var(--tw-gradient-to, #ec4899);
        }
      `}</style>
    </div>
  );
}

export default CheckoutPage;