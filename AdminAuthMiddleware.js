const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');  // Import the Admin model

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
    }

    const actualToken = token.replace('Bearer ', '');

    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

    // Verify the token and attach admin info to the request object
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    req.admin = admin;  // Attach admin info to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error });
  }
};

module.exports = authMiddleware;
