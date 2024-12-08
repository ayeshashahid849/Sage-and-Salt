const Location = require('../models/Location');
const fs = require('fs');

exports.createLocation = async (req, res) => {
  try {
    const { 
      name, address, city, state, zipCode, 
      contactNumber, email, manager, operatingHours 
    } = req.body;

    // Handle image upload
    let imageData = null;
    if (req.file) {
      imageData = {
        data: req.file.buffer.toString('base64'),
        contentType: req.file.mimetype
      };
    }

    const newLocation = new Location({
      location_id: Math.floor(Math.random() * 10000),
      name,
      address,
      city,
      state,
      zipCode,
      contactNumber,
      email,
      image: imageData,
      manager,
      operatingHours: JSON.parse(operatingHours)
    });

    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateLocation = async (req, res) => {
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

    const updatedLocation = await Location.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updatedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.findByIdAndDelete(id);
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);
    
    if (location) {
      res.json(location);
    } else {
      res.status(404).json({ message: 'Location not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Location not found' });
  }
};

exports.searchLocations = async (req, res) => {
  try {
    const { query } = req.query;
    const locations = await Location.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { state: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};