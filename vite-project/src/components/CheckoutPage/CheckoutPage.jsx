import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder, verifyPayment } from '../../services/api';
import { CheckCircle, ShieldCheck, MapPin, Phone, Home, Package } from 'lucide-react';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman & Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [errors, setErrors] = useState({});
  const [showMockRazorpay, setShowMockRazorpay] = useState(false);
  const [mockOrderData, setMockOrderData] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    addressLine: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
  });

  const totalAmount = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Pre-fill user data if logged in
  useEffect(() => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData.name) {
        setFormData((prev) => ({
          ...prev,
          fullName: userData.name || '',
          email: userData.email || '',
          mobile: userData.mobile ? userData.mobile.replace('+91', '') : '',
        }));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.mobile.trim() || !/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.addressLine.trim()) newErrors.addressLine = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'Please select your state';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const displayRazorpay = async (orderData, key_id, dbOrderId) => {
    // If we are using dummy keys (because no RAZORPAY_KEY_ID in .env)
    // We display a Mock Razorpay modal instead of crashing.
    if (key_id === 'rzp_test_dummykey123456') {
      setLoading(false);
      setMockOrderData({ ...orderData, dbOrderId, key_id });
      setShowMockRazorpay(true);
      return;
    }

    const options = {
      key: key_id,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'Abhivriddhi Organics',
      description: 'Organic Products Purchase',
      image: '/logo.png',
      order_id: orderData.id,
      handler: async function (response) {
        setLoading(true);
        try {
          const verifyRes = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            dbOrderId,
          });
          if (verifyRes.success) {
            setOrderId(dbOrderId);
            if (typeof clearCart === 'function') clearCart();
            setSuccess(true);
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        } catch (err) {
          console.error('Payment verification error:', err);
          alert('Payment verification error. Please contact support with your payment ID: ' + response.razorpay_payment_id);
        }
        setLoading(false);
      },
      prefill: {
        name: formData.fullName,
        email: formData.email || '',
        contact: formData.mobile.startsWith('+91') ? formData.mobile : `+91${formData.mobile}`,
      },
      notes: {
        address: formData.addressLine,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      theme: { color: '#4a7c23' },
      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      setLoading(false);
      alert('Payment failed: ' + (response.error?.description || 'Unknown error'));
    });
    paymentObject.open();
  };

  const handleMockRazorpaySuccess = async () => {
    setShowMockRazorpay(false);
    setLoading(true);
    // Simulate verification
    try {
      const verifyRes = await verifyPayment({
        razorpay_payment_id: `mock_pay_${Date.now()}`,
        razorpay_order_id: mockOrderData.id,
        razorpay_signature: 'mock_signature', // Backend bypasses this in complete dummy mode
        dbOrderId: mockOrderData.dbOrderId,
      });
      if (verifyRes.success) {
        setOrderId(mockOrderData.dbOrderId);
        if (typeof clearCart === 'function') clearCart();
        setSuccess(true);
      } else {
        alert('Mock payment verification failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Mock payment failed.');
    }
    setLoading(false);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      return alert('Your cart is empty!');
    }
    if (!validate()) return;

    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
      const payload = {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          mobile: formData.mobile.trim().startsWith('+91')
            ? formData.mobile.trim()
            : `+91${formData.mobile.trim()}`,
          addressLine: formData.addressLine.trim(),
          landmark: formData.landmark.trim(),
          city: formData.city.trim(),
          state: formData.state,
          pincode: formData.pincode.trim(),
          email: formData.email.trim(),
        },
        cartItems: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.img,
        })),
        totalAmount,
        userId: userId || null,
      };

      const res = await createOrder(payload);
      if (res.success) {
        displayRazorpay(res.order, res.key_id, res.dbOrderId);
      } else {
        alert('Failed to initialize checkout. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong while initiating checkout. Please try again.');
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-slate-50 mt-16 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Order Placed! 🎉</h2>
          {orderId && (
            <p className="text-xs text-slate-400 mb-4 font-mono">Order ID: {orderId}</p>
          )}
          <p className="text-slate-600 mb-8">
            Thank you for shopping with <strong>Abhivriddhi Organics</strong>. Your order is being processed and will be shipped soon.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-[#4a7c23] text-white py-3 rounded-xl font-semibold hover:bg-[#3d6a1c] transition"
            >
              Track My Order
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* MOCK RAZORPAY MODAL FOR DEMO */}
      {showMockRazorpay && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-[#4a7c23] p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Abhivriddhi Organics</h3>
                <p className="text-sm opacity-90">Test Mode Payment</p>
              </div>
              <button 
                onClick={() => setShowMockRazorpay(false)}
                className="text-white hover:bg-black/20 p-1.5 rounded-lg transition"
              >✕</button>
            </div>
            
            {/* Body */}
            <div className="p-6">
              <div className="mb-6 pb-6 border-b border-slate-100 flex justify-between items-center">
                <span className="text-slate-500 font-medium">Card/UPI payment</span>
                <span className="text-2xl font-bold text-slate-800">
                  ₹{(mockOrderData?.amount / 100).toLocaleString('en-IN') || totalAmount}
                </span>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg text-sm mb-6 flex gap-2">
                <span>ℹ️</span> 
                This is a mock checkout because RAZORPAY_KEY_ID is missing in the .env file.
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handleMockRazorpaySuccess}
                  className="w-full bg-[#1b9a59] text-white py-3 rounded-lg font-bold shadow hover:bg-[#15814a] transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Simulate Success
                </button>
                <button 
                  onClick={() => { setShowMockRazorpay(false); setLoading(false); alert('Payment failed by user simulation.'); }}
                  className="w-full bg-red-100 text-red-700 py-3 rounded-lg font-semibold hover:bg-red-200 transition"
                >
                  Simulate Failure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-500 mt-1">Fill in your shipping details to complete your order.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Shipping Form */}
          <div className="lg:w-2/3">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="text-[#4a7c23] w-5 h-5" />
                Shipping Information
              </h2>

              <form className="space-y-5" onSubmit={handleCheckout} noValidate>
                {/* Name + Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full p-3 bg-slate-50 border rounded-xl outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10 ${
                        errors.fullName ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                      placeholder="Recipient's full name"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-medium">+91</span>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-3 py-3 bg-slate-50 border rounded-xl outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10 ${
                          errors.mobile ? 'border-red-400 bg-red-50' : 'border-slate-200'
                        }`}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                    {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
                  </div>
                </div>

                {/* Email (optional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email <span className="text-slate-400 font-normal">(for order confirmation)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address / Flat / Street <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    rows={2}
                    className={`w-full p-3 bg-slate-50 border rounded-xl outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10 resize-none ${
                      errors.addressLine ? 'border-red-400 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="House/Flat No., Building, Street, Area"
                  />
                  {errors.addressLine && <p className="mt-1 text-xs text-red-500">{errors.addressLine}</p>}
                </div>

                {/* Landmark */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Landmark <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10"
                    placeholder="Near school, temple, etc."
                  />
                </div>

                {/* City, State, Pincode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full p-3 bg-slate-50 border rounded-xl outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10 ${
                        errors.city ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                      placeholder="Mumbai"
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full p-3 bg-slate-50 border rounded-xl outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10 ${
                        errors.state ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      maxLength={6}
                      className={`w-full p-3 bg-slate-50 border rounded-xl outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10 ${
                        errors.pincode ? 'border-red-400 bg-red-50' : 'border-slate-200'
                      }`}
                      placeholder="400001"
                    />
                    {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
                  </div>
                </div>

                {/* Security note */}
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                  <ShieldCheck className="text-green-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700">
                    Your payment is processed securely through <strong>Razorpay</strong>. We never store your card details.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="w-full mt-2 bg-[#4a7c23] text-white py-4 rounded-2xl font-bold text-base shadow-md hover:bg-[#3d6a1c] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${totalAmount.toLocaleString('en-IN')} with Razorpay`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Package className="text-[#4a7c23] w-5 h-5" />
                Order Summary
              </h3>

              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-slate-50 p-3 rounded-xl gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => { e.target.src = '/placeholder.png'; }}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#4a7c23] flex-shrink-0">
                          ₹{(item.price * item.qty).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex justify-between text-slate-600 text-sm">
                      <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-sm">
                      <span>Shipping</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between text-slate-600 text-sm">
                      <span>Tax</span>
                      <span>Included</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-200">
                      <span>Total</span>
                      <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
