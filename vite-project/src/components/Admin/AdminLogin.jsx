import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.post('/admin/login', {
        email,
        password
      });

      if (data.success) {
        login(data.token, data.user);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#f0fdf4] rounded-2xl mb-6 shadow-inner text-4xl">
            🌱
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Portal</h1>
          <p className="text-gray-500 font-medium mt-2">Manage Abhivriddhi Organics</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-r-xl text-sm font-bold flex items-center gap-3">
             <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Work Email
            </label>
            <input
              type="email"
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#4a7c23] focus:bg-white transition-all duration-200 font-semibold text-gray-700"
              placeholder="admin@abhivriddhi.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Security Password
            </label>
            <input
              type="password"
              required
              className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-gray-100 outline-none focus:border-[#4a7c23] focus:bg-white transition-all duration-200 font-semibold text-gray-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a3d0c] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:shadow-2xl hover:bg-[#2C7700] hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:transform-none mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In To Dashboard'}
          </button>
        </form>

        <div className="text-center mt-10">
          <button 
            type="button"
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors"
          >
            ← Back to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
