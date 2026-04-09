import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

/* ─── Constants ──────────────────────────────────────────────── */
const INDIAN_STATES = [
  'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar',
  'Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman & Diu','Delhi','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jammu & Kashmir','Jharkhand','Karnataka',
  'Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
  'Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
];

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

/* ─── Input styles helper ────────────────────────────────────── */
const inp = (hasError) => ({
  padding: '11px 14px',
  borderRadius: 10,
  fontSize: 14,
  width: '100%',
  boxSizing: 'border-box',
  border: hasError ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
  background: hasError ? '#fff5f5' : '#f8fafc',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border .15s',
});

/* ─── FIELD WRAPPER — defined OUTSIDE to keep stable reference ─ */
function FormField({ label, required, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
        {label}
        {required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 12, color: '#ef4444', margin: '2px 0 0' }}>{error}</p>}
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '',
    addressLine: '', landmark: '', city: '', state: '', pincode: '',
  });

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  // Load Razorpay SDK
  useEffect(() => {
    if (document.querySelector('script[src*="razorpay"]')) return;
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // Pre-fill from localStorage
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u.name) {
        setForm(p => ({
          ...p,
          fullName: u.name || '',
          email:    u.email || '',
          mobile:   (u.mobile || '').replace('+91', ''),
        }));
      }
    } catch { /* ignore */ }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())                             e.fullName    = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))         e.mobile      = 'Enter valid 10-digit mobile number';
    if (!form.addressLine.trim())                          e.addressLine = 'Address is required';
    if (!form.city.trim())                                 e.city        = 'City is required';
    if (!form.state)                                       e.state       = 'Select your state';
    if (!/^\d{6}$/.test(form.pincode.trim()))              e.pincode     = 'Enter valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openRealRazorpay = (order, key, dbId) => {
    if (!window.Razorpay) {
      alert('Razorpay is still loading. Please try again.');
      setLoading(false);
      return;
    }
    const options = {
      key,
      amount:      order.amount,
      currency:    order.currency || 'INR',
      name:        'Abhivriddhi Organics',
      description: 'Organic Products Purchase',
      order_id:    order.id,
      prefill: {
        name:    form.fullName,
        email:   form.email,
        contact: form.mobile.startsWith('+91') ? form.mobile : `+91${form.mobile}`,
      },
      notes: { address: form.addressLine, city: form.city, state: form.state, pincode: form.pincode },
      theme: { color: '#4a7c23' },
      config: {
        display: {
          blocks: {
            upi: {
              name: 'Pay using UPI',
              instruments: [{ method: 'upi' }]
            },
            cards: {
              name: 'Pay using Cards',
              instruments: [{ method: 'card' }]
            },
            banks: {
              name: 'Netbanking',
              instruments: [{ method: 'netbanking' }]
            }
          },
          sequence: ['block.upi', 'block.cards', 'block.banks'],
          preferences: { show_default_blocks: false }
        }
      },
      modal: { ondismiss: () => setLoading(false) },
      handler: async (response) => {
        setLoading(true);
        try {
          const res = await fetch(`${BASE_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_signature:  response.razorpay_signature,
              dbOrderId:           dbId,
            }),
          });
          const data = await res.json();
          if (data.success) {
            clearCart();
            setOrderId(dbId || response.razorpay_payment_id);
            setSuccess(true);
          } else {
            alert('Payment verification failed. Contact support.');
          }
        } catch {
          alert('Verification error. Contact support.');
        }
        setLoading(false);
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => { setLoading(false); alert('Payment failed. Please try again.'); });
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert('Your cart is empty!');
    if (!validate()) return;

    setLoading(true);
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id || null;
      const res = await fetch(`${BASE_URL}/payment/checkout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            fullName:    form.fullName.trim(),
            mobile:      form.mobile.trim().startsWith('+91') ? form.mobile.trim() : `+91${form.mobile.trim()}`,
            email:       form.email.trim(),
            addressLine: form.addressLine.trim(),  // ← matches Order schema
            landmark:    form.landmark.trim(),
            city:        form.city.trim(),
            state:       form.state,
            pincode:     form.pincode.trim(),
          },
          cartItems: cartItems.map(i => ({
            productId: String(i.id), name: i.name, price: i.price, quantity: i.qty, image: i.img || '',
          })),
          totalAmount: total,
          userId,
        }),
      });
      const data = await res.json();

      if (data.success) {
        const key = data.key_id || '';
        openRealRazorpay(data.order, key, data.dbOrderId);
      } else {
        alert(data.message || 'Could not create order. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Network error when contacting checkout API. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  /* ── Success screen ── */
  if (success) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#f8fafc)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 28, boxShadow: '0 20px 60px rgba(0,0,0,.1)', padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
        {/* Animated checkmark */}
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg,#4a7c23,#6ab04c)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: 44, boxShadow: '0 8px 32px rgba(74,124,35,.3)' }}>✅</div>

        <h2 style={{ fontSize: 30, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Order Placed! 🎉</h2>
        <p style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 8 }}>
          Order ID: <strong style={{ color: '#4a7c23' }}>{String(orderId).slice(-8).toUpperCase()}</strong>
        </p>
        <p style={{ color: '#64748b', marginBottom: 8, lineHeight: 1.6, fontSize: 14 }}>
          Thank you for shopping with <strong>Abhivriddhi Organics</strong>.<br />Your order is confirmed and will be shipped soon.
        </p>
        {form.email && (
          <p style={{ fontSize: 13, color: '#4a7c23', background: '#f0fdf4', borderRadius: 10, padding: '10px 16px', marginBottom: 24 }}>
            📧 Invoice sent to <strong>{form.email}</strong>
          </p>
        )}

        {/* Download Invoice */}
        <a
          href={`${BASE_URL}/payment/invoice/${orderId}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', padding: 14, background: '#4a7c23', color: '#fff',
            border: 'none', borderRadius: 14, fontWeight: 700, fontSize: 15,
            cursor: 'pointer', marginBottom: 12, textDecoration: 'none',
            boxSizing: 'border-box'
          }}
        >
          ⬇️ Download Invoice PDF
        </a>

        <button
          onClick={() => navigate('/products')}
          style={{ width: '100%', padding: 14, background: 'transparent', color: '#4a7c23', border: '2px solid #4a7c23', borderRadius: 14, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 10 }}
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ width: '100%', padding: 14, background: 'transparent', color: '#64748b', border: '2px solid #e2e8f0', borderRadius: 14, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
        >
          Track My Orders
        </button>
      </div>
    </div>
  );


  /* ── Main page ── */
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* Top bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 8px rgba(0,0,0,.05)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '6px 14px', cursor: 'pointer', color: '#374151', fontWeight: 600, fontSize: 14 }}>
          ← Back
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1e293b' }}>Shipping & Payment</h1>
          <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Fill your details to place the order</p>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#4a7c23', fontWeight: 600 }}>🔒 100% Secure</div>
      </div>

      {/* Body — two column */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 28, alignItems: 'start' }}>

        {/* ── LEFT: Form ── */}
        <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,.06)', overflow: 'hidden' }}>

          {/* Step header */}
          <div style={{ background: 'linear-gradient(135deg,#4a7c23,#6ab04c)', padding: '20px 28px', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-around' }}>
            {['📦 Cart', '📍 Shipping', '💳 Payment'].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                {i > 0 && <div style={{ flex: 1, height: 2, background: i <= 1 ? '#fff' : 'rgba(255,255,255,.3)' }} />}
                <span style={{ color: i <= 1 ? '#fff' : 'rgba(255,255,255,.5)', fontSize: 13, fontWeight: i === 1 ? 800 : 500, whiteSpace: 'nowrap' }}>{step}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ padding: '28px 28px 32px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', marginBottom: 20 }}>📍 Delivery Address</h2>

            {/* Row 1: Name & Mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <FormField label="Full Name" required error={errors.fullName}>
                <input
                  name="fullName" value={form.fullName} onChange={onChange}
                  placeholder="Recipient's full name"
                  style={inp(errors.fullName)}
                  onFocus={e => e.target.style.border = '1.5px solid #4a7c23'}
                  onBlur={e => e.target.style.border = errors.fullName ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0'}
                />
              </FormField>

              <FormField label="Mobile Number" required error={errors.mobile}>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#374151', fontWeight: 600, pointerEvents: 'none' }}>+91</span>
                  <input
                    type="tel" name="mobile" value={form.mobile} onChange={onChange}
                    maxLength={10} placeholder="9876543210"
                    style={{ ...inp(errors.mobile), paddingLeft: 48 }}
                    onFocus={e => e.target.style.border = '1.5px solid #4a7c23'}
                    onBlur={e => e.target.style.border = errors.mobile ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0'}
                  />
                </div>
              </FormField>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <FormField label="Email (for order confirmation)" error={errors.email}>
                <input
                  type="email" name="email" value={form.email} onChange={onChange}
                  placeholder="you@example.com"
                  style={inp(false)}
                  onFocus={e => e.target.style.border = '1.5px solid #4a7c23'}
                  onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
                />
              </FormField>
            </div>

            {/* Address */}
            <div style={{ marginBottom: 16 }}>
              <FormField label="Address / Flat / Street" required error={errors.addressLine}>
                <textarea
                  name="addressLine" value={form.addressLine} onChange={onChange}
                  rows={2} placeholder="House No., Building, Street, Area"
                  style={{ ...inp(errors.addressLine), resize: 'none' }}
                  onFocus={e => e.target.style.border = '1.5px solid #4a7c23'}
                  onBlur={e => e.target.style.border = errors.addressLine ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0'}
                />
              </FormField>
            </div>

            {/* Landmark */}
            <div style={{ marginBottom: 16 }}>
              <FormField label="Landmark (optional)">
                <input
                  name="landmark" value={form.landmark} onChange={onChange}
                  placeholder="Near school, temple, etc."
                  style={inp(false)}
                  onFocus={e => e.target.style.border = '1.5px solid #4a7c23'}
                  onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
                />
              </FormField>
            </div>

            {/* City / State / Pincode */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
              <FormField label="City" required error={errors.city}>
                <input
                  name="city" value={form.city} onChange={onChange}
                  placeholder="Mumbai"
                  style={inp(errors.city)}
                  onFocus={e => e.target.style.border = '1.5px solid #4a7c23'}
                  onBlur={e => e.target.style.border = errors.city ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0'}
                />
              </FormField>

              <FormField label="State" required error={errors.state}>
                <select
                  name="state" value={form.state} onChange={onChange}
                  style={{ ...inp(errors.state), cursor: 'pointer' }}
                  onFocus={e => e.target.style.border = '1.5px solid #4a7c23'}
                  onBlur={e => e.target.style.border = errors.state ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0'}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>

              <FormField label="Pincode" required error={errors.pincode}>
                <input
                  name="pincode" value={form.pincode} onChange={onChange}
                  maxLength={6} placeholder="400001"
                  style={inp(errors.pincode)}
                  onFocus={e => e.target.style.border = '1.5px solid #4a7c23'}
                  onBlur={e => e.target.style.border = errors.pincode ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0'}
                />
              </FormField>
            </div>

            {/* Security badge */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
              <p style={{ margin: 0, fontSize: 13, color: '#166534', lineHeight: 1.6 }}>
                Your payment is processed securely via <strong>Razorpay</strong>. We never store your card details.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || cartItems.length === 0}
              style={{
                width: '100%', padding: '16px',
                background: loading ? '#86a96a' : '#4a7c23',
                color: '#fff', border: 'none', borderRadius: 14, fontWeight: 800, fontSize: 16,
                cursor: loading || cartItems.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(74,124,35,.35)',
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'rzp-spin .8s linear infinite' }} />
                  Processing…
                </>
              ) : (
                `💳 Proceed to Pay ₹${total.toLocaleString('en-IN')}`
              )}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Order Summary ── */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,.06)', padding: 24 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1e293b', marginBottom: 18 }}>🛍️ Order Summary</h3>

            {cartItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
                <p style={{ margin: 0, fontSize: 14 }}>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto', marginBottom: 18 }}>
                  {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', borderRadius: 12, padding: '10px 12px' }}>
                      <img src={item.img} alt={item.name} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} onError={e => { e.target.src = '/placeholder.png'; }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                        <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>Qty: {item.qty}</p>
                      </div>
                      <span style={{ fontWeight: 800, color: '#4a7c23', fontSize: 14, flexShrink: 0 }}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                    <span>Shipping</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#64748b' }}>
                    <span>Tax</span><span>Included</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#1e293b', paddingTop: 12, borderTop: '2px solid #f1f5f9' }}>
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['✅ 100% Organic & Natural', '🚚 Free Shipping on all orders', '🔄 Easy 7-day returns'].map((b, i) => (
                    <p key={i} style={{ margin: 0, fontSize: 13, color: '#374151' }}>{b}</p>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes rzp-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
