// models/staffModel.js
const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
});

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },   // e.g. admin, waiter, chef
  contact_number: { type: String, required: true },
  shift_schedule: [shiftSchema],
  skills: { type: [String], required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;
