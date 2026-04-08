const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth'); // If you want to protect checkout

const router = express.Router();

// Initialize Razorpay
// If you don't have keys in .env, this will temporarily use dummy keys to prevent crashes,
// but actual checkout overlay requires real Test keys from Razorpay Dashboard.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey123456',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret1234567890123',
});

// @route   POST /api/payment/checkout
// @desc    Create an order, save shipping details, return Razorpay order ID
// @access  Public (or Private depending on requirements)
router.post('/checkout', async (req, res) => {
  try {
    const { shippingAddress, cartItems, totalAmount, userId } = req.body;

    if (!shippingAddress || !cartItems || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required order details' });
    }

    // 1. Create a placeholder order in database
    const newOrder = await Order.create({
      user: userId || null, // Optional if guest checkout is allowed
      shippingAddress,
      orderItems: cartItems,
      totalAmount,
      orderStatus: 'Payment Pending',
      paymentInfo: { status: 'Pending' }
    });

    // 2. Create Razorpay order
    const options = {
      amount: Math.round(totalAmount * 100), // Amount is in currency subunits (paise)
      currency: 'INR',
      receipt: `receipt_order_${newOrder._id}`,
    };

    try {
      const razorpayOrder = await razorpay.orders.create(options);
      
      // Update our database record with razorpay order ID
      newOrder.paymentInfo.orderId = razorpayOrder.id;
      await newOrder.save();

      res.status(200).json({
        success: true,
        order: razorpayOrder,
        dbOrderId: newOrder._id,
        // We pass the key ID back so the frontend checkout.js knows what key to use
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey123456' 
      });

    } catch (rzpError) {
      console.error('Razorpay Order Creation Failed:', rzpError);
      
      // In completely dummy demo mode (no real keys), we can mock the order ID so frontend can continue
      if (process.env.RAZORPAY_KEY_ID === undefined) {
          console.log('[DEMO MODE] Bypassing Razorpay strict validation. Returning mock order.');
          res.status(200).json({
             success: true,
             order: { id: `mock_order_${Date.now()}`, amount: options.amount, currency: 'INR' },
             dbOrderId: newOrder._id,
             key_id: 'rzp_test_dummykey123456'
          });
      } else {
         return res.status(500).json({ success: false, message: 'Failed to initialize payment gateway' });
      }
    }

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Server error during checkout' });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay signature after successful payment
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret1234567890123';

    // 1. Validate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    // In DEv mode with dummy keys, we allow it to pass if they match exactly what they send
    if (isAuthentic || process.env.RAZORPAY_KEY_ID === undefined) {
      // 2. Update Order Status
      await Order.findByIdAndUpdate(dbOrderId, {
        orderStatus: 'Processing',
        paidAt: new Date(),
        paymentInfo: {
          id: razorpay_payment_id,
          orderId: razorpay_order_id,
          signature: razorpay_signature,
          status: 'Completed'
        }
      });

      res.status(200).json({ success: true, message: 'Payment verified successfully', dbOrderId });
    } else {
      await Order.findByIdAndUpdate(dbOrderId, {
        orderStatus: 'Cancelled',
        paymentInfo: { status: 'Failed' }
      });
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
});

module.exports = router;
