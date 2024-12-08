import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import nameImage from '../../assets/name.png';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showNotification = (message, isError = false) => {
    if (isError) {
      setError(message);
    } else {
      setError('');
      alert(message); // Using native alert for success messages
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      showNotification('Login successful!'); 
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      showNotification(err.message || 'An error occurred', true);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      showNotification('OTP sent to your email!');
      setOtpSent(true);
    } catch (err) {
      showNotification(err.message || 'Failed to send OTP', true);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showNotification('Passwords do not match', true);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      showNotification('Password reset successful!');
      setShowForgotPassword(false);
      setOtpSent(false);
      setFormData({
        email: '',
        password: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      showNotification(err.message || 'Failed to reset password', true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0b09] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="w-24 h-24 border-4 border-[#cda45e]" />
          <img src={nameImage} alt="Sage and Salt" className="h-12 object-contain mt-4" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#cda45e]">
            {showForgotPassword ? 'Reset Password' : 'Sign in to your account'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!showForgotPassword ? (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e] focus:z-10 sm:text-sm bg-white"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-black rounded-b-md focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e] focus:z-10 sm:text-sm bg-white"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#0c0b09] bg-[#cda45e] hover:bg-[#b0843b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cda45e]"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-[#cda45e] hover:text-[#b0843b] text-sm font-medium"
              >
                Forgot your password?
              </button>
              <p className="text-center text-sm text-[#cda45e]">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-[#cda45e] hover:text-[#b0843b]">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={otpSent ? handleResetPassword : handleSendOTP}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-[#cda45e] rounded-t-md focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e] focus:z-10 sm:text-sm bg-[#0c0b09]"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={otpSent}
                />
              </div>
              
              {otpSent && (
                <>
                  <div>
                    <input
                      name="otp"
                      type="text"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-[#cda45e] focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e] sm:text-sm bg-[#0c0b09]"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      name="newPassword"
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-[#cda45e] focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e] sm:text-sm bg-[#0c0b09]"
                      placeholder="New Password"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-[#cda45e] rounded-b-md focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e] sm:text-sm bg-[#0c0b09]"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#0c0b09] bg-[#cda45e] hover:bg-[#b0843b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cda45e]"
              >
                {otpSent ? 'Reset Password' : 'Send OTP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setOtpSent(false);
                  setFormData({
                    email: '',
                    password: '',
                    otp: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
                className="text-[#cda45e] hover:text-[#b0843b] text-sm font-medium"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;

