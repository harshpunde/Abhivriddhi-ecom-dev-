// Server last updated: 2026-04-09T03:30 — Twilio SMS active
const express = require('express');
const compression = require('compression');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payment');
const productRoutes = require('./routes/products');
const User = require('./models/User');
const { initializeWhatsApp } = require('./utils/whatsappService');

const app = express();

// Use GZIP compression for faster data transfer
app.use(compression());

// Security middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins for dev
    callback(null, true);
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// OTP rate limiting (stricter)
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 OTP requests per windowMs
  message: 'Too many OTP requests, please try again later.'
});
app.use('/api/auth/send-otp', otpLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection and Admin seeding
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      console.log('No admin found. Creating default admin...');
      await User.create({
        name: 'Master Admin',
        email: 'admin@abhivriddhi.com',
        mobile: '+919999999999',
        password: 'abhivriddhi123',
        role: 'admin',
        isVerified: true
      });
      console.log('Default admin created: admin@abhivriddhi.com / abhivriddhi123');
    }
  } catch (err) {
    console.error('Admin seeding failed:', err.message);
  }
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/abhivriddhi')
  .then(() => {
    console.log('MongoDB connected successfully');
    seedAdmin();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize WhatsApp Bot
  initializeWhatsApp();
});

module.exports = app;