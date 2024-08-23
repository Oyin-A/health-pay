import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import Onboarding from './components/Onboarding';
import Search from './components/Search';
import Settings from './components/Settings';
import MedicalHistory from './components/MedicalHistory';
import TermsAndConditions from './components/TermsAndConditions';
import MakeClaims from './components/MakeClaims';
import MakePayments from './components/MakePayments';
import Financial from './components/Financial';
import SavingsProgress from './components/SavingsProgress';
import Transactions from './components/Transactions';
import AddNewClaim from './components/AddNewClaim';
import WelcomeAfterAcceptance from './components/WelcomeAfterAcceptance';
import PaymentMethods from './components/PaymentMethods';
import AddNewPaymentMethod from './components/AddNewPaymentMethod';
import { auth } from './firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { fetchUserData } from './components/authService';
import NearbyHospitals from './components/NearbyHospitals';
import NearbyInsurance from './components/NearbyInsurance';
import FAQ from './components/FAQ';
import Achievements from './components/Achievements';
import CustomerService from './components/CustomerService';
import Appointments from './components/Appointments';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import BookAppointment from './components/BookAppointment';

function App() {
  const [user, setUser] = useState(null);
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const stripePromise = loadStripe('pk_test_51PoVmkL3UFtopiib4YEA88EELjcOL6J6YPXzMIlbkohGGZLt3TRqvLrTPVW7VA73plaxiM5LNMn1UpOk0p79pmYQ00npB0n2Sh');
  const [claimsList, setClaimsList] = useState([]);

  const handleNewClaim = (newClaim) => {
    setClaimsList([...claimsList, newClaim]);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User logged in: ", user);
        setUser(user);
        const userData = await fetchUserData(user);
        console.log("Fetched user data: ", userData);
        if (userData?.isFirstTimeUser) {
          setFirstTimeUser(true);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/welcome-after-acceptance" element={<WelcomeAfterAcceptance />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/medical-history" element={<MedicalHistory />} />
            <Route path="/Achievements" element={<Achievements />} />
            <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
            <Route path="/add-new-claim" element={<AddNewClaim onSubmitClaim={handleNewClaim} />} />
            <Route path="/make-claims" element={<MakeClaims claims={claimsList} />} />
            <Route path="/make-payments" element={<MakePayments />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/savings-progress" element={<SavingsProgress />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/add-new-payment-method" element={<AddNewPaymentMethod />} />
            <Route path="/book-appointment/:id" element={<BookAppointment />} />
            <Route path="/nearby-insurance" element={<NearbyInsurance />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/customer-service" element={<CustomerService />} />
            <Route path="/appointments" element={<Appointments />} />
          </Routes>
        </div>
      </Router>
    </Elements>
  );
}

export default App;
