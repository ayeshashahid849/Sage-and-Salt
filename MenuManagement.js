import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { FaSearch, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import './MenuManagement.css';
import menuImage from '../../assets/menu.jpeg';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    _id: '',
    name: '',
    description: '',
    price: '',
    category: '',
    availability: true,
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menu/menuitems');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setCurrentItem((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(currentItem).forEach((key) => {
      if (key !== 'image' && currentItem[key]) {
        formData.append(key, currentItem[key]);
      }
    });

    if (currentItem.image) {
      formData.append('image', currentItem.image);
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/menu/${currentItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://localhost:5000/api/menu/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item', error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/menu/${id}`);
      const item = response.data;
      setCurrentItem({
        _id: item._id,
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        availability: item.availability,
        image: null,
      });
      setIsEditing(true);
    } catch (error) {
      console.error('Error preparing item for edit', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item', error);
    }
  };

  const resetForm = () => {
    setCurrentItem({
      _id: '',
      name: '',
      description: '',
      price: '',
      category: '',
      availability: true,
      image: null,
    });
    setIsEditing(false);
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar className="w-full md:w-1/4 bg-dark text-white h-auto md:h-screen" />

      <div 
        className="flex-1 p-4 relative bg-image"
        style={{
          backgroundImage: `url(${menuImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-[#cda45e] mt-12">
            {isEditing ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>

        <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-lg shadow-lg border border-[#cda45e]" style={{ backgroundColor: 'rgba(0, 0, 0,0.65)' }}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={currentItem.name}
                onChange={handleInputChange}
                placeholder="Menu Item Name"
                required
                className="border p-2 rounded bg-dark-secondary text-white"
              />
              <input
                type="number"
                name="price"
                value={currentItem.price}
                onChange={handleInputChange}
                placeholder="Price"
                required
                className="border p-2 rounded bg-dark-secondary text-white"
              />
              <textarea
                name="description"
                value={currentItem.description}
                onChange={handleInputChange}
                placeholder="Description"
                required
                className="border p-2 rounded bg-dark-secondary text-white col-span-full"
              />
              <select
                name="category"
                value={currentItem.category}
                onChange={handleInputChange}
                required
                className="border p-2 rounded bg-dark-secondary text-white"
              >
                <option value="">Select Category</option>
                <option value="Appetizer">Appetizer</option>
                <option value="Main Course">Main Course</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
              </select>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="availability"
                  checked={currentItem.availability}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-white">Available</label>
              </div>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="border p-2 rounded bg-dark-secondary text-white col-span-full"
              />
            </div>
            <div className="flex flex-wrap justify-center mt-6 gap-4">
              <button type="submit" className="bg-[#cda45e] text-dark px-4 py-2 rounded hover:bg-gold-light flex items-center">
                <FaPlus className="mr-2" />
                {isEditing ? 'Update Item' : 'Add Menu Item'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mb-8 p-6 rounded-lg shadow-lg border border-[#cda45e]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}><h3 className="text-2xl font-semibold mb-4 text-[#cda45e]">Current Menu Items</h3>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 rounded bg-dark-secondary text-white border border-[#cda45e]"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#cda45e]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <div key={item._id} className="border border-[#cda45e] rounded-lg p-4 bg-dark-secondary">
                  {item.image && (
                    <img
                      src={`data:${item.image.contentType};base64,${item.image.data}`}
                      alt={item.name}
                      className="w-full h-48 object-cover mb-4 rounded"
                    />
                  )}
                  <h4 className="font-bold text-xl mb-2 text-[#cda45e]">{item.name}</h4>
                  <p className="text-white mb-2">{item.description}</p>
                  <p className="text-white mb-2">Price: ${item.price.toString()}</p>
                  <p className="text-white mb-2">Category: {item.category}</p>
                  <p className="text-white mb-4">Available: {item.availability ? 'Yes' : 'No'}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-[#cda45e] text-dark p-2 rounded hover:bg-[#cda45e]-light edit-icon-container"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 delete-icon-container"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManagement;

