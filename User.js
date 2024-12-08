const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }, // To store the hashed password
    contactNumber: { type: String, required: true },
    preferredAddress: { type: String, required: true },
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Reference to the Order model
    reservationHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }], // Reference to Reservation model (if applicable)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create a User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
