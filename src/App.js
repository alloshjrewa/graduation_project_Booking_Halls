import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Header from "./components/Header";
import AuthComponent from './components/AuthComponent';
import EventPortfolio from './components/EventPortfolio';
import CheckoutPage from './components/CheckoutPage';
import WeddingHalls from './components/WeddingHalls';
import HallDetails from './components/HallDetails';
import EventBookingForm from './components/EventBookingForm';
import JoyNestServices from './components/JoyNestServices';
import DecorDetails from './components/DecorDetails';
import ServiceDetails from './components/ServiceDetails';
import StripePayment from './components/StripePayment';
import PayPalPayment from './components/PayPalPayment';
import FindMyBooking from './components/FindMyBooking';
import CancelPage from './components/CancelPage';
import SuccessPage from './components/SuccessPage';
import CommunityPage from './components/CommunityPage';
import WeddingChatbot from './components/WeddingChatbot ';
import EditProfileForm from './components/EditProfileForm';
import PaymentHistory from './components/PaymentHistory';
const stripePromise = loadStripe('pk_test_51RVWfhQ4QH8zEdvCoQ5FQRhZWw6nOQaNbjCSr8hwYvFyV1jcBA5ofGkXdISCK9ESL8UKmQPspcxtsRqTsZ8JTyvJ00gclA9Jo7');

function App() {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path='/community' element={<CommunityPage />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path='/' element={<Header/>}/>
          <Route path='/edit-profile' element={<EditProfileForm />} />
          <Route path='event-services' element={<JoyNestServices/>}/>
          <Route path="/success" element={<SuccessPage />} />
      <Route path="/cancel" element={<CancelPage />} />
          <Route path='/find-my-booking' element={<FindMyBooking/>}/>
           <Route path='/find-my-booking' element={<FindMyBooking/>}/>
          <Route path='stripe-payment' element={<StripePayment/>}/>
          <Route path='/paypal-payment' element={<PayPalPayment/>}/>
          <Route path='/decor-details/:id' element={<DecorDetails/>}/>
          <Route path='/service-details/:id' element={<ServiceDetails/>}/>
          <Route path='/booking/:id' element={<EventBookingForm/>}/>
          <Route path='/event' element={<WeddingChatbot/>}/>
          <Route path='gallery' element={<EventPortfolio/>}/>
          <Route path='sign-up' element={<AuthComponent/>}/>
          <Route path='checkout' element={<CheckoutPage/>}/>
          <Route path='WeddingHalls' element={<WeddingHalls/>}/>
          <Route path="/WeddingHalls/:id" element={<HallDetails/>} />
          <Route path='/dashboard' element={<Header/>}/>
        </Routes>
      </Elements>
    </Router>
  );
}

export default App;