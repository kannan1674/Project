import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

import Register from './Auth/register';
import Login from './Auth/login';
import Dashboard from './pages/dashboard';
import { useAuth } from './context/authContext';
import ForgotPassword from './Auth/forgotpassword';
import OTP from './Auth/Verifyotp/otp';
import ResetPassword from './Auth/resetpassword';
import Employee from './pages/Employee'
import Customer from './pages/customer'
import Team from './pages/team'

const App = () => {
  const { isAuthenticate } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={!isAuthenticate ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!isAuthenticate ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/verifyotp" element={<OTP />} />
        <Route path="/reset-password/:userId" element={<ResetPassword />} />
        <Route path="/dashboard" element={isAuthenticate ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/employee" element={<Employee /> } />
        <Route path="/customer" element={<Customer /> } />
        <Route path="/team" element={<Team /> } />
      </Routes>
    </Router>
  );
};

export default App;
