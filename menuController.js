const MenuItem = require('../models/MenuItem');
const fs = require('fs');

exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, availability } = req.body;

    // Check if all required fields are present
    if (!name || !description || !price || !category) {
      return res
        .status(400)
        .json({ message: "Missing required fields: name, description, price, category" });
    }

    // Handle image upload if present
    let imageData = null;
    if (req.file) {
      imageData = {
        data: req.file.buffer.toString("base64"),
        contentType: req.file.mimetype,
      };
    }

    const newMenuItem = new MenuItem({
      item_id: Math.floor(Math.random() * 10000), // Generate unique ID
      name,
      description,
      price,
      category,
      availability,
      image: imageData, // Add image only if it exists
    });

    const savedItem = await newMenuItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error in createMenuItem:", error.message);
    res.status(400).json({ message: error.message });
  }
};


exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle image update
    if (req.file) {
      updateData.image = {
        data: req.file.buffer.toString('base64'),
        contentType: req.file.mimetype
      };
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    const formattedItems = menuItems.map(item => ({
      ...item.toObject(),
      price: item.price.toString() // Convert Decimal128 to string
    }));
    res.json(formattedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);
    if (menuItem) {
      const formattedItem = {
        ...menuItem.toObject(),
        price: menuItem.price.toString() // Convert Decimal128 to string
      };
      res.json(formattedItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Menu item not found' });
  }
};
