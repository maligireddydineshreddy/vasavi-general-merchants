import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products, categories } from '../data/products';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { FiArrowRight, FiTruck, FiShield, FiClock, FiStar, FiZap } from 'react-icons/fi';

const FEATURED = products.filter(p => p.demand === 'high').slice(0, 4);
const REORDER  = products.filter(p => p.stock > 300).slice(0, 4);

export default function HomePage() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="pt-16 min-h-screen bg-gray-50">

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
            alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
              <FiZap className="text-xs" />B2B Wholesale Platform
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 font-display">
              Welcome back,<br />
              <span className="text-green-400">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-blue-200 text-lg mb-8 leading-relaxed">
              Order bulk groceries at wholesale prices. Fast delivery, easy tracking,
              and exclusive retailer discounts — all in one platform.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/products')} className="btn-primary flex items-center gap-2 text-base px-7 py-3">
                Shop Now <FiArrowRight />
              </button>
              <button onClick={() => navigate('/orders')} className="glass text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
                View Orders
              </button>
            </div>
            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[['40+','Products'],['₹500Cr+','Annual Volume'],['2000+','Retailers'],['24hr','Delivery']].map(([v,l])=>(
                <div key={l}>
                  <p className="text-2xl font-bold text-white font-display">{v}</p>
                  <p className="text-blue-300 text-xs font-medium">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Floating product image */}
        <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 w-72 opacity-80">
          <img src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&q=80"
            alt="groceries" className="rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" />
        </div>
      </section>

      {/* ── Trust Bar ───────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-6">
            {[
              { icon:<FiTruck className="text-green-700"/>, text:"Free delivery on orders ₹5000+" },
              { icon:<FiShield className="text-blue-800"/>, text:"100% Quality Guarantee" },
              { icon:<FiClock className="text-amber-600"/>, text:"Same-day dispatch before 2PM" },
              { icon:<FiStar className="text-yellow-500"/>, text:"Trusted by 2000+ retailers" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <span className="text-lg">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-7">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="text-green-700 text-sm font-bold hover:underline flex items-center gap-1">
            View All <FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {categories.map(cat => (
            <Link key={cat.name} to={`/products?cat=${cat.name}`}
              className="group flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <p className="text-xs font-bold text-gray-700 text-center leading-tight">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.count} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured / High Demand ───────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-4 pb-12">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <FiZap className="text-red-500" />Hot & High Demand
            </h2>
            <p className="text-gray-500 text-sm mt-1">Fast-moving products — order before stock runs out</p>
          </div>
          <Link to="/products" className="text-green-700 text-sm font-bold hover:underline flex items-center gap-1">
            See all <FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {FEATURED.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ── Banner ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="gradient-card rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-72 h-full opacity-10">
            <img src="https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500&q=80"
              alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative max-w-lg">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">Special Offer</span>
            <h3 className="text-2xl md:text-3xl font-bold mb-3 font-display">Bulk Savings Up to 12%</h3>
            <p className="text-blue-100 mb-6 text-sm leading-relaxed">Order in bulk and save big. Our tiered discount system rewards every large order. Perfect for high-volume retailers.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg">
              Explore Deals <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Reorder Suggestions ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="section-title">Recommended for You</h2>
            <p className="text-gray-500 text-sm mt-1">Based on popular orders from retailers like you</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {REORDER.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg font-display">Vasavi General Merchants</p>
            <p className="text-sm">B2B Wholesale Grocery Platform · Hyderabad, India</p>
          </div>
          <p className="text-sm">© 2024 Vasavi General Merchants. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
