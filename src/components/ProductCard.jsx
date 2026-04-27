import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FiShoppingCart, FiZap, FiAlertTriangle } from 'react-icons/fi';

export default function ProductCard({ product }) {
  const { addToCart } = useApp();
  const discountedPrice = product.price * (1 - (product.bulkDiscount || 0) / 100);

  return (
    <div className="card group cursor-pointer">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden h-44 bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = `https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80`; }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.demand === 'high' && (
            <span className="badge-hot flex items-center gap-1"><FiZap className="text-xs" />Hot</span>
          )}
          {product.stock < 150 && (
            <span className="badge-low flex items-center gap-1"><FiAlertTriangle className="text-xs" />Low Stock</span>
          )}
        </div>
        {/* Discount badge */}
        {product.bulkDiscount > 0 && (
          <div className="absolute top-2 right-2 bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {product.bulkDiscount}% OFF
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-green-700 transition-colors line-clamp-2 font-display">{product.name}</h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-gray-900">₹{discountedPrice.toFixed(0)}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
          <span className="text-xs text-gray-500">/{product.unit}</span>
        </div>

        <p className="text-xs text-gray-500 mb-3">Min. order: <span className="font-semibold text-gray-700">{product.minOrderQty} {product.unit}</span></p>

        {/* Add to cart */}
        <button
          onClick={() => addToCart(product)}
          className="w-full btn-primary text-sm flex items-center justify-center gap-2 py-2">
          <FiShoppingCart />Add to Cart
        </button>
      </div>
    </div>
  );
}
