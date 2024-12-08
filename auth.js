const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Admin = require('../models/admin');
const { registerAdmin, loginAdmin } = require('../controllers/authController');

const otpStore = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    otpStore[email] = {
      otp,
      otpExpires,
      userId: admin._id
    };
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };
    
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    
    const otpData = otpStore[email];
    if (!otpData || Date.now() > otpData.otpExpires) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP not found or expired' });
    }
    
    if (otpData.otp !== otp.toString()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    const admin = await Admin.findById(otpData.userId);
    if (!admin) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update password - will be hashed by pre-save middleware
    admin.password = newPassword;
    await admin.save();
    
    delete otpStore[email];
    
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});

module.exports = router;