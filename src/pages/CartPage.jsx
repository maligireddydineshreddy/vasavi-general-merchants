import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiTag, FiTruck } from 'react-icons/fi';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal, cartOriginalTotal, cartSavings, clearCart, user, showNotification } = useApp();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  if (cart.length === 0) return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center py-24 animate-fade-in">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiShoppingBag className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 font-display">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add products to start your bulk order</p>
        <Link to="/products" className="btn-primary px-8 py-3 text-base">Browse Products</Link>
      </div>
    </div>
  );

  const freeDelivery = cartTotal >= 5000;
  const remaining = Math.max(0, 5000 - cartTotal);
  const deliveryCharge = freeDelivery ? 0 : 150;
  const finalTotal = cartTotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const items = cart.map(item => ({
        name: item.name,
        qty: item.qty,
        price: Math.round(item.price * (1 - (item.bulkDiscount || 0) / 100)),
        category: item.category,
      }));
      await api.placeOrder(items, finalTotal, 'Morning', user?.address || '');
      showNotification('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (err) {
      showNotification(err.error || 'Failed to place order. Please try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title text-3xl">Shopping Cart</h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-semibold hover:underline">
            Clear All
          </button>
        </div>

        {/* Free delivery banner */}
        {!freeDelivery && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3">
            <FiTruck className="text-amber-600 text-xl flex-shrink-0" />
            <p className="text-amber-700 text-sm font-semibold">
              Add ₹{remaining.toLocaleString('en-IN', { maximumFractionDigits: 0 })} more for <span className="font-bold">FREE delivery</span>!
            </p>
          </div>
        )}
        {freeDelivery && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 mb-6 flex items-center gap-3">
            <FiTruck className="text-green-600 text-xl flex-shrink-0" />
            <p className="text-green-700 text-sm font-bold">🎉 You've unlocked FREE delivery!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => {
              const discounted = item.price * (1 - (item.bulkDiscount || 0) / 100);
              const itemTotal = discounted * item.qty;
              const itemSavings = (item.price - discounted) * item.qty;
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex gap-4 animate-fade-in">
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                    <img src={item.image} alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&q=80'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-xs font-semibold text-blue-700 mb-0.5">{item.category}</p>
                        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{item.name}</h3>
                        <p className="text-xs text-gray-500">₹{discounted.toFixed(0)}/{item.unit} <span className="line-through text-gray-400">₹{item.price}</span></p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0">
                        <FiTrash2 />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-green-500 hover:text-green-700 transition-all">
                          <FiMinus className="text-xs" />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-green-500 hover:text-green-700 transition-all">
                          <FiPlus className="text-xs" />
                        </button>
                        <span className="text-gray-500 text-xs">{item.unit}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{itemTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                        {itemSavings > 0 && <p className="text-xs text-green-600 font-semibold">Save ₹{itemSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>}
                      </div>
                    </div>

                    {item.qty < item.minOrderQty && (
                      <p className="text-xs text-amber-600 font-semibold mt-2 bg-amber-50 px-3 py-1 rounded-lg">
                        ⚠ Min. order: {item.minOrderQty} {item.unit}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal (MRP)</span>
                  <span className="text-gray-500 line-through">₹{cartOriginalTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1"><FiTag className="text-green-600" />Bulk Discount</span>
                  <span className="text-green-600 font-semibold">-₹{cartSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1"><FiTruck />Delivery</span>
                  <span className={freeDelivery ? 'text-green-600 font-semibold' : 'text-gray-900 font-semibold'}>{freeDelivery ? 'FREE' : '₹150'}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-700">₹{finalTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {cartSavings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 text-center">
                  <p className="text-green-700 font-bold text-sm">🎉 You save ₹{cartSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })} on this order!</p>
                </div>
              )}

              <button onClick={handlePlaceOrder} disabled={placing}
                className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-70">
                {placing ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Placing Order...</span></>
                ) : (
                  <><span>Place Order</span><FiArrowRight /></>
                )}
              </button>

              <Link to="/products" className="block text-center text-sm text-green-700 font-semibold mt-4 hover:underline">
                + Add more products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
