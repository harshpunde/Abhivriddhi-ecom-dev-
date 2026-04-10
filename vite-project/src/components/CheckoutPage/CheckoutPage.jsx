import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar',
  'Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman & Diu','Delhi','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jammu & Kashmir','Jharkhand','Karnataka',
  'Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya',
  'Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
];

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

/* ─── Styles ──── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  @keyframes rzp-spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse-ring { 0%,100% { box-shadow: 0 0 0 0 rgba(74,124,35,0.3); } 50% { box-shadow: 0 0 0 10px rgba(74,124,35,0); } }
  @keyframes checkmark { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }

  *, *::before, *::after { box-sizing: border-box; }

  .co-page { min-height:100vh; background: linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #f0f7ff 100%); font-family:'Inter',system-ui,sans-serif; }

  /* Header */
  .co-header { background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(74,124,35,0.1); padding: 0 24px; height: 64px; display: flex; align-items: center; gap: 16px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 20px rgba(0,0,0,0.06); }
  .co-logo { display:flex; align-items:center; gap:8px; font-weight:900; font-size:18px; color:#1a3d0c; text-decoration:none; border:none; background:none; cursor:pointer; }
  .co-logo span { color:#4a7c23; }
  .co-back-btn { display:flex; align-items:center; gap:6px; background:none; border:1.5px solid #e2e8f0; border-radius:10px; padding:8px 14px; cursor:pointer; color:#374151; font-weight:600; font-size:13px; transition:all .2s; }
  .co-back-btn:hover { border-color:#4a7c23; color:#4a7c23; background:#f0fdf4; }
  .co-steps { display:flex; align-items:center; gap:0; }
  .co-step { display:flex; align-items:center; gap:6px; font-size:13px; font-weight:600; color:#94a3b8; }
  .co-step.active { color:#4a7c23; }
  .co-step.done { color:#16a34a; }
  .co-step-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; background:#e2e8f0; color:#94a3b8; transition:all .3s; }
  .co-step.active .co-step-dot { background:#4a7c23; color:#fff; box-shadow:0 4px 12px rgba(74,124,35,0.4); animation: pulse-ring 2s ease-in-out infinite; }
  .co-step.done .co-step-dot { background:#16a34a; color:#fff; }
  .co-step-line { width:40px; height:2px; background:#e2e8f0; margin:0 4px; }
  .co-step-line.done { background:#16a34a; }
  .co-secure { margin-left:auto; display:flex; align-items:center; gap:6px; font-size:13px; color:#4a7c23; font-weight:700; background:#f0fdf4; border:1px solid #bbf7d0; padding:6px 14px; border-radius:999px; }

  /* Main grid */
  .co-grid { max-width:1100px; margin:0 auto; padding:32px 24px; display:grid; grid-template-columns:minmax(0,1.55fr) minmax(0,1fr); gap:28px; align-items:start; animation:fadeUp .5s ease both; }

  /* Form card */
  .co-card { background:#fff; border-radius:24px; box-shadow:0 4px 32px rgba(0,0,0,0.07); overflow:hidden; }
  .co-card-header { background:linear-gradient(135deg,#1a3d0c 0%,#4a7c23 60%,#6ab04c 100%); padding:22px 28px; }
  .co-card-header h2 { margin:0; color:#fff; font-size:18px; font-weight:800; letter-spacing:-0.3px; }
  .co-card-header p { margin:4px 0 0; color:rgba(255,255,255,0.7); font-size:13px; }
  .co-form-body { padding:28px; }

  /* Inputs */
  .co-label { font-size:13px; font-weight:600; color:#374151; display:block; margin-bottom:6px; }
  .co-req { color:#ef4444; margin-left:2px; }
  .co-input { width:100%; padding:12px 16px; border-radius:12px; font-size:14px; border:2px solid #e2e8f0; background:#f8fafc; outline:none; font-family:inherit; transition:all .2s; color:#1e293b; }
  .co-input:focus { border-color:#4a7c23; background:#fff; box-shadow:0 0 0 4px rgba(74,124,35,0.08); }
  .co-input.err { border-color:#ef4444; background:#fff5f5; }
  .co-input.err:focus { box-shadow:0 0 0 4px rgba(239,68,68,0.08); }
  .co-input-wrap { position:relative; }
  .co-prefix { position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:14px; font-weight:700; color:#4a7c23; pointer-events:none; }
  .co-prefix-input { padding-left:52px !important; }
  .co-err-msg { font-size:12px; color:#ef4444; margin-top:4px; display:flex; align-items:center; gap:4px; }
  .co-field { display:flex; flex-direction:column; }

  /* Row grids */
  .co-row2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; }
  .co-row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; margin-bottom:20px; }
  .co-row1 { margin-bottom:20px; }

  /* Section divider */
  .co-section-title { display:flex; align-items:center; gap:10px; font-size:15px; font-weight:800; color:#1e293b; margin:0 0 20px; }
  .co-section-title::after { content:''; flex:1; height:1px; background:linear-gradient(to right,#e2e8f0,transparent); }

  /* Security badge */
  .co-security { background:linear-gradient(135deg,#f0fdf4,#f7fee7); border:1.5px solid #bbf7d0; border-radius:16px; padding:14px 18px; display:flex; align-items:center; gap:12px; margin-bottom:24px; }
  .co-security p { margin:0; font-size:13px; color:#166534; line-height:1.5; }

  /* Submit Button */
  .co-submit { width:100%; padding:17px; background:linear-gradient(135deg,#1a3d0c,#4a7c23); color:#fff; border:none; border-radius:16px; font-weight:800; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow:0 8px 24px rgba(74,124,35,0.35); transition:all .2s; letter-spacing:-0.2px; }
  .co-submit:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 12px 32px rgba(74,124,35,0.45); background:linear-gradient(135deg,#0f2407,#3d6a1c); }
  .co-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .co-spinner { width:20px; height:20px; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:rzp-spin .8s linear infinite; }

  /* Summary card */
  .co-summary { background:#fff; border-radius:24px; box-shadow:0 4px 32px rgba(0,0,0,0.07); overflow:hidden; position:sticky; top:80px; }
  .co-summary-header { background:linear-gradient(135deg,#1a3d0c 0%,#4a7c23 100%); padding:18px 22px; display:flex; align-items:center; gap:8px; }
  .co-summary-header h3 { margin:0; color:#fff; font-size:16px; font-weight:800; }
  .co-summary-body { padding:20px; }
  .co-cart-item { display:flex; align-items:center; gap:12px; padding:12px; background:#f8fafc; border-radius:14px; margin-bottom:10px; border:1px solid #f1f5f9; transition:all .2s; }
  .co-cart-item:hover { border-color:#d1fae5; background:#f0fdf4; }
  .co-cart-img { width:54px; height:54px; object-fit:cover; border-radius:10px; flex-shrink:0; }
  .co-cart-name { margin:0; font-weight:700; font-size:13px; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .co-cart-qty { margin:0; font-size:12px; color:#64748b; margin-top:2px; }
  .co-cart-price { font-weight:800; color:#4a7c23; font-size:14px; flex-shrink:0; margin-left:auto; }
  .co-divider { border:none; border-top:2px dashed #f1f5f9; margin:16px 0; }
  .co-total-row { display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#64748b; margin-bottom:8px; }
  .co-total-row.grand { font-size:17px; font-weight:800; color:#1e293b; margin-top:12px; padding-top:12px; border-top:2px solid #f1f5f9; }
  .co-badge-green { color:#16a34a; font-weight:700; }
  .co-perks { display:flex; flex-direction:column; gap:8px; margin-top:18px; padding:14px; background:#f0fdf4; border-radius:14px; border:1px solid #d1fae5; }
  .co-perk { font-size:13px; color:#166534; display:flex; align-items:center; gap:8px; }

  /* Success screen */
  .co-success { min-height:100vh; background:linear-gradient(135deg,#f0fdf4,#f8fafc); display:flex; align-items:center; justify-content:center; padding:24px; }
  .co-success-card { background:#fff; border-radius:32px; box-shadow:0 20px 80px rgba(0,0,0,0.1); padding:52px 44px; max-width:480px; width:100%; text-align:center; animation:fadeUp .6s ease both; }
  .co-check-ring { width:100px; height:100px; border-radius:50%; background:linear-gradient(135deg,#4a7c23,#6ab04c); display:flex; align-items:center; justify-content:center; margin:0 auto 28px; font-size:46px; box-shadow:0 12px 40px rgba(74,124,35,0.35); animation:pulse-ring 2s ease-in-out 3; }
  .co-success h2 { font-size:32px; font-weight:900; color:#1e293b; margin-bottom:6px; }
  .co-order-id { font-size:13px; color:#94a3b8; font-family:monospace; margin-bottom:16px; }
  .co-order-id strong { color:#4a7c23; font-size:15px; }
  .co-success-msg { color:#64748b; margin-bottom:12px; line-height:1.7; font-size:14px; }
  .co-email-notice { font-size:13px; color:#4a7c23; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:12px 18px; margin-bottom:24px; }
  .co-success-btn { width:100%; padding:15px; border-radius:16px; font-weight:700; font-size:15px; cursor:pointer; margin-bottom:10px; transition:all .2s; }
  .co-success-btn.primary { background:linear-gradient(135deg,#1a3d0c,#4a7c23); color:#fff; border:none; box-shadow:0 6px 20px rgba(74,124,35,0.3); }
  .co-success-btn.primary:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(74,124,35,0.4); }
  .co-success-btn.outline { background:transparent; color:#4a7c23; border:2px solid #4a7c23; }
  .co-success-btn.outline:hover { background:#f0fdf4; }
  .co-success-btn.ghost { background:transparent; color:#94a3b8; border:2px solid #e2e8f0; }
  .co-invoice-link { display:flex; align-items:center; justify-content:center; gap:8px; width:100%; padding:15px; background:linear-gradient(135deg,#1a3d0c,#4a7c23); color:#fff; border:none; border-radius:16px; font-weight:700; font-size:15px; cursor:pointer; margin-bottom:10px; text-decoration:none; box-shadow:0 6px 20px rgba(74,124,35,0.3); transition:all .2s; }
  .co-invoice-link:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(74,124,35,0.4); }

  /* Empty cart */
  .co-empty { text-align:center; padding:40px 20px; }
  .co-empty-icon { font-size:48px; margin-bottom:12px; }
  .co-empty p { margin:0; font-size:14px; color:#94a3b8; }

  /* Mobile */
  @media (max-width:700px) {
    .co-grid { grid-template-columns:1fr !important; padding:16px 14px !important; gap:16px; }
    .co-row2 { grid-template-columns:1fr !important; }
    .co-row3 { grid-template-columns:1fr !important; }
    .co-form-body { padding:20px 18px !important; }
    .co-steps { display:none !important; }
    .co-secure { display:none !important; }
    .co-summary { position:static !important; }
    .co-success-card { padding:36px 24px !important; }
    .co-card-header { padding:18px 20px !important; }
  }
`;

function FormField({ label, required, error, children }) {
  return (
    <div className="co-field">
      <label className="co-label">
        {label}{required && <span className="co-req">*</span>}
      </label>
      {children}
      {error && <p className="co-err-msg">⚠ {error}</p>}
    </div>
  );
}

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

  useEffect(() => {
    if (document.querySelector('script[src*="razorpay"]')) return;
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u.name) {
        setForm(p => ({
          ...p,
          fullName: u.name || '',
          email: u.email || '',
          mobile: (u.mobile || '').replace('+91', ''),
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
    if (!form.fullName.trim())                        e.fullName    = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim()))    e.mobile      = 'Enter valid 10-digit mobile';
    if (!form.addressLine.trim())                     e.addressLine = 'Address is required';
    if (!form.city.trim())                            e.city        = 'City is required';
    if (!form.state)                                  e.state       = 'Select your state';
    if (!/^\d{6}$/.test(form.pincode.trim()))         e.pincode     = 'Enter valid 6-digit pincode';
    if (!form.email.trim())                            e.email       = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openRazorpay = (order, key, dbId) => {
    if (!window.Razorpay) { alert('Razorpay is still loading. Try again.'); setLoading(false); return; }
    const options = {
      key, amount: order.amount, currency: order.currency || 'INR',
      name: 'Abhivriddhi Organics', description: 'Organic Products Purchase',
      order_id: order.id,
      prefill: { name: form.fullName, email: form.email, contact: form.mobile.startsWith('+91') ? form.mobile : `+91${form.mobile}` },
      notes: { address: form.addressLine, city: form.city, state: form.state },
      theme: { color: '#4a7c23' },
      modal: { ondismiss: () => setLoading(false) },
      handler: async (response) => {
        setLoading(true);
        try {
          const res = await fetch(`${BASE_URL}/payment/verify`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: dbId,
            }),
          });
          const data = await res.json();
          if (data.success) { clearCart(); setOrderId(dbId || response.razorpay_payment_id); setSuccess(true); }
          else alert('Payment verification failed. Contact support.');
        } catch { alert('Verification error. Contact support.'); }
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: {
            fullName: form.fullName.trim(),
            mobile: form.mobile.trim().startsWith('+91') ? form.mobile.trim() : `+91${form.mobile.trim()}`,
            email: form.email.trim(), addressLine: form.addressLine.trim(),
            landmark: form.landmark.trim(), city: form.city.trim(),
            state: form.state, pincode: form.pincode.trim(),
          },
          cartItems: cartItems.map(i => ({ productId: String(i.id), name: i.name, price: i.price, quantity: i.qty, image: i.img || '' })),
          totalAmount: total, userId,
        }),
      });
      const data = await res.json();
      if (data.success) { openRazorpay(data.order, data.key_id || '', data.dbOrderId); }
      else { alert(data.message || 'Could not create order. Please try again.'); setLoading(false); }
    } catch (err) {
      console.error(err);
      alert('Network error. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  /* ─── Success screen ─── */
  if (success) return (
    <div className="co-success">
      <style>{CSS}</style>
      <div className="co-success-card">
        <div className="co-check-ring">✅</div>
        <h2>Order Placed! 🎉</h2>
        <p className="co-order-id">Order ID: <strong>#{String(orderId).slice(-8).toUpperCase()}</strong></p>
        <p className="co-success-msg">
          Thank you for shopping with <strong>Abhivriddhi Organics</strong>.<br />
          Your organic products will be shipped soon.
        </p>
        {form.email && (
          <p className="co-email-notice">📧 Invoice sent to <strong>{form.email}</strong></p>
        )}
        <a href={`${BASE_URL}/payment/invoice/${orderId}`} target="_blank" rel="noreferrer" className="co-invoice-link">
          ⬇️ Download Invoice
        </a>
        <button onClick={() => navigate('/products')} className="co-success-btn outline">Continue Shopping</button>
        <button onClick={() => navigate('/dashboard')} className="co-success-btn ghost">Track My Orders</button>
      </div>
    </div>
  );

  /* ─── Main page ─── */
  return (
    <div className="co-page">
      <style>{CSS}</style>

      {/* Header */}
      <header className="co-header">
        <button className="co-logo" onClick={() => navigate('/')}>
          🌱 <span>Abhivriddhi</span> Organics
        </button>
        <div style={{ width: 1, height: 32, background: '#e2e8f0', margin: '0 4px' }} />

        {/* Step indicator */}
        <div className="co-steps">
          {[
            { label: 'Cart', icon: '🛒', state: 'done' },
            { label: 'Shipping', icon: '📍', state: 'active' },
            { label: 'Payment', icon: '💳', state: '' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <div className={`co-step-line ${step.state === 'active' ? 'done' : ''}`} />}
              <div className={`co-step ${step.state}`}>
                <div className="co-step-dot">{step.state === 'done' ? '✓' : i + 1}</div>
                <span>{step.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="co-secure">🔒 Secured by Razorpay</div>
        <button onClick={() => navigate(-1)} className="co-back-btn" style={{ marginLeft: 12 }}>← Back</button>
      </header>

      {/* Body */}
      <div className="co-grid">

        {/* LEFT: Form */}
        <div className="co-card">
          <div className="co-card-header">
            <h2>📍 Delivery Address</h2>
            <p>We deliver across India — fill in the details below</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="co-form-body">
            <p className="co-section-title">Personal Information</p>

            <div className="co-row2">
              <FormField label="Full Name" required error={errors.fullName}>
                <input className={`co-input ${errors.fullName ? 'err' : ''}`} name="fullName" value={form.fullName} onChange={onChange} placeholder="Recipient's full name" />
              </FormField>

              <FormField label="Mobile Number" required error={errors.mobile}>
                <div className="co-input-wrap">
                  <span className="co-prefix">+91</span>
                  <input className={`co-input co-prefix-input ${errors.mobile ? 'err' : ''}`} type="tel" name="mobile" value={form.mobile} onChange={onChange} maxLength={10} placeholder="9876543210" />
                </div>
              </FormField>
            </div>

            <div className="co-row1">
              <FormField label="Email Address (for invoice & updates)" required error={errors.email}>
                <input className={`co-input ${errors.email ? 'err' : ''}`} type="email" name="email" value={form.email} onChange={onChange} placeholder="priyanshu@gmail.com" />
              </FormField>
            </div>

            <p className="co-section-title" style={{ marginTop: 8 }}>Delivery Address</p>

            <div className="co-row1">
              <FormField label="Address / Flat / Street" required error={errors.addressLine}>
                <textarea className={`co-input ${errors.addressLine ? 'err' : ''}`} name="addressLine" value={form.addressLine} onChange={onChange} rows={2} placeholder="House No., Building, Street, Area, Colony" style={{ resize: 'none' }} />
              </FormField>
            </div>

            <div className="co-row1">
              <FormField label="Landmark (optional)">
                <input className="co-input" name="landmark" value={form.landmark} onChange={onChange} placeholder="Near school, temple, market..." />
              </FormField>
            </div>

            <div className="co-row3">
              <FormField label="City" required error={errors.city}>
                <input className={`co-input ${errors.city ? 'err' : ''}`} name="city" value={form.city} onChange={onChange} placeholder="Mumbai" />
              </FormField>

              <FormField label="State" required error={errors.state}>
                <select className={`co-input ${errors.state ? 'err' : ''}`} name="state" value={form.state} onChange={onChange}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>

              <FormField label="Pincode" required error={errors.pincode}>
                <input className={`co-input ${errors.pincode ? 'err' : ''}`} name="pincode" value={form.pincode} onChange={onChange} maxLength={6} placeholder="400001" />
              </FormField>
            </div>

            {/* Security note */}
            <div className="co-security">
              <span style={{ fontSize: 22 }}>🔐</span>
              <p>Your payment is processed securely via <strong>Razorpay</strong>. We never store your card details. SSL encrypted.</p>
            </div>

            {/* Amount preview */}
            <div style={{ background: 'linear-gradient(135deg,#f0fdf4,#f7fee7)', border: '2px solid #bbf7d0', borderRadius: 16, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}>Total Amount</span>
              <span style={{ fontSize: 22, fontWeight: 900, color: '#1a3d0c' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>

            <button type="submit" disabled={loading || cartItems.length === 0} className="co-submit">
              {loading ? (
                <><div className="co-spinner" /> Processing Payment…</>
              ) : (
                `💳 Pay ₹${total.toLocaleString('en-IN')} Securely`
              )}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 14 }}>
              By placing this order, you agree to our <a href="/terms" style={{ color: '#4a7c23' }}>Terms & Conditions</a>
            </p>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="co-summary">
          <div className="co-summary-header">
            <span style={{ fontSize: 18 }}>🛍️</span>
            <h3>Order Summary ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</h3>
          </div>

          <div className="co-summary-body">
            {cartItems.length === 0 ? (
              <div className="co-empty">
                <div className="co-empty-icon">🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 4 }}>
                  {cartItems.map(item => (
                    <div key={item.id} className="co-cart-item">
                      <img src={item.img} alt={item.name} className="co-cart-img" onError={e => { e.target.src = '/placeholder.png'; }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="co-cart-name">{item.name}</p>
                        <p className="co-cart-qty">Qty: {item.qty} {item.weight ? `· ${item.weight}` : ''}</p>
                      </div>
                      <span className="co-cart-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <hr className="co-divider" />

                <div className="co-total-row"><span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                <div className="co-total-row"><span>Shipping</span><span className="co-badge-green">FREE ✈</span></div>
                <div className="co-total-row"><span>GST & Taxes</span><span>Included</span></div>
                <div className="co-total-row grand"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>

                <div className="co-perks">
                  <div className="co-perk">✅ 100% Organic & Chemical Free</div>
                  <div className="co-perk">🚚 Free Shipping on all orders</div>
                  <div className="co-perk">🔄 7-day hassle-free returns</div>
                  <div className="co-perk">📦 Delivered in eco-friendly packaging</div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
