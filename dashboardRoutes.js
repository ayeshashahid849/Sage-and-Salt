// routes/dashboard.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const menu = require('../models/MenuItem');
const Feedback = require('../models/Feedbacks');

// Get daily orders and revenue statistics
router.get('/daily-stats', async (req, res) => {
  try 
  {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
          averageOrderValue: { $avg: "$totalPrice" }
        }
      }
    ]);
    
    res.json(stats[0] || { totalOrders: 0, totalRevenue: 0, averageOrderValue: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular menu items
router.get('/popular-items', async (req, res) => {
  try {
    const popularItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.ItemId",
          totalOrders: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "menu",
          localField: "_id",
          foreignField: "_id",
          as: "menuItem"
        }
      }
    ]);
    
    res.json(popularItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get feedback statistics
router.get('/feedback-stats', async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);
    
    res.json(stats[0] || { averageRating: 0, totalFeedback: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get revenue trends (last 7 days)
router.get('/revenue-trend', async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const trend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    
    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;