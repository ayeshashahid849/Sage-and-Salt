// routes/staffRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/AdminAuthMiddleware');
const staffController = require('../controllers/staffController');
const router = express.Router();

// Middleware to protect these routes (authentication required)
router.get('/protected-route', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'You have access to this protected route' });
});

// Create Staff User
router.post('/create', staffController.createStaff);

// Search Staff Users
router.get('/search', staffController.searchStaff);

// Update Staff User Information
router.put('/update/:id', staffController.updateStaff);

// Delete Staff User
router.delete('/delete/:id', staffController.deleteStaff);

module.exports = router;
