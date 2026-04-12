// Server last updated: 2026-04-09T03:30 — Twilio SMS active
console.log('🚀 [System] Backend boot sequence initiated...');
const express = require('express');
console.log('  - modules loaded: express');
const compression = require('compression');
console.log('  - modules loaded: compression');
const mongoose = require('mongoose');
console.log('  - modules loaded: mongoose');
const cors = require('cors');
console.log('  - modules loaded: cors');
const helmet = require('helmet');
console.log('  - modules loaded: helmet');
const rateLimit = require('express-rate-limit');
console.log('  - modules loaded: rate-limit');
require('dotenv').config();
console.log('  - config loaded: dotenv');

// --- CRASH PROTECTION ---
process.on('unhandledRejection', (reason, promise) => {
  console.error('\n⚠️ [SYSTEM] UNHANDLED REJECTION:', reason);
  // Keep server running - don't let isolated library failures crash the app
});

process.on('uncaughtException', (err) => {
  console.error('\n⚠️ [SYSTEM] UNCAUGHT EXCEPTION:', err.message);
  // Log and monitor, but keep process alive if safe
});
// ------------------------

const authRoutes = require('./routes/auth');
console.log('  - routes loaded: auth');
const userRoutes = require('./routes/users');
console.log('  - routes loaded: users');
const paymentRoutes = require('./routes/payment');
console.log('  - routes loaded: payment');
const productRoutes = require('./routes/products');
console.log('  - routes loaded: products');
const User = require('./models/User');
console.log('  - models loaded: User');
const { initializeWhatsApp } = require('./utils/whatsappService');
console.log('  - services loaded: whatsappService');

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
        name: 'Abhivriddhi Admin',
        email: 'abhivriddhiorganics@gmail.com',
        mobile: '+919999999999',
        password: 'adminPassword123!',
        role: 'admin',
        isVerified: true
      });
      console.log('Default admin created: abhivriddhiorganics@gmail.com / adminPassword123!');
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

// Serve uploaded product images statically
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
  setImmediate(() => {
    initializeWhatsApp();
  });
});

module.exports = app;