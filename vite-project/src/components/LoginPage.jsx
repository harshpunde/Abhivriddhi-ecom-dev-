import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { sendOTP, verifyOTP, loginWithPassword, forgotPassword, resetPassword } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = location.state?.from || '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  // 'login' | 'otp_verify' | 'forgot' | 'reset_otp_verify' | 'new_password'
  const [step, setStep] = useState('login'); 
  const [loginMode, setLoginMode] = useState('password'); // 'password' | 'otp'
  const [message, setMessage] = useState({ text: '', type: 'info' }); 
  const [loading, setLoading] = useState(false);

  const isEmail = identifier.includes('@');
  const authType = isEmail ? 'email' : 'mobile';

  const setError = (text) => setMessage({ text, type: 'error' });
  const setSuccess = (text) => setMessage({ text, type: 'success' });

  const getFormattedIdentifier = () => {
    const id = identifier.trim();
    if (!id.includes('@') && /^[6-9]\d{9}$/.test(id)) {
      return `+91${id}`;
    }
    return id;
  };

  const validateIdentifier = () => {
    if (!identifier.trim()) {
      setError('Please enter your email or mobile.');
      return false;
    }
    const id = getFormattedIdentifier();
    if (!id.includes('@') && !/^\+91[6-9]\d{9}$/.test(id)) {
      setError('Please enter a valid email or 10-digit mobile.');
      return false;
    }
    return true;
  };

  const handleSendOTP = async (event, purpose = 'login') => {
    if (event) event.preventDefault();
    if (!validateIdentifier()) return;

    setLoading(true);
    setMessage({ text: '', type: 'info' });

    try {
      if (purpose === 'password-reset') {
        await forgotPassword({ identifier: getFormattedIdentifier(), type: authType });
        setStep('reset_otp_verify');
      } else {
        await sendOTP({ identifier: getFormattedIdentifier(), type: authType, purpose: 'login' });
        setStep('otp_verify');
      }
      setSuccess(`OTP sent to your ${authType}!`);
    } catch (error) {
      if (error.message.toLowerCase().includes('not found') || error.message.toLowerCase().includes('not registered')) {
        setError('Acccount not found. Please register yourself first.');
      } else {
        setError(error.message || 'Failed to send OTP.');
      }
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) return setError('Please enter 6-digit OTP.');

    setLoading(true);
    try {
      const response = await verifyOTP({
        identifier: getFormattedIdentifier(),
        otp: otp.trim(),
        type: authType,
        purpose: 'login',
      });
      login(response.token, response.user);
      setSuccess('Logged in successfully!');
      setTimeout(() => navigate(redirectTo), 1000);
    } catch (error) {
      setError(error.message || 'OTP verification failed.');
    }
    setLoading(false);
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    if (!validateIdentifier() || !password) return;

    setLoading(true);
    try {
      const response = await loginWithPassword({
        identifier: getFormattedIdentifier(),
        password: password,
      });
      login(response.token, response.user);
      setSuccess('Logged in successfully!');
      setTimeout(() => navigate(redirectTo), 1000);
    } catch (error) {
      setError(error.message || 'Login failed.');
    }
    setLoading(false);
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      await resetPassword({
        identifier: getFormattedIdentifier(),
        otp: otp.trim(),
        type: authType,
        newPassword
      });
      setSuccess('Password updated! Redirecting to login...');
      setTimeout(() => {
        setStep('login');
        setLoginMode('password');
        setMessage({ text: '', type: 'info' });
      }, 2000);
    } catch (error) {
      setError(error.message || 'Failed to reset password.');
    }
    setLoading(false);
  };

  const handleBackToLogin = () => {
    setStep('login');
    setOtp('');
    setMessage({ text: '', type: 'info' });
  };

  const msgColor = message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700';

  return (
    <div className="py-20 px-4 flex items-center justify-center bg-slate-50/50">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl shadow-slate-200 border border-slate-100">
        
        {/* Step Header */}
        <div className="mb-8 text-center sm:text-left transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-[#4a7c23] to-[#7dbb46] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#4a7c23]/20 mx-auto sm:mx-0">
            <span className="text-2xl">🌱</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">
            {step === 'login' && 'Welcome Back'}
            {step === 'forgot' && 'Reset Password'}
            {(step === 'otp_verify' || step === 'reset_otp_verify') && 'Verify Account'}
            {step === 'new_password' && 'New Password'}
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            {step === 'login' && 'Experience nature with every bite.'}
            {step === 'forgot' && 'Enter your details to receive a reset code.'}
            {(step === 'otp_verify' || step === 'reset_otp_verify') && `Check your ${authType} for a 6-digit code.`}
            {step === 'new_password' && 'Set a strong password for your account.'}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        {step === 'login' && (
          <div className="flex rounded-2xl border border-slate-100 p-1 mb-8 bg-slate-50 shadow-inner">
            <button
              onClick={() => { setLoginMode('password'); setMessage({ text: '', type: 'info' }); }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-300 ${loginMode === 'password' ? 'bg-white shadow-md shadow-slate-200 text-[#4a7c23]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Password
            </button>
            <button
              onClick={() => { setLoginMode('otp'); setMessage({ text: '', type: 'info' }); }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all duration-300 ${loginMode === 'otp' ? 'bg-white shadow-md shadow-slate-200 text-[#4a7c23]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              OTP Login
            </button>
          </div>
        )}

        <form className="space-y-6">
          {/* IDENTIFIER FIELD */}
          {(step === 'login' || step === 'forgot') && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email or Mobile</label>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                type="text"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-4 focus:ring-[#4a7c23]/5 placeholder:text-slate-400 font-medium"
                placeholder="you@email.com or 10-digit number"
              />
            </div>
          )}

          {/* PASSWORD FIELD */}
          {step === 'login' && loginMode === 'password' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <button 
                  type="button"
                  onClick={() => setStep('forgot')}
                  className="text-xs font-bold text-[#4a7c23] hover:text-[#3d6a1c] transition"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-4 focus:ring-[#4a7c23]/5 placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* OTP INPUT */}
          {(step === 'otp_verify' || step === 'reset_otp_verify') && (
            <div className="space-y-4">
              <div className="bg-[#4a7c23]/5 rounded-2xl px-5 py-4 text-sm text-slate-600 border border-[#4a7c23]/10 font-medium">
                Sent to: <span className="text-[#4a7c23] font-bold">{identifier}</span>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1 text-center block">Enter 6-Digit OTP</label>
                <input
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(val);
                    if (val.length === 6 && step === 'reset_otp_verify') setStep('new_password');
                  }}
                  type="text"
                  inputMode="numeric"
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-5 text-2xl outline-none transition focus:border-[#4a7c23] text-center tracking-[0.5em] font-black text-slate-800"
                  placeholder="000000"
                />
              </div>
            </div>
          )}

          {/* NEW PASSWORD FIELDS */}
          {step === 'new_password' && (
            <div className="space-y-4 animate-in fade-in duration-500">
               <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-4 focus:ring-[#4a7c23]/5"
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 text-sm outline-none transition focus:border-[#4a7c23] focus:ring-4 focus:ring-[#4a7c23]/5"
                  placeholder="Repeat your password"
                />
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="space-y-3 pt-2">
            {step === 'login' && loginMode === 'password' && (
              <button onClick={handlePasswordLogin} disabled={loading || !identifier || !password} className="btn-auth-primary">
                {loading ? 'Authenticating...' : 'Sign In Now'}
              </button>
            )}
            
            {step === 'login' && loginMode === 'otp' && (
              <button onClick={(e) => handleSendOTP(e, 'login')} disabled={loading || !identifier} className="btn-auth-primary">
                {loading ? 'Sending Code...' : 'Get Login OTP'}
              </button>
            )}

            {step === 'otp_verify' && (
              <button onClick={handleVerifyOTP} disabled={loading || otp.length !== 6} className="btn-auth-primary">
                {loading ? 'Verifying...' : 'Verify and Sign In'}
              </button>
            )}

            {step === 'forgot' && (
              <button onClick={(e) => handleSendOTP(e, 'password-reset')} disabled={loading || !identifier} className="btn-auth-primary">
                {loading ? 'Sending Code...' : 'Send Reset OTP'}
              </button>
            )}

            {step === 'new_password' && (
              <button onClick={handleResetPassword} disabled={loading || !newPassword} className="btn-auth-primary">
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            )}

            {step !== 'login' && (
              <button type="button" onClick={handleBackToLogin} className="w-full py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition">
                Cancel
              </button>
            )}
          </div>
        </form>

        {message.text && (
          <div className={`mt-6 rounded-2xl px-5 py-4 text-sm font-semibold animate-in slide-in-from-bottom-2 duration-300 ${msgColor}`}>
            {message.text}
          </div>
        )}

        <p className="mt-8 text-center text-sm font-medium text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-extrabold text-[#4a7c23] hover:text-[#3d6a1c] transition underline decoration-2 underline-offset-4">
            Create an Account
          </Link>
        </p>
      </div>

      <style>{`
        .btn-auth-primary {
          width: 100%;
          border-radius: 1.25rem;
          background-color: #4a7c23;
          padding: 1.1rem;
          font-size: 0.875rem;
          font-weight: 800;
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 15px -3px rgba(74, 124, 35, 0.3);
        }
        .btn-auth-primary:hover:not(:disabled) {
          background-color: #3d6a1c;
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(74, 124, 35, 0.4);
        }
        .btn-auth-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
