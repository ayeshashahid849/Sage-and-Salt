import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Utensils, MapPin, ShoppingBag, MessageSquare, Menu, X, User, LogOut, Bell } from 'lucide-react';
import menuImage from '../../assets/logo.jpeg';
import nameImage from '../../assets/name.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { to: "/dashboard", icon: Users, text: "Dashboard" },
    { to: "/staff", icon: Users, text: "Staff Management" },
    { to: "/menu", icon: Utensils, text: "Menu Management" },
    { to: "/locations", icon: MapPin, text: "Locations" },
    { to: "/order", icon: ShoppingBag, text: "Order Management" },
    { to: "/feedback", icon: MessageSquare, text: "Customer Feedback" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0c0b09] text-[#cda45e] p-2 fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={menuImage} 
              alt="Sage and Salt Logo" 
              className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-[#cda45e]"
            />
            <img 
              src={nameImage} 
              alt="Sage and Salt" 
              className="h-6 object-contain"
            />
          </div>
          <button onClick={toggleSidebar} className="text-[#cda45e]">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`bg-[#0c0b09] text-[#cda45e] w-64 min-h-screen p-6 shadow-lg fixed top-16 left-0 bottom-0 z-40 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:min-h-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Close button for mobile */}
        <button onClick={toggleSidebar} className="lg:hidden absolute top-4 right-4 text-[#cda45e]">
          <X size={24} />
        </button>

        {/* Top right icons with spacing */}
        <div className="absolute top-4 right-4 flex space-x-4 lg:space-x-2">
          <Link to="/profile" className="text-[#cda45e] hover:text-white transition-colors">
            <User size={20} />
          </Link>
          <button className="text-[#cda45e] hover:text-white transition-colors">
            <Bell size={20} />
          </button>
          <button 
            className="text-[#cda45e] hover:text-white transition-colors"
            onClick={() => navigate('/adminlogin')} // Navigate to AdminLogin on logout
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Logo and Name with spacing */}
        <div className="flex flex-col items-center mb-10 mt-8">
          <img 
            src={menuImage} 
            alt="Sage and Salt Logo" 
            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-[#cda45e]"
          />
          <img 
            src={nameImage} 
            alt="Sage and Salt" 
            className="h-12 object-contain"
          />
        </div>
        
        <nav>
          <ul className="space-y-4">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.to} 
                  className="flex items-center p-3 rounded-lg hover:bg-[#1a1814] hover:text-white transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3" />
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Spacer for mobile to prevent content from being hidden under the header */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Sidebar;
