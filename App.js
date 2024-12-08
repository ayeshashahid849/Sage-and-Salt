import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './pages/dashboard'; 
import StaffManagement from './components/auth/StaffManagement';
import FeedbackManagement from './components/auth/FeedbackManager.js';  // relative to the file where you're importing
import OrderManagement from './components/auth/OrderDashboard.js'; // Correct import
import MenuManagement from './components/auth/MenuManagement.js';
import CustomerMenuDisplay from './components/auth/CustomerMenuDisplay.js';
import LocationManagement from './components/auth/LocationManagement.js';
const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/Adminlogin" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<Navigate to="/Adminlogin" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staff" element={<StaffManagement />} />
          <Route path="/feedback" element={<FeedbackManagement />} />
          <Route path="/order" element={<OrderManagement />} />
          <Route path="/menu" element={<MenuManagement/>}/>
          <Route path="/customermenu" element={<CustomerMenuDisplay />} />
          <Route path="/locations" element={<LocationManagement />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
