import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar.jsx';
//import locationImage from '../../assets/location.jpg';
import { FaSearch, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import './LocationManagement.css';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactNumber: '',
    email: '',
    manager: '',
    operatingHours: { openTime: '', closeTime: '' }
  });
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations/');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.keys(currentLocation).forEach(key => {
      if (key === 'operatingHours') {
        formData.append(key, JSON.stringify(currentLocation[key]));
      } else {
        formData.append(key, currentLocation[key]);
      }
    });

    if (image) {
      formData.append('image', image);
    }

    try {
      if (currentLocation._id) {
        await axios.put(`http://localhost:5000/api/locations/${currentLocation._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:5000/api/locations', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchLocations();
      resetForm();
      setImage(null)
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

 const handleEdit = (location) => {
  setCurrentLocation(location);
  setImage(null); // Optionally reset image to null if you want to allow replacing the image during edit
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/locations/${id}`);
      fetchLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/locations/search?query=${searchQuery}`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const resetForm = () => {
  // Reset form fields
  setCurrentLocation({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactNumber: '',
    email: '',
    manager: '',
    operatingHours: { openTime: '', closeTime: '' }
  });
  
  // Reset image state
  setImage(null);

  // Manually clear the file input field
  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput) {
    fileInput.value = ''; // Clear file input value
  }
};


  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar className="w-full md:w-1/4 bg-[#0c0b09] text-[#cda45e] md:h-screen fixed md:sticky top-0 transition-transform transform opacity-70 translate-x-[-100%] animate-slideIn" />

      <div className="flex-1 p-4 relative min-h-screen bg-image">
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        
        <div className="relative z-20 text-[#cda45e]">
          <h2 className="text-3xl font-bold mb-4 text-[#cda45e] mt-12">Location Management</h2>
          
          {/* Search Section */}
          <div className="relative flex items-center mb-4">
            <div className="w-full pr-10">
              <input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border p-2 rounded-md text-white pl-4 bg-[#1a1814] border-[#625b4b]"
              />
            </div>

            <div 
              className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-20 search-icon-container"
              onClick={handleSearch}
            >
              <FaSearch className="text-white" />
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <input
              type="text"
              name="name"
              placeholder="Restaurant Name"
              value={currentLocation.name}
              onChange={handleInputChange}
              required
              className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b]"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={currentLocation.address}
              onChange={handleInputChange}
              required
              className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b]"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={currentLocation.city}
              onChange={handleInputChange}
              required
              className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b]"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={currentLocation.state}
              onChange={handleInputChange}
              required
              className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b]"
            />
            <input
              type="text"
              name="zipCode"
              placeholder="Zip Code"
              value={currentLocation.zipCode}
              onChange={handleInputChange}
              required
              className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b]"
            />
            <input
              type="text"
              name="contactNumber"
              placeholder="Contact Number"
              value={currentLocation.contactNumber}
              onChange={handleInputChange}
              required
              className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b]"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={currentLocation.email}
              onChange={handleInputChange}
              required
              className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b]"
            />
            <input
              type="text"
              name="manager"
              placeholder="Manager Name"
              value={currentLocation.manager}
              onChange={handleInputChange}
              className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b]"
            />
            <div className="flex space-x-2">
             <input
  type="time"
  name="openTime"
  placeholder="Open Time"
  value={currentLocation.operatingHours.openTime || ''}
  onChange={(e) => setCurrentLocation(prev => ({
    ...prev,
    operatingHours: {
      ...prev.operatingHours,
      openTime: e.target.value
    }
  }))}
  className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b] flex-1"
  
/>
<input
  type="time"
  name="closeTime"
  placeholder="Close Time"
  value={currentLocation.operatingHours.closeTime || ''}
  onChange={(e) => setCurrentLocation(prev => ({
    ...prev,
    operatingHours: {
      ...prev.operatingHours,
      closeTime: e.target.value
    }
  }))}
  className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b] flex-1"
/>

            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 rounded-md text-white bg-[#1a1814] border-[#625b4b] col-span-full"
            />
            <button 
              type="submit" 
              className="col-span-full flex items-center justify-center bg-[#cda45e] text-black p-3 rounded hover:bg-[#b0843b] transition w-full md:w-auto"
            >
              <FaPlus className="mr-2" />
              {currentLocation._id ? 'Update Location' : 'Add Location'}
            </button>
          </form>

          {/* Locations List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-[#cda45e]">All Locations</h2>
            {locations.map(location => (
              <div 
                key={location._id} 
                className="p-4 border rounded-lg shadow-md bg-opacity-60 mb-4 bg-[#1a1814] border-[#625b4b]"
              >
                <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-[#cda45e]">{location.name}</h3>
                    <p className="text-white">{location.address}, {location.city}, {location.state} {location.zipCode}</p>
                    <p className="text-white">Contact: {location.contactNumber}</p>
                    <p className="text-white">Hours: {location.operatingHours.openTime} - {location.operatingHours.closeTime}</p>
                  </div>
                  <div className="flex flex-col items-end mt-4 md:mt-0">
                    {location.image && (
                      <img 
                        src={`data:${location.image.contentType};base64,${location.image.data}`} 
                        alt={location.name} 
                        className="w-32 h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                   <div className="flex justify-start items-center gap-2 edit-delete-container ml-2">
  <button 
    onClick={() => handleEdit(location)}
    className="bg-[#cda45e] text-black p-2 rounded hover:bg-[#b0843b] transition flex justify-center items-center edit-icon-container text-4xl"
  >
    <FaEdit />
  </button>
  <button 
    onClick={() => handleDelete(location._id)}
    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition flex justify-center items-center delete-icon-container"
  >
    <FaTrash />
  </button>
</div>


                    </div>
                  </div>
                </div>
         
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationManagement;
