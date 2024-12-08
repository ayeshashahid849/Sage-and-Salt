const express = require('express');
const {
    getAllOrders,
    getOrdersByStatus,
    generateOrderReport,
} = require('../controllers/orderController');

const router = express.Router();

router.get('/', getAllOrders); // View All Orders
router.get('/status', getOrdersByStatus); // Search Orders by Status
router.get('/report', generateOrderReport); // Generate Report

module.exports = router;
