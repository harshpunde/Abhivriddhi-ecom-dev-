import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendOTP, verifyOTP, loginWithPassword } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const isEmail = identifier.includes('@');
  const authType = isEmail ? 'email' : 'mobile';

  const handleSendOTP = async (event) => {
    event.preventDefault();

    if (!identifier.trim()) {
      return setMessage('Please enter your Email or Mobile number.');
    }
    if (!isEmail && !/^\+91[6-9]\d{9}$/.test(identifier)) {
      return setMessage('For mobile, please use +91 format (e.g. +919876543210).');
    }

    setLoading(true);
    setMessage('');

    try {
      await sendOTP({
        identifier: identifier.trim(),
        type: authType,
        purpose: 'login'
      });
      setStep('otp');
      setMessage(`OTP sent to your ${authType}. Please check your messages.`);
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await verifyOTP({
        identifier: identifier.trim(),
        otp: otp.trim(),
        type: authType,
        purpose: 'login'
      });

      localStorage.setItem('token', response.token);
      setMessage('Login successful! Redirecting...');
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();

    if (!identifier.trim()) {
      return setMessage('Please enter your Email or Mobile number.');
    }
    if (!password.trim()) {
      return setMessage('Please enter your password.');
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await loginWithPassword({
        identifier: identifier.trim(),
        password: password.trim()
      });
      localStorage.setItem('token', response.token);
      setMessage('Login successful! Redirecting...');
      navigate('/');
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        <h1 className="mb-4 text-3xl font-bold text-slate-900">Login</h1>
        <p className="mb-8 text-sm text-slate-600">
          Access your account with email or mobile OTP.
        </p>

        <form className="space-y-5">
          <label className="block text-sm font-medium text-slate-700">
            Email or Mobile
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              type="text"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
              placeholder="you@example.com or +919876543210"
            />
          </label>

          {step === 'login' ? (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Password (optional)
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23]"
                  placeholder="••••••••"
                />
              </label>

              <button
                onClick={handlePasswordLogin}
                className="w-full rounded-2xl bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c]"
                disabled={loading || !identifier}
              >
                {loading ? 'Logging in...' : 'Login with Password'}
              </button>

              <button
                onClick={handleSendOTP}
                className="w-full rounded-2xl border border-[#4a7c23] bg-white px-4 py-3 text-sm font-semibold text-[#4a7c23] transition hover:bg-slate-50"
                disabled={loading || !identifier}
              >
                {loading ? 'Sending OTP...' : 'Login with OTP'}
              </button>
            </>
          ) : (
            <>
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
                onClick={handleVerifyOTP}
                className="w-full rounded-2xl bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c]"
                disabled={loading || !otp}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Back to Login
              </button>
            </>
          )}
        </form>

        {message ? (
          <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-[#4a7c23] hover:text-[#3d6a1c]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
