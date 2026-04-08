const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { sendInvoiceEmail } = require('../utils/emailService');
const { generateInvoiceHTML } = require('../utils/invoiceService');

const router = express.Router();

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     || 'rzp_test_dummykey123456',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret1234567890123',
});

// @route   POST /api/payment/checkout
// @desc    Create Razorpay order + save shipping details to DB
router.post('/checkout', async (req, res) => {
  try {
    const { shippingAddress, cartItems, totalAmount, userId } = req.body;

    if (!shippingAddress || !cartItems || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Missing required order details' });
    }

    // Save pending order to DB first
    const newOrder = await Order.create({
      user: userId || null,
      shippingAddress,
      orderItems: cartItems,
      totalAmount,
      orderStatus: 'Payment Pending',
      paymentInfo: { status: 'Pending' }
    });

    // Create Razorpay order
    const options = {
      amount:   Math.round(totalAmount * 100),
      currency: 'INR',
      receipt:  `receipt_${newOrder._id}`,
    };

    try {
      const razorpayOrder = await razorpay.orders.create(options);
      newOrder.paymentInfo.orderId = razorpayOrder.id;
      await newOrder.save();

      return res.status(200).json({
        success:   true,
        order:     razorpayOrder,
        dbOrderId: newOrder._id,
        key_id:    process.env.RAZORPAY_KEY_ID,
      });
    } catch (rzpError) {
      console.error('Razorpay Order Creation Failed:', rzpError);
      if (rzpError.statusCode === 401) {
        return res.status(401).json({
          success: false,
          message: 'Razorpay Authentication Failed. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env'
        });
      }
      return res.status(500).json({ success: false, message: 'Failed to initialize payment gateway' });
    }

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Server error during checkout' });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay signature, mark order paid, send invoice email
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret1234567890123';
    const body   = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      await Order.findByIdAndUpdate(dbOrderId, {
        orderStatus: 'Cancelled',
        'paymentInfo.status': 'Failed'
      });
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Mark order as paid
    const order = await Order.findByIdAndUpdate(dbOrderId, {
      orderStatus: 'Processing',
      paidAt: new Date(),
      paymentInfo: {
        id:        razorpay_payment_id,
        orderId:   razorpay_order_id,
        signature: razorpay_signature,
        status:    'Completed'
      }
    }, { new: true });

    // Generate invoice PDF and email it + send SMS (fire-and-forget)
    if (order) {
      (async () => {
        try {
          // 1. Send SMS
          const customerMobile = order.shippingAddress?.mobile;
          if (customerMobile) {
            const { sendOrderConfirmationSMS } = require('../utils/smsService');
            await sendOrderConfirmationSMS(customerMobile, order._id);
          }

          // 2. Send Email Invoice
          const html = generateInvoiceHTML(order);
          const customerEmail = order.shippingAddress?.email;
          if (customerEmail) {
            await sendInvoiceEmail(customerEmail, order, html);
            console.log(`✅ Invoice emailed to ${customerEmail}`);
          }
        } catch (invoiceErr) {
          console.error('Invoice/email/sms error (non-fatal):', invoiceErr.message);
        }
      })();
    }

    res.status(200).json({
      success:   true,
      message:   'Payment verified successfully',
      dbOrderId,
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during verification' });
  }
});

// @route   GET /api/payment/invoice/:orderId
// @desc    Download invoice PDF for an order
router.get('/invoice/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const html = generateInvoiceHTML(order);
    const orderId = String(order._id).slice(-8).toUpperCase();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="Invoice-INV-${orderId}.html"`);
    res.send(html);

  } catch (error) {
    console.error('Invoice download error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate invoice' });
  }
});

module.exports = router;
