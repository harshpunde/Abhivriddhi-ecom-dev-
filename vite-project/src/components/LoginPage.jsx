import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { sendOTP, verifyOTP, loginWithPassword } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/';
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'otp'
  const [message, setMessage] = useState({ text: '', type: 'info' }); // type: 'info'|'success'|'error'
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const isEmail = identifier.includes('@');
  const authType = isEmail ? 'email' : 'mobile';

  const setError = (text) => setMessage({ text, type: 'error' });
  const setSuccess = (text) => setMessage({ text, type: 'success' });
  const setInfo = (text) => setMessage({ text, type: 'info' });

  const getFormattedIdentifier = () => {
    const id = identifier.trim();
    if (!id.includes('@') && /^[6-9]\d{9}$/.test(id)) {
      return `+91${id}`;
    }
    return id;
  };

  const validateIdentifier = () => {
    if (!identifier.trim()) {
      setError('Please enter your email or mobile number.');
      return false;
    }
    const id = getFormattedIdentifier();
    if (!id.includes('@') && !/^\+91[6-9]\d{9}$/.test(id)) {
      setError('Please enter a valid email or 10-digit mobile number.');
      return false;
    }
    return true;
  };

  const handleSendOTP = async (event) => {
    event.preventDefault();
    if (!validateIdentifier()) return;

    setLoading(true);
    setMessage({ text: '', type: 'info' });

    try {
      await sendOTP({
        identifier: getFormattedIdentifier(),
        type: authType,
        purpose: 'login',
      });
      setStep('otp');
      setSuccess(`OTP sent to your ${authType}. Please check and enter it below.`);
    } catch (error) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    setMessage({ text: '', type: 'info' });

    try {
      const response = await verifyOTP({
        identifier: getFormattedIdentifier(),
        otp: otp.trim(),
        type: authType,
        purpose: 'login',
      });

      localStorage.setItem('token', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate(redirectTo), 1000);
    } catch (error) {
      setError(error.message || 'OTP verification failed. Please try again.');
    }

    setLoading(false);
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    if (!validateIdentifier()) return;
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: 'info' });

    try {
      const response = await loginWithPassword({
        identifier: getFormattedIdentifier(),
        password: password,
      });
      localStorage.setItem('token', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate(redirectTo), 1000);
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
    }

    setLoading(false);
  };

  const handleBackToLogin = () => {
    setStep('login');
    setOtp('');
    setMessage({ text: '', type: 'info' });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (step === 'otp') {
      if (!loading && otp.length === 6) handleVerifyOTP(e);
    } else if (loginMode === 'password') {
      if (!loading && identifier && password) handlePasswordLogin(e);
    } else {
      if (!loading && identifier) handleSendOTP(e);
    }
  };

  const msgColor =
    message.type === 'error'
      ? 'bg-red-50 border border-red-200 text-red-700'
      : message.type === 'success'
      ? 'bg-green-50 border border-green-200 text-green-700'
      : 'bg-slate-100 text-slate-700';

  return (
    <div className="py-20 px-4 flex items-center justify-center bg-slate-50/50">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">
        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 bg-[#4a7c23] rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">🫘</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {step === 'otp' ? 'Enter OTP' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {step === 'otp'
              ? `We sent a 6-digit OTP to your ${authType}`
              : 'Sign in to your Abhivriddhi Organics account'}
          </p>
        </div>

        {/* Login Mode Toggle (only on first step) */}
        {step === 'login' && (
          <div className="flex rounded-2xl border border-slate-200 p-1 mb-6 bg-slate-50">
            <button
              type="button"
              onClick={() => { setLoginMode('password'); setMessage({ text: '', type: 'info' }); }}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                loginMode === 'password'
                  ? 'bg-white shadow text-[#4a7c23]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('otp'); setMessage({ text: '', type: 'info' }); }}
              className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                loginMode === 'otp'
                  ? 'bg-white shadow text-[#4a7c23]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              OTP Login
            </button>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleFormSubmit}>
          {/* Identifier always shown */}
          {step === 'login' && (
            <label className="block text-sm font-medium text-slate-700">
              Email or Mobile Number
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                type="text"
                autoComplete="username"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10"
                placeholder="you@example.com or +919876543210"
              />
            </label>
          )}

          {/* Password mode */}
          {step === 'login' && loginMode === 'password' && (
            <>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10"
                  placeholder="••••••••"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-2xl bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !identifier || !password}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </>
          )}

          {/* OTP send mode */}
          {step === 'login' && loginMode === 'otp' && (
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !identifier}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending OTP...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
          )}

          {/* OTP entry step */}
          {step === 'otp' && (
            <>
              <div className="bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-600 border border-slate-200">
                Sending OTP to: <span className="font-semibold text-slate-800">{identifier}</span>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Enter 6-digit OTP
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  autoFocus
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10 tracking-widest text-center text-lg font-bold"
                  placeholder="• • • • • •"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  'Verify & Login'
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                ← Back
              </button>

              <button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full text-sm text-[#4a7c23] hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            </>
          )}
        </form>

        {/* Message */}
        {message.text && (
          <div className={`mt-5 rounded-2xl px-4 py-3 text-sm ${msgColor}`}>
            {message.text}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-[#4a7c23] hover:text-[#3d6a1c]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
