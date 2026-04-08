const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTPByEmail } = require('../utils/emailService');
const { sendOTPBySMS } = require('../utils/smsService');
const { generateToken } = require('../utils/jwt');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('mobile').matches(/^\+91[6-9]\d{9}$/).withMessage('Please provide a valid Indian mobile number (+91XXXXXXXXXX)'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('identifier').notEmpty().withMessage('Email or mobile is required'),
  body('password').exists().withMessage('Password is required')
];

const otpValidation = [
  body('identifier').notEmpty().withMessage('Email or mobile is required'),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be 6 digits'),
  body('type').isIn(['email', 'mobile']).withMessage('Type must be email or mobile')
];

// @route   POST /api/auth/register
// @desc    Register user and send OTP
// @access  Public
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, mobile, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Mobile number already registered'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password
    });

    // Generate and send OTP to both email and mobile
    const otp = user.generateOTP('both');
    await user.save();

    // Send OTP to email
    try {
      await sendOTPByEmail(email, otp, 'registration');
    } catch (emailError) {
      console.error('Email OTP failed:', emailError);
    }

    // Send OTP to mobile
    try {
      await sendOTPBySMS(mobile, otp, 'registration');
    } catch (smsError) {
      console.error('SMS OTP failed:', smsError);
    }

    // Save OTP record
    await OTP.create({
      identifier: email,
      type: 'email',
      otp: otp,
      purpose: 'registration'
    });

    await OTP.create({
      identifier: mobile,
      type: 'mobile',
      otp: otp,
      purpose: 'registration'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email and mobile with the OTP sent.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/send-otp
// @desc    Send OTP for login or verification
// @access  Public
router.post('/send-otp', async (req, res) => {
  try {
    const { identifier, type, purpose = 'login' } = req.body;

    if (!identifier || !type) {
      return res.status(400).json({
        success: false,
        message: 'Identifier and type are required'
      });
    }

    if (!['email', 'mobile'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be email or mobile'
      });
    }

    let user;
    let otp;

    if (purpose === 'login') {
      // For login, user must exist
      user = await User.findOne(
        type === 'email' ? { email: identifier } : { mobile: identifier }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `${type === 'email' ? 'Email' : 'Mobile number'} not registered`
        });
      }

      otp = user.generateOTP(type);
      await user.save();
    } else {
      // For registration verification, create temporary OTP
      otp = Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Send OTP
    if (type === 'email') {
      await sendOTPByEmail(identifier, otp, purpose);
    } else {
      await sendOTPBySMS(identifier, otp, purpose);
    }

    // Save OTP record
    await OTP.create({
      identifier,
      type,
      otp,
      purpose
    });

    res.json({
      success: true,
      message: `OTP sent to your ${type}`,
      type
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and complete registration/login
// @access  Public
router.post('/verify-otp', otpValidation, async (req, res) => {
  try {
    const { identifier, otp, type, purpose = 'login' } = req.body;

    // Find OTP record
    const otpRecord = await OTP.findOne({
      identifier,
      type,
      purpose,
      isVerified: false
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP is expired
    if (otpRecord.expireAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
        attemptsLeft: 3 - otpRecord.attempts
      });
    }

    // Mark OTP as verified
    otpRecord.isVerified = true;
    await otpRecord.save();

    let user;
    let token;

    if (purpose === 'registration') {
      // Find user and mark as verified
      user = await User.findOne(
        type === 'email' ? { email: identifier } : { mobile: identifier }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (type === 'email') {
        user.emailVerified = true;
      } else {
        user.mobileVerified = true;
      }

      // If both are verified, mark user as fully verified
      if (user.emailVerified && user.mobileVerified) {
        user.isVerified = true;
      }

      await user.save();

      // Generate token
      token = generateToken(user._id);

    } else if (purpose === 'login') {
      // For login, find user and generate token
      user = await User.findOne(
        type === 'email' ? { email: identifier } : { mobile: identifier }
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      token = generateToken(user._id);
    }

    res.json({
      success: true,
      message: `${purpose === 'registration' ? 'Account verified' : 'Login successful'}`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
        emailVerified: user.emailVerified,
        mobileVerified: user.mobileVerified
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login with password (alternative to OTP)
// @access  Public
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or mobile
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { mobile: identifier }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
        emailVerified: user.emailVerified,
        mobileVerified: user.mobileVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        isVerified: user.isVerified,
        emailVerified: user.emailVerified,
        mobileVerified: user.mobileVerified,
        addresses: user.addresses,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;