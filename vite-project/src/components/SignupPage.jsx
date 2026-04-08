import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, verifyOTP } from '../services/api';

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyType, setVerifyType] = useState('email');

  const handleRegister = async (event) => {
    event.preventDefault();
    
    // Client-side validation to match backend rules
    if (name.trim().length < 2) {
      return setMessage('Name must be at least 2 characters long.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setMessage('Please provide a valid email address.');
    }
    const mobileRegex = /^\+91[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return setMessage('Please provide a valid Indian mobile number starting with +91 (e.g. +919876543210).');
    }
    if (password.length < 6) {
      return setMessage('Password must be at least 6 characters long.');
    }

    setLoading(true);
    setMessage('');

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        password
      });
      setStep('verify');
      setMessage('Registration successful. OTP was sent to email and mobile. Verify one now.');
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await verifyOTP({
        identifier: (verifyType === 'email' ? email : mobile).trim(),
        otp: otp.trim(),
        type: verifyType,
        purpose: 'registration'
      });

      localStorage.setItem('token', response.token);
      setMessage('Verification successful! Redirecting to home...');
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Sign Up</h1>
        <p className="mb-8 text-sm text-slate-600">
          Create your account with email, mobile, and OTP verification.
        </p>

        {step === 'register' ? (
          <form className="space-y-5" onSubmit={handleRegister}>
            <label className="block text-sm font-medium text-slate-700">
              Full Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
                placeholder="Your name"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
                placeholder="you@example.com"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Mobile (+91)
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                type="tel"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
                placeholder="+919876543210"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c]"
              disabled={loading || !name || !email || !mobile || !password}
            >
              {loading ? 'Registering...' : 'Sign up'}
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={handleVerify}>
            <label className="block text-sm font-medium text-slate-700">
              Verify Type
              <select
                value={verifyType}
                onChange={(e) => setVerifyType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
              >
                <option value="email">Email</option>
                <option value="mobile">Mobile</option>
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Enter OTP
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
                placeholder="123456"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c]"
              disabled={loading || !otp}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => setStep('register')}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to registration
            </button>
          </form>
        )}

        {message ? (
          <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#4a7c23] hover:text-[#3d6a1c]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
