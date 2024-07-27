// src/App.js
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
import CustomerService from './components/CustomerService';
import Appointments from './components/Appointments';


function App() {
  const [user, setUser] = useState(null);
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  const [loading, setLoading] = useState(true);

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
          <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
          <Route path="/make-claims" element={<MakeClaims />} />
          <Route path="/add-new-claim" element={<AddNewClaim />} />
          <Route path="/make-payments" element={<MakePayments />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/savings-progress" element={<SavingsProgress />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/add-new-payment-method" element={<AddNewPaymentMethod />} />
          <Route path="/nearby-insurance" element={<NearbyInsurance />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
