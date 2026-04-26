import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { FiUser, FiLock, FiPhone, FiEye, FiEyeOff, FiShoppingBag } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', shop: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.phone || !form.password) { setError('Please fill all fields'); return; }
    if (mode === 'signup' && !form.name) { setError('Please enter your name'); return; }

    setLoading(true);
    try {
      const res = mode === 'login'
        ? await api.login(form.phone, form.password)
        : await api.signup(form.name, form.shop, form.phone, form.password);

      login(res.user, res.token);
      navigate('/');
    } catch (err) {
      setError(err.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
          alt="bg" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/90 via-blue-900/80 to-green-900/85" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-slide-up">
        <div className="glass rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <FiShoppingBag className="text-white text-3xl" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">Vasavi General Merchants</h1>
            <p className="text-blue-200 text-sm mt-1">B2B Wholesale Grocery Platform</p>
          </div>

          {/* Toggle */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
            {['login', 'signup'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${mode === m ? 'bg-white text-blue-900 shadow-sm' : 'text-white/70 hover:text-white'}`}>
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                    placeholder="Your Full Name" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="relative">
                  <FiShoppingBag className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                    placeholder="Shop / Business Name (optional)" value={form.shop} onChange={e => set('shop', e.target.value)} />
                </div>
              </>
            )}
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
              <input type="tel" className="w-full pl-11 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                placeholder="Mobile Number" value={form.phone} onChange={e => set('phone', e.target.value)} maxLength={10} />
            </div>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
              <input type={showPwd ? 'text' : 'password'} className="w-full pl-11 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                placeholder="Password" value={form.password} onChange={e => set('password', e.target.value)} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                {showPwd ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {error && <p className="text-red-300 text-sm font-medium bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-2">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Please wait...</span></>
              ) : (
                <span>{mode === 'login' ? 'Login to Platform' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <p className="text-center text-blue-200/70 text-xs mt-6">
            Vasavi General Merchants © 2024 · B2B Wholesale Only
          </p>
        </div>
      </div>
    </div>
  );
}
