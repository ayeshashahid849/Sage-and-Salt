const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  location_id: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  zipCode: { 
    type: String, 
    required: true 
  },
  contactNumber: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  image: {
    data: String,
    contentType: String
  },
  manager: { 
    type: String 
  },
  operatingHours: {
    openTime: String,
    closeTime: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Location', LocationSchema);