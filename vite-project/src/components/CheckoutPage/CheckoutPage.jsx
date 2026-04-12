import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman & Diu', 'Delhi', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand', 'Karnataka',
  'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

/* ─── Styles ──── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  @keyframes rzp-spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }

  *, *::before, *::after { box-sizing: border-box; }

  .co-page { min-height:100vh; background: linear-gradient(135deg, #f4fdf8 0%, #f8fafc 100%); font-family:'Inter',system-ui,sans-serif; padding-bottom: 40px; }

  /* Header */
  .co-header { background: rgba(255,255,255,0.95); backdrop-filter:blur(8px); border-bottom: 1px solid rgba(74,124,35,0.1); padding: 0 40px; height: 72px; display: flex; align-items: center; justify-content: flex-start; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
  .co-logo { display:flex; align-items:center; gap:8px; font-weight:800; font-size:20px; color:#1a3d0c; text-decoration:none; border:none; background:none; cursor:pointer; }
  .co-logo span { color:#4a7c23; }
  .hd-divider { width: 1px; height: 32px; background: #e2e8f0; margin: 0 20px; }
  .co-back-btn { margin-left:auto; display:flex; align-items:center; background:#fff; border:1px solid #e2e8f0; padding:8px 16px; border-radius:8px; cursor:pointer; color:#4a7c23; font-weight:700; font-size:13px; transition:all .2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
  .co-back-btn:hover { background:#f0fdf4; border-color:#bbf7d0; transform:translateY(-1px); }
  
  .co-steps { display:flex; align-items:center; gap:0; }
  .co-step { display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; }
  .co-step.active { color:#4a7c23; }
  .co-step.done { color:#4a7c23; }
  .co-step-dot { width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; background:#f1f5f9; color:#94a3b8; }
  .co-step.active .co-step-dot { background:linear-gradient(135deg,#4a7c23,#6ab04c); color:#fff; box-shadow: 0 2px 8px rgba(74,124,35,0.3); }
  .co-step.done .co-step-dot { background:#4a7c23; color:#fff; }
  .co-step-line { width:30px; height:2px; background:#f1f5f9; margin:0 12px; }
  .co-step-line.done { background:#4a7c23; }
  
  .co-secure { margin-left:24px; display:flex; align-items:center; gap:6px; font-size:12px; color:#166534; font-weight:600; background:#f0fdf4; padding:6px 12px; border-radius:100px; border:1px solid #bbf7d0; }

  /* Main grid */
  .co-grid { max-width:1150px; margin:0 auto; padding:40px 20px; display:grid; grid-template-columns:1.8fr 1fr; gap:32px; align-items:start; animation:fadeUp .4s ease both; }

  /* Form card */
  .co-card { background:#fff; border-radius:18px; box-shadow:0 8px 32px rgba(74,124,35,0.06); border:1px solid rgba(74,124,35,0.1); overflow:hidden; }
  .co-card-header { background:rgba(240,253,244,0.5); border-bottom:1px solid rgba(74,124,35,0.1); padding:20px 28px; display:flex; align-items:center; gap:12px; }
  .co-card-header .step-num { background:linear-gradient(135deg,#1a3d0c,#4a7c23); color:#fff; font-size:13px; font-weight:700; width:26px; height:26px; display:flex; align-items:center; justify-content:center; border-radius:8px; box-shadow: 0 2px 6px rgba(74,124,35,0.3); }
  .co-card-header h2 { margin:0; color:#1a3d0c; font-size:17px; font-weight:800; }
  .co-form-body { padding:32px; }

  /* Inputs */
  .co-label { font-size:13px; font-weight:700; color:#475569; display:block; margin-bottom:8px; }
  .co-req { color:#ef4444; margin-left:2px; }
  .co-input { width:100%; padding:14px 18px; border-radius:10px; font-size:15px; border:2px solid #e2e8f0; background:#f8fafc; outline:none; font-family:inherit; transition:all 0.2s; color:#1e293b; font-weight:500; }
  .co-input:focus { border-color:#4a7c23; background:#fff; box-shadow:0 0 0 4px rgba(74,124,35,0.08); }
  .co-input.err { border-color:#ef4444; background:#fef2f2; }
  .co-input.err:focus { border-color:#ef4444; box-shadow:0 0 0 4px rgba(239,68,68,0.1); }
  .co-input-wrap { position:relative; }
  .co-prefix { position:absolute; left:16px; top:50%; transform:translateY(-50%); font-size:15px; font-weight:700; color:#4a7c23; pointer-events:none; }
  .co-prefix-input { padding-left:56px !important; }
  .co-err-msg { font-size:12px; color:#ef4444; margin-top:6px; display:flex; align-items:center; gap:4px; font-weight:600; }
  .co-field { display:flex; flex-direction:column; }
  
  /* Location Button Redesign (App Style) */
  .co-geo-btn { background:#1a3d0c; color:#fff; border:none; padding:16px; border-radius:12px; font-weight:700; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; width:100%; margin-bottom:28px; transition:all 0.2s; box-shadow: 0 4px 14px rgba(26,61,12,0.25); }
  .co-geo-btn:hover { background:#2C7700; transform:translateY(-1px); box-shadow: 0 6px 18px rgba(44,119,0,0.35); }
  .co-geo-btn svg { width:18px; height:18px; fill:none; stroke:#fff; stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; }
  .spin-small { width:18px; height:18px; border:2.5px solid rgba(255,255,255,0.3); border-top-color:#fff; border-radius:50%; animation:rzp-spin .8s linear infinite; }
  .pin-status-icon { position:absolute; right:16px; top:50%; transform:translateY(-50%); display:flex; align-items:center; }
  .co-input-with-icon { padding-right: 44px !important; }

  /* Row grids */
  .co-row2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
  .co-row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; margin-bottom:20px; }
  .co-row1 { margin-bottom:20px; }

  /* Section divider */
  .co-section-title { font-size:15px; font-weight:800; color:#1e293b; margin:36px 0 20px; display:flex; align-items:center; gap:8px; }
  .co-section-title::after { content:''; flex:1; height:2px; background:#f1f5f9; border-radius:2px; }

  /* Submit Button */
  .co-submit { width:280px; padding:18px; background:linear-gradient(135deg, #2C7700, #4a7c23); color:#fff; border:none; border-radius:12px; font-weight:800; font-size:16px; text-transform:uppercase; letter-spacing:0.5px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; transition:all 0.2s; box-shadow:0 6px 16px rgba(74,124,35,0.25); }
  .co-submit:hover:not(:disabled) { box-shadow:0 8px 24px rgba(74,124,35,0.35); transform:translateY(-2px); }
  .co-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .co-spinner { width:20px; height:20px; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:rzp-spin .8s linear infinite; }

  /* Summary card */
  .co-summary { background:#fff; border-radius:18px; box-shadow:0 8px 32px rgba(74,124,35,0.06); border:1px solid rgba(74,124,35,0.1); overflow:hidden; position:sticky; top:100px; }
  .co-summary-header { background:rgba(240,253,244,0.5); border-bottom:1px solid rgba(74,124,35,0.1); padding:20px 24px; }
  .co-summary-header h3 { margin:0; color:#1a3d0c; font-size:17px; font-weight:800; }
  .co-summary-body { padding:0; }
  .co-cart-item { display:flex; align-items:center; gap:16px; padding:20px 24px; border-bottom:1px solid #f1f5f9; }
  .co-cart-img { width:64px; height:64px; object-fit:cover; border-radius:10px; flex-shrink:0; border:1px solid #f1f5f9; }
  .co-cart-name { margin:0 0 4px 0; font-weight:700; font-size:14px; color:#1e293b; line-height:1.4; }
  .co-cart-qty { margin:0; font-size:13px; color:#64748b; font-weight:500; }
  .co-cart-price { font-weight:800; color:#4a7c23; font-size:17px; margin-top:6px; display:block; }
  
  .co-price-details { padding:24px; background:#fcfdfd; }
  .co-total-row { display:flex; justify-content:space-between; align-items:center; font-size:15px; color:#475569; margin-bottom:16px; font-weight:500; }
  .co-total-row.grand { font-size:19px; font-weight:900; color:#1e293b; padding:20px 0 0; border-top:2px dashed #cbd5e1; margin-top:20px; margin-bottom:0;}
  .co-badge-green { color:#16a34a; font-weight:700; background:#f0fdf4; padding:4px 10px; border-radius:6px; }
  
  .co-perks { padding:24px; background:#f8fafc; display:flex; align-items:center; gap:16px; border-top:1px solid #f1f5f9; }
  .co-perk-text1 { font-size:14px; color:#1e293b; font-weight:700; margin-bottom:4px; }
  .co-perk-text2 { font-size:13px; color:#64748b; font-weight:500; }

  /* Mobile Responsive Fixes */
  @media (max-width:900px) {
    .co-grid { display: flex !important; flex-direction: column !important; padding: 24px 16px !important; gap: 24px !important; }
    .co-card { width: 100%; }
    .co-summary { position: static !important; width: 100%; }
  }

  @media (max-width:768px) {
    .co-page { padding-bottom: 24px; background: #fff !important; }
    .co-header { padding:0 16px !important; height:60px; justify-content: space-between; border-bottom: none; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
    .co-logo { font-size: 18px; }
    .hd-divider, .co-steps, .co-secure { display: none !important; }
    .co-back-btn { margin-left: 0; background: #f8fafc; border:none; box-shadow: none; }
    
    .co-card { box-shadow: none; border: 1px solid #f1f5f9; border-radius: 16px; margin-bottom: 0px; }
    .co-summary { box-shadow: none; border: 1px solid #f1f5f9; border-radius: 16px; margin-top: 8px; }
    
    .co-row2, .co-row3 { grid-template-columns:1fr !important; gap:20px; }
    
    .co-card-header { padding: 16px; }
    .co-form-body { padding:24px 16px !important; }
    .co-submit { width:100% !important; border-radius: 12px; font-size:15px; padding:16px; }
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
  const [paidAmount, setPaidAmount] = useState(0);
  const [errors, setErrors] = useState({});

  // Smart Validation States
  const [geoLoading, setGeoLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);

  const [form, setForm] = useState({
    fullName: '', mobile: '', email: '',
    addressLine: '', landmark: '', city: '', state: '', pincode: '',
  });

  const total = cartItems.reduce((s, i) => s + (i.unitPrice || i.price) * i.qty, 0);

  // Guard: Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !success) {
      navigate('/products');
    }
  }, [cartItems, success, navigate]);

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

    // Reset pincode verification if edited
    if (name === 'pincode' && value.length !== 6) {
      setPinVerified(false);
    }
  };

  // Smart Geolocation
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();

        if (data && data.address) {
          const { city, state, postcode, suburb, road } = data.address;
          setForm(prev => ({
            ...prev,
            city: city || data.address.town || data.address.village || '',
            state: state || '',
            pincode: postcode || '',
            addressLine: `${road || ''} ${suburb || ''}`.trim()
          }));
          setErrors(prev => ({ ...prev, city: '', state: '', pincode: '', addressLine: '' }));
          if (postcode && /^\d{6}$/.test(postcode)) setPinVerified(true);
        }
      } catch (err) {
        console.error('Rev-Geo failed:', err);
        alert('Could not fetch address details for your location.');
      } finally {
        setGeoLoading(false);
      }
    }, (error) => {
      setGeoLoading(false);
      alert('Location access denied. Please enable location permissions.');
    });
  };

  // Real-time Pincode Verification
  useEffect(() => {
    let active = true;
    const verifyPincode = async () => {
      const pin = form.pincode.trim();
      if (!/^\d{6}$/.test(pin)) return;

      setPinLoading(true);
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await response.json();

        if (active) {
          if (data && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            setForm(prev => ({
              ...prev,
              city: postOffice.District,
              state: postOffice.State
            }));
            setErrors(prev => ({ ...prev, pincode: '', city: '', state: '' }));
            setPinVerified(true);
          } else {
            setPinVerified(false);
            setErrors(prev => ({ ...prev, pincode: 'Invalid Pincode / Not Found' }));
          }
        }
      } catch (error) {
        console.error("Pincode API error", error);
        if (active) setPinVerified(false);
      } finally {
        if (active) setPinLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      verifyPincode();
    }, 600);

    return () => {
      active = false;
      clearTimeout(timerId);
    };
  }, [form.pincode]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) e.mobile = 'Enter valid 10-digit mobile';
    if (!form.addressLine.trim()) e.addressLine = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'Select your state';
    if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter valid 6-digit pincode';
    if (!form.email.trim()) e.email = 'Email is required';
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
          if (data.success) { 
            setPaidAmount(total);
            clearCart(); 
            setOrderId(dbId || response.razorpay_payment_id); 
            setSuccess(true); 
          }
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
          cartItems: cartItems.map(i => ({
            productId: String(i.id),
            name: i.name,
            price: i.unitPrice || i.price,
            quantity: i.qty,
            image: i.img || ''
          })),
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

  /* Success state (Redesigned - Premium Centered Receipt) */
  if (success) return (
    <div className="co-success" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)', minHeight: '100vh', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{CSS + `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
        .co-receipt-card { background: #fff; border-radius: 28px; padding: 56px 40px; text-align: center; box-shadow: 0 40px 100px rgba(0,0,0,0.08); border: 1px solid rgba(74,124,35,0.06); max-width: 520px; width: 100%; animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1); font-family: 'Outfit', sans-serif; position: relative; overflow: hidden; }
        .receipt-bg { position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(74,124,35,0.04) 0%, transparent 70%); z-index: 0; }
        
        .co-check-ring { background: linear-gradient(135deg, #4a7c23, #1a3d0c); border-radius: 50%; width: 90px; height: 90px; display: flex; align-items: center; justify-content: center; margin: 0 auto 32px; color: #fff; box-shadow: 0 20px 40px rgba(74,124,35,0.2); z-index: 1; position: relative; }
        .receipt-badge { display: inline-flex; align-items: center; gap: 8px; background: #f0fdf4; color: #166534; padding: 10px 18px; border-radius: 100px; font-weight: 800; font-size: 13px; margin-bottom: 24px; border: 1px solid #bbf7d0; text-transform: uppercase; letter-spacing: 1px; }
        
        .receipt-title { font-size: 38px; font-weight: 800; color: #1a3d0c; margin-bottom: 12px; letter-spacing: -1.5px; line-height: 1; }
        .receipt-subtitle { color: #64748b; font-size: 16px; margin-bottom: 40px; line-height: 1.6; }
        
        .receipt-info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; margin-bottom: 40px; text-align: left; }
        .receipt-info-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed #e2e8f0; }
        .receipt-info-row:last-child { border-bottom: none; }
        .receipt-info-label { color: #64748b; font-weight: 600; font-size: 14px; }
        .receipt-info-value { color: #1a3d0c; font-weight: 800; font-size: 15px; }
        .receipt-total { color: #4a7c23; font-size: 28px; font-weight: 800; }

        .receipt-actions { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .receipt-btn { height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; gap: 12px; font-weight: 800; font-size: 16px; cursor: pointer; transition: all 0.3s; border: none; text-decoration: none; }
        .receipt-btn.primary { background: #1a3d0c; color: #fff; box-shadow: 0 15px 30px rgba(26,61,12,0.15); }
        .receipt-btn.primary:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(26,61,12,0.25); background: #2d5a15; }
        .receipt-btn.secondary { background: #fff; color: #475569; border: 2px solid #e2e8f0; }
        .receipt-btn.secondary:hover { transform: translateY(-2px); border-color: #1a3d0c; color: #1a3d0c; }
        
        .receipt-invoice-link { margin-top: 24px; color: #4a7c23; font-weight: 800; display: inline-flex; align-items: center; gap: 10px; text-decoration: none; font-size: 15px; transition: 0.2s; }
        .receipt-invoice-link:hover { text-decoration: underline; color: #1a3d0c; }

        @media (max-width: 600px) {
          .co-receipt-card { padding: 40px 24px; }
          .receipt-title { font-size: 32px; }
        }
      `}</style>
      
      <div className="co-receipt-card">
        <div className="receipt-bg"></div>
        <div className="receipt-badge">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
           Confirmed
        </div>
        
        <div className="co-check-ring">
           <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>

        <h1 className="receipt-title">Thank You!</h1>
        <p className="receipt-subtitle">
           We've received your organic order. A confirmation has been sent to <strong>{form.email}</strong>.
        </p>
        
        <div className="receipt-info-box">
          <div className="receipt-info-row">
             <span className="receipt-info-label">Order ID</span>
             <span className="receipt-info-value">#{String(orderId).slice(-10).toUpperCase()}</span>
          </div>
          <div className="receipt-info-row">
             <span className="receipt-info-label">Status</span>
             <span className="receipt-info-value" style={{ color: '#4a7c23' }}>Paid & Ready</span>
          </div>
          <div className="receipt-info-row" style={{ marginTop: '12px', borderBottom: 'none' }}>
             <span className="receipt-info-label" style={{ fontSize: '16px' }}>Total Amount</span>
             <span className="receipt-total">₹{paidAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="receipt-actions">
           <button onClick={() => navigate('/products')} className="receipt-btn primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              Continue Shopping
           </button>
           
           <a 
              href={`${BASE_URL}/payment/invoice/${orderId}`} 
              target="_blank" 
              rel="noreferrer" 
              className="receipt-btn secondary"
           >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Tax Invoice (PDF)
           </a>
        </div>

        <button onClick={() => navigate('/orders')} className="receipt-invoice-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
           View Order History & Tracking →
        </button>
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
        <div className="hd-divider" />

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
        <button onClick={() => navigate(-1)} className="co-back-btn">← Back</button>
      </header>

      {/* Body */}
      <div className="co-grid">

        {/* LEFT: Form */}
        <div className="co-card">
          <div className="co-card-header">
            <div className="step-num">1</div>
            <h2>Delivery Details</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="co-form-body">

            <button type="button" className="co-geo-btn" onClick={handleUseMyLocation}>
              {geoLoading ? <div className="spin-small" /> : (
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
              <span>Locate Me (Auto-fill Address)</span>
            </button>

            <div className="co-row2">
              <FormField label="Full Name" required error={errors.fullName}>
                <input className={`co-input ${errors.fullName ? 'err' : ''}`} name="fullName" value={form.fullName} onChange={onChange} />
              </FormField>

              <FormField label="Mobile Number" required error={errors.mobile}>
                <div className="co-input-wrap">
                  <span className="co-prefix">+91</span>
                  <input className={`co-input co-prefix-input ${errors.mobile ? 'err' : ''}`} type="tel" name="mobile" value={form.mobile} onChange={onChange} maxLength={10} />
                </div>
              </FormField>
            </div>

            <div className="co-row1">
              <FormField label="Email Address (for invoice & updates)" required error={errors.email}>
                <input className={`co-input ${errors.email ? 'err' : ''}`} type="email" name="email" value={form.email} onChange={onChange} />
              </FormField>
            </div>

            <div className="co-row1">
              <FormField label="Address / Flat / Street" required error={errors.addressLine}>
                <textarea className={`co-input ${errors.addressLine ? 'err' : ''}`} name="addressLine" value={form.addressLine} onChange={onChange} rows={2} placeholder="House No., Building, Street, Area, Colony" style={{ resize: 'none' }} />
              </FormField>
            </div>

            <div className="co-row1">
              <FormField label="Landmark">
                <input className="co-input" name="landmark" value={form.landmark} onChange={onChange} placeholder="Near school, temple, market..." />
              </FormField>
            </div>

            <div className="co-row3">
              <FormField label="Pincode" required error={errors.pincode}>
                <div style={{ position: 'relative' }}>
                  <input className={`co-input ${pinLoading || pinVerified ? 'co-input-with-icon' : ''} ${errors.pincode ? 'err' : ''}`} name="pincode" value={form.pincode} onChange={onChange} maxLength={6} />
                  <div className="pin-status-icon">
                    {pinLoading && <div className="spin-small" />}
                    {!pinLoading && pinVerified && <span style={{ color: '#16a34a', fontWeight: '900', fontSize: '16px' }}>✓</span>}
                  </div>
                </div>
              </FormField>

              <FormField label="City" required error={errors.city}>
                <input className={`co-input ${errors.city ? 'err' : ''}`} name="city" value={form.city} onChange={onChange} />
              </FormField>

              <FormField label="State" required error={errors.state}>
                <select className={`co-input ${errors.state ? 'err' : ''}`} name="state" value={form.state} onChange={onChange}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
            </div>

            {/* Security note */}
            <div className="co-security">
              <span style={{ fontSize: 22 }}>🔐</span>
              <p>Your payment is processed securely via <strong>Razorpay</strong>. We never store your card details. SSL encrypted.</p>
            </div>

            {/* Amount preview */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
              <button type="submit" disabled={loading || cartItems.length === 0} className="co-submit">
                {loading ? (
                  <><div className="co-spinner" /> Processing…</>
                ) : (
                  `CONTINUE TO PAY`
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="co-summary">
          <div className="co-summary-header">
            <h3>Price Details</h3>
          </div>

          <div className="co-summary-body">
            {cartItems.length === 0 ? (
              <div className="co-empty">
                <div className="co-empty-icon">🛒</div>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div style={{ maxHeight: 310, overflowY: 'auto' }}>
                  {cartItems.map(item => (
                    <div key={item.id} className="co-cart-item">
                      <img src={item.img} alt={item.name} className="co-cart-img" onError={e => { e.target.src = '/placeholder.png'; }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="co-cart-name">{item.name}</p>
                        <p className="co-cart-qty">Quantity: {item.qty} {item.weight ? `(${item.weight})` : ''}</p>
                        <span className="co-cart-price">₹{((item.unitPrice || item.price) * item.qty).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="co-price-details">
                  <div className="co-price-header" style={{ display: 'none' }}>Price Details</div>
                  <div style={{ paddingTop: 24 }}>
                    <div className="co-total-row"><span>Price ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                    <div className="co-total-row"><span>Delivery Charges</span><span className="co-badge-green">Free</span></div>
                    <div className="co-total-row grand"><span>Total Payable</span><span>₹{total.toLocaleString('en-IN')}</span></div>
                    <div style={{ color: '#388e3c', fontSize: 13, fontWeight: 600, paddingBottom: 20 }}>Your Total Savings on this order ₹0</div>
                  </div>
                </div>

                <div className="co-perks">
                  <div style={{ flexShrink: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e0f2fe', borderRadius: '50%' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#0284c7" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                    </svg>
                  </div>
                  <div>
                    <div className="co-perk-text1">Safe and Secure Payments.</div>
                    <div className="co-perk-text2">100% Authentic products.</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}