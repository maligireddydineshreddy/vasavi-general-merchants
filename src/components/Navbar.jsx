import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FiShoppingCart, FiPackage, FiBarChart2, FiHome,
  FiLogOut, FiMenu, FiX, FiUser, FiGrid
} from 'react-icons/fi';

export default function Navbar() {
  const { cartCount, user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const nav = [
    { path:'/', label:'Home', icon:<FiHome /> },
    { path:'/products', label:'Products', icon:<FiGrid /> },
    { path:'/orders', label:'Orders', icon:<FiPackage /> },
    { path:'/dashboard', label:'Dashboard', icon:<FiBarChart2 /> },
  ];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg border-b border-gray-100' : 'bg-white/95 backdrop-blur-sm shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-green-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-base font-display">V</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-tight font-display">Vasavi General</p>
              <p className="text-xs text-green-700 font-semibold leading-tight">Merchants</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {nav.map(n => (
              <Link key={n.path} to={n.path}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${location.pathname === n.path ? 'bg-blue-900 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                {n.icon}<span>{n.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors group">
              <FiShoppingCart className="text-xl text-gray-700 group-hover:text-green-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse-slow">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-200">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-900 to-green-700 flex items-center justify-center">
                <FiUser className="text-white text-xs" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{user?.name?.split(' ')[0]}</span>
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
              <FiLogOut /><span>Logout</span>
            </button>

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100">
              {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 shadow-lg animate-slide-up">
          {nav.map(n => (
            <Link key={n.path} to={n.path} onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${location.pathname === n.path ? 'bg-blue-900 text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
              {n.icon}<span>{n.label}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 w-full">
            <FiLogOut /><span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
