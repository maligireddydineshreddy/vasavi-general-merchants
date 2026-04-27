import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useApp } from '../context/AppContext';
import {
  FiShoppingCart, FiMinus, FiPlus, FiArrowLeft,
  FiZap, FiAlertTriangle, FiTruck, FiShield, FiClock, FiSun, FiMoon
} from 'react-icons/fi';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const product = products.find(p => p.id === +id);

  const [qty, setQty] = useState(product?.minOrderQty || 1);
  const [slot, setSlot] = useState('morning');

  if (!product) return (
    <div className="pt-24 text-center">
      <p className="text-gray-600 text-lg">Product not found.</p>
      <Link to="/products" className="text-green-700 font-bold underline mt-2 inline-block">Back to products</Link>
    </div>
  );

  const discounted = product.price * (1 - (product.bulkDiscount || 0) / 100);
  const savings = (product.price - discounted) * qty;
  const totalPrice = discounted * qty;
  const isValidQty = qty >= product.minOrderQty;

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-green-700 font-semibold transition-colors">
            <FiArrowLeft />Back
          </button>
          <span>/</span>
          <Link to="/products" className="hover:text-green-700">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square relative">
            <img src={product.image} alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { e.target.src='https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80'; }}
            />
            <div className="absolute top-5 left-5 flex flex-col gap-2">
              {product.demand==='high' && <span className="badge-hot flex items-center gap-1 text-sm px-3 py-1"><FiZap/>High Demand</span>}
              {product.stock<150 && <span className="badge-low flex items-center gap-1 text-sm px-3 py-1"><FiAlertTriangle/>Low Stock</span>}
            </div>
            {product.bulkDiscount > 0 && (
              <div className="absolute top-5 right-5 bg-green-700 text-white font-bold px-4 py-2 rounded-2xl text-sm shadow-lg">
                {product.bulkDiscount}% OFF
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <span className="text-blue-700 text-sm font-bold uppercase tracking-widest">{product.category}</span>
              <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-3 font-display">{product.name}</h1>
              <p className="text-gray-500 leading-relaxed">{product.description}</p>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-blue-900 to-green-700 rounded-2xl p-5 text-white">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-bold font-display">₹{discounted.toFixed(0)}</span>
                <span className="text-blue-200 line-through text-lg">₹{product.price}</span>
                <span className="text-gray-300 text-sm">/{product.unit}</span>
              </div>
              <p className="text-green-300 font-semibold text-sm">You save ₹{(product.price - discounted).toFixed(0)}/{product.unit} with bulk discount</p>
            </div>

            {/* Key info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Min. Order Qty</p>
                <p className="font-bold text-gray-900">{product.minOrderQty} {product.unit}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Stock Available</p>
                <p className={`font-bold ${product.stock < 150 ? 'text-amber-600' : 'text-green-700'}`}>{product.stock} {product.unit}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Bulk Discount</p>
                <p className="font-bold text-green-700">{product.bulkDiscount}% off</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Unit</p>
                <p className="font-bold text-gray-900">per {product.unit}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <p className="font-bold text-gray-900 mb-4">Select Quantity</p>
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-green-500 hover:text-green-700 transition-all text-lg font-bold">
                  <FiMinus />
                </button>
                <input type="number" value={qty} min={1} max={product.stock}
                  onChange={e => setQty(Math.max(1, +e.target.value))}
                  className="w-24 text-center font-bold text-lg input-field py-2" />
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-green-500 hover:text-green-700 transition-all text-lg font-bold">
                  <FiPlus />
                </button>
                <span className="text-gray-500 text-sm">{product.unit}s</span>
              </div>

              {!isValidQty && (
                <p className="text-amber-600 text-sm font-semibold mb-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
                  ⚠ Minimum order is {product.minOrderQty} {product.unit}. Please increase quantity.
                </p>
              )}

              {/* Live Savings Calculator */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">MRP ({qty} {product.unit})</span>
                  <span className="text-gray-500 line-through">₹{(product.price * qty).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Bulk Discount ({product.bulkDiscount}%)</span>
                  <span className="text-green-600 font-semibold">-₹{savings.toLocaleString('en-IN', { maximumFractionDigits:0 })}</span>
                </div>
                <div className="border-t border-green-200 pt-2 mt-2 flex justify-between font-bold">
                  <span className="text-gray-900">You Pay</span>
                  <span className="text-green-700 text-lg">₹{totalPrice.toLocaleString('en-IN', { maximumFractionDigits:0 })}</span>
                </div>
                <p className="text-green-700 font-bold text-sm mt-2 text-center">🎉 You save ₹{savings.toLocaleString('en-IN', { maximumFractionDigits:0 })}!</p>
              </div>
            </div>

            {/* Delivery Slot */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <p className="font-bold text-gray-900 mb-3 flex items-center gap-2"><FiTruck />Select Delivery Slot</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setSlot('morning')}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${slot==='morning' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <FiSun className="text-yellow-500" />Morning (7–11 AM)
                </button>
                <button onClick={() => setSlot('evening')}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 font-semibold text-sm transition-all ${slot==='evening' ? 'border-blue-700 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <FiMoon className="text-blue-500" />Evening (4–8 PM)
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => { if(isValidQty) addToCart(product, qty); }}
              disabled={!isValidQty}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all duration-200 shadow-lg ${isValidQty ? 'btn-primary text-white hover:shadow-xl' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              <FiShoppingCart className="text-xl" />
              {isValidQty ? `Add ${qty} ${product.unit}s to Cart · ₹${totalPrice.toLocaleString('en-IN', {maximumFractionDigits:0})}` : `Min. ${product.minOrderQty} ${product.unit} required`}
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 justify-center">
              <span className="flex items-center gap-1"><FiShield className="text-green-600"/>Quality Assured</span>
              <span className="flex items-center gap-1"><FiTruck className="text-blue-600"/>Fast Delivery</span>
              <span className="flex items-center gap-1"><FiClock className="text-amber-600"/>Order by 2PM</span>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="section-title mb-6">More in {product.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map(p => (
                <Link key={p.id} to={`/products/${p.id}`} className="card p-4 group">
                  <img src={p.image} alt={p.name} className="w-full h-28 object-cover rounded-xl mb-3 group-hover:scale-105 transition-transform" />
                  <p className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">{p.name}</p>
                  <p className="text-green-700 font-bold">₹{p.price}/{p.unit}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
