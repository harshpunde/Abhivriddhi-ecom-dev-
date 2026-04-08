import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { createOrder, verifyPayment } from '../../services/api';
import { CheckCircle, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  });

  const totalAmount = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const displayRazorpay = async (orderData, key_id, dbOrderId) => {
    const options = {
      key: key_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Abhivriddhi Organics",
      description: "Organic Products Purchase",
      order_id: orderData.id,
      handler: async function (response) {
        setLoading(true);
        try {
          const verifyRes = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            dbOrderId
          });
          if (verifyRes.success) {
            setSuccess(true);
          } else {
            alert("Payment Verification Failed!");
          }
        } catch (err) {
          console.error(err);
          alert("Payment Verification Error. Please contact support.");
        }
        setLoading(false);
      },
      prefill: {
        name: formData.fullName,
        contact: formData.mobile,
      },
      theme: { color: "#4a7c23" },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on('payment.failed', function (response) {
      alert("Payment failed: " + response.error.description);
    });
    paymentObject.open();
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      return alert("Your cart is empty!");
    }
    
    // Simple validation (can be more robust)
    if (!formData.fullName || !formData.mobile || !formData.addressLine || !formData.city || !formData.pincode) {
      return alert("Please fill all required shipping details.");
    }

    setLoading(true);
    try {
      const payload = {
        shippingAddress: formData,
        cartItems: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.img
        })),
        totalAmount
      };

      const res = await createOrder(payload);
      if (res.success) {
        displayRazorpay(res.order, res.key_id, res.dbOrderId);
      } else {
        alert("Failed to initialize checkout. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while initiating checkout.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 mt-16 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Order Successful!</h2>
          <p className="text-slate-600 mb-8">Thank you for shopping with Abhivriddhi Organics. Your order is being processed.</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-[#4a7c23] text-white py-3 rounded-xl font-semibold hover:bg-[#3d6a1c] transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Shipping Form */}
        <div className="lg:w-2/3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-[#4a7c23]" /> Secure Checkout
          </h2>
          <form className="space-y-6" onSubmit={handleCheckout}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#4a7c23] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Number</label>
                <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#4a7c23] outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address / Flat / Street</label>
              <input required type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#4a7c23] outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#4a7c23] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#4a7c23] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pincode</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#4a7c23] outline-none" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || cartItems.length === 0}
              className="w-full mt-8 bg-[#4a7c23] text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:bg-[#3d6a1c] transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Pay with Razorpay'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#4a7c23]">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
