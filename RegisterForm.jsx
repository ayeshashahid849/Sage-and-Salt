import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import nameImage from '../../assets/name.png';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showNotification('Passwords do not match', true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      showNotification('Registration successful! Please log in.');
      setRegistrationSuccess(true);
    } catch (err) {
      showNotification(err.message || 'An error occurred', true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0b09] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Logo className="w-24 h-24 border-4 border-[#cda45e]" />
          <img src={nameImage} alt="Sage and Salt" className="h-12 object-contain mt-4" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#cda45e]">
            Sign up for an account
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!registrationSuccess ? (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-black rounded-t-md focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e] focus:z-10 sm:text-sm bg-white"
                  placeholder="Enter username"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-black focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e] focus:z-10 sm:text-sm bg-white"
                  placeholder="Enter your Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-black focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e]  sm:text-sm bg-white"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#cda45e] placeholder-gray-500 text-black rounded-b-md focus:outline-none focus:ring-[#cda45e] focus:border-[#cda45e] sm:text-sm bg-white"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#0c0b09] bg-[#cda45e] hover:bg-[#b0843b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#cda45e]"
              >
                Sign up
              </button>
              <p className="text-center text-sm text-[#cda45e]">
                Already have an account?{' '}
                <Link to="/Adminlogin" className="font-medium text-[#cda45e] hover:text-[#b0843b]">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <div className="text-center text-[#cda45e]">
            <p>Registration successful! You can now <Link to="/login" className="underline hover:text-[#b0843b]">log in</Link>.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
