const Order = require('../models/Order'); // Importing the Order model

// 1. View All Orders
const getAllOrders = async (req, res) => {
    try {
        // Fetching all orders without populating userId or items
        const orders = await Order.find();
        res.status(200).json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// 2. Search Orders by Status
const getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        // Log the status to check if the parameter is correctly parsed
        console.log('Query Status:', status);

        // Ensure status is provided
        if (!status) {
            return res.status(400).json({ message: 'Please provide an order status' });
        }

        // Fetching orders that match the given status inside the 'tracking' object
        const orders = await Order.find({ 'tracking.status': status });

        // Log the number of orders found
        console.log('Orders Found:', orders.length);

        if (orders.length === 0) {
            return res.status(404).json({ message: `No orders found with status: ${status}` });
        }

        res.status(200).json({ message: `Orders with status: ${status}`, orders });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders by status', error: error.message });
    }
};

// 3. Generate Order Reports (Backend Preparation)
const generateOrderReport = async (req, res) => {
    try {
        // Aggregating orders by tracking status (e.g., 'Preparing', 'Ready', 'Delivered')
        const report = await Order.aggregate([
            {
                $group: {
                    _id: '$tracking.status', // Group by order status
                    totalOrders: { $sum: 1 }, // Count orders per status
                    totalPrice: { $sum: '$totalPrice' }, // Sum total price per status
                },
            },
            {
                $sort: { totalOrders: -1 }, // Sorting by totalOrders or totalPrice
            },
        ]);

        res.status(200).json({ message: 'Order report generated successfully', report });
    } catch (error) {
        res.status(500).json({ message: 'Error generating report', error: error.message });
    }
};

module.exports = {
    getAllOrders,
    getOrdersByStatus,
    generateOrderReport,
};
