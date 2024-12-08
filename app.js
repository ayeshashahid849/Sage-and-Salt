const express = require('express');
const connectDB = require('./config/db');
const staffRoutes = require('./routes/staffRoutes');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orderRoutes'); 
const feedbackRoutes = require('./routes/feedbackRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const menuItem = require('./routes/menuRoutes');
const location=require('./routes/locationRoutes')
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();
dotenv.config();


// Middleware to parse JSON data
app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Connect to the database
connectDB();

// Routes
app.use('/api/staff', staffRoutes);
app.use('/api/Auth', authRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/menu', menuItem);
app.use('/api/locations', location);

// Catch-all route for 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
// General error handler for the app
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

// Server configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
