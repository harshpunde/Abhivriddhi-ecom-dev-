import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { registerUser, verifyOTP } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = location.state?.from || '/';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register'); // 'register' | 'verify'
  const [message, setMessage] = useState({ text: '', type: 'info' });
  const [loading, setLoading] = useState(false);
  const [verifyType, setVerifyType] = useState('email'); // 'email' | 'mobile'
  const [showPassword, setShowPassword] = useState(false);

  const setError = (text) => setMessage({ text, type: 'error' });
  const setSuccess = (text) => setMessage({ text, type: 'success' });
  const setInfo = (text) => setMessage({ text, type: 'info' });

  const getFormattedMobile = () => {
    let mob = mobile.trim();
    if (/^[6-9]\d{9}$/.test(mob)) {
      mob = `+91${mob}`;
    }
    return mob;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    // Client-side validation
    if (name.trim().length < 2) return setError('Name must be at least 2 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Please enter a valid email address.');
    const mob = getFormattedMobile();
    if (!/^\+91[6-9]\d{9}$/.test(mob)) {
      return setError('Please enter a valid 10-digit mobile number.');
    }
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    setMessage({ text: '', type: 'info' });

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        mobile: getFormattedMobile(),
        password,
      });
      setStep('verify');
      setSuccess(
        'Account created! OTP has been sent to your email and mobile. Enter the OTP to verify your account.'
      );
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    }

    setLoading(false);
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      return setError('Please enter the 6-digit OTP.');
    }

    setLoading(true);
    setMessage({ text: '', type: 'info' });

    try {
      const response = await verifyOTP({
        identifier: verifyType === 'email' ? email.trim() : getFormattedMobile(),
        otp: otp.trim(),
        type: verifyType,
        purpose: 'registration',
      });

      login(response.token, response.user);
      setSuccess('Account verified! Welcome to Abhivriddhi Organics 🎉');
      setTimeout(() => navigate(redirectTo, { replace: true }), 1200);
    } catch (error) {
      setError(error.message || 'Verification failed. Please try again.');
    }

    setLoading(false);
  };

  const msgColor =
    message.type === 'error'
      ? 'bg-red-50 border border-red-200 text-red-700'
      : message.type === 'success'
      ? 'bg-green-50 border border-green-200 text-green-700'
      : 'bg-blue-50 border border-blue-200 text-blue-700';

  return (
    <div className="py-20 px-4 flex items-center justify-center bg-slate-50/50">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-slate-200">

        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 bg-[#4a7c23] rounded-2xl flex items-center justify-center mb-4">
            <span className="text-2xl">🌱</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            {step === 'register' ? 'Create Account' : 'Verify Account'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {step === 'register'
              ? 'Join Abhivriddhi Organics for fresh, pure products'
              : `OTP sent to your ${verifyType}. Please enter it below.`}
          </p>
        </div>

        {/* Registration Form */}
        {step === 'register' && (
          <form className="space-y-5" onSubmit={handleRegister}>
            <label className="block text-sm font-medium text-slate-700">
              Full Name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                autoComplete="name"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10"
                placeholder="Your full name"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Email Address
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10"
                placeholder="you@example.com"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Mobile Number
              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 pointer-events-none">+91</span>
                <input
                  value={mobile.replace('+91', '')}
                  onChange={(e) => setMobile(e.target.value)}
                  type="tel"
                  autoComplete="tel"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10"
                  placeholder="9876543210"
                />
              </div>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Password
              <div className="relative mt-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-2 focus:ring-[#4a7c23]/10"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#4a7c23] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3d6a1c] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !name || !email || !mobile || !password}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* OTP Verification Form */}
        {step === 'verify' && (
          <form className="space-y-5" onSubmit={handleVerify}>
            {/* Verify via toggle */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Verify using</p>
              <div className="flex rounded-2xl border border-slate-200 p-1 bg-slate-50">
                <button
                  type="button"
                  onClick={() => { setVerifyType('email'); setOtp(''); }}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                    verifyType === 'email' ? 'bg-white shadow text-[#4a7c23]' : 'text-slate-500'
                  }`}
                >
                  📧 Email
                </button>
                <button
                  type="button"
                  onClick={() => { setVerifyType('mobile'); setOtp(''); }}
                  className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                    verifyType === 'mobile' ? 'bg-white shadow text-[#4a7c23]' : 'text-slate-500'
                  }`}
                >
                  📱 Mobile
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl px-4 py-3 text-sm text-slate-600 border border-slate-200">
              Sending OTP to:{' '}
              <span className="font-semibold text-slate-800">
                {verifyType === 'email' ? email : getFormattedMobile()}
              </span>
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
                'Verify & Continue'
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('register'); setOtp(''); }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              ← Back to Registration
            </button>
          </form>
        )}

        {/* Message Box */}
        {message.text && (
          <div className={`mt-5 rounded-2xl px-4 py-3 text-sm ${msgColor}`}>
            {message.text}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#4a7c23] hover:text-[#3d6a1c]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
