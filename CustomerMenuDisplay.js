import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerMenuDisplay = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menu/menuitems');
      const availableItems = response.data.filter(item => item.availability);
      setMenuItems(availableItems);
      setFilteredItems(availableItems);
    } catch (error) {
      console.error('Error fetching menu items', error);
    }
  };

  useEffect(() => {
    let result = menuItems;

    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (searchTerm) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(result);
  }, [selectedCategory, searchTerm, menuItems]);

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="bg-[#0c0b09] text-[#cda45e] w-full lg:w-64 p-4">
        <h2 className="text-center text-xl font-bold mb-6 mt-12">Menu Categories</h2>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category}>
              <button
                onClick={() => setSelectedCategory(category)}
                className={`w-full py-2 px-4 rounded-lg text-left ${
                  selectedCategory === category
                    ? 'bg-[#1a1814] text-white'
                    : 'hover:bg-[#1a1814] hover:text-white'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-1/2 p-2 border rounded-lg"
          />
        </div>

        {Object.keys(groupedItems).length === 0 ? (
          <p className="text-center text-gray-500">No menu items found.</p>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">{category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                  <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {item.image && (
                      <img
                        src={`data:${item.image.contentType};base64,${item.image.data}`}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold">{item.name}</h4>
                        <span className="text-green-600 font-semibold">${item.price}</span>
                      </div>
                      <p className="text-gray-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerMenuDisplay;
