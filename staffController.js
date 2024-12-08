// controllers/staffController.js
const Staff = require('../models/staffModel');

// Create Staff
exports.createStaff = async (req, res) => {
  try {
    const { name, email, password, role, contact_number, shift_schedule, skills } = req.body;
    
    const newStaff = new Staff({
      name,
      email,
      password,  // Make sure to hash the password before saving it
      role,
      contact_number,
      shift_schedule,
      skills,
    });

    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (error) {
    res.status(500).json({ message: 'Error creating staff', error });
  }
};

// Search Staff Users
exports.searchStaff = async (req, res) => {
  try {
    const { name, role } = req.query;  // Search filters

    const staff = await Staff.find({
      name: { $regex: name, $options: 'i' },  // Case-insensitive search
      role: { $regex: role, $options: 'i' },  // Case-insensitive search
    });

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Error searching staff', error });
  }
};

// Update Staff User Information
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedStaff = await Staff.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedStaff);
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff', error });
  }
};

// Delete Staff User
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    await Staff.findByIdAndDelete(id);
    res.status(200).json({ message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting staff', error });
  }
};
