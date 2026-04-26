import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiChevronDown, FiChevronUp, FiSearch, FiRefreshCw } from 'react-icons/fi';

const STATUS_CONFIG = {
  Delivered: { icon: <FiCheckCircle />, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', steps: 3 },
  Shipped:   { icon: <FiTruck />,       color: 'text-blue-600',  bg: 'bg-blue-50',  border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700',  steps: 2 },
  Pending:   { icon: <FiClock />,       color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', steps: 1 },
};

const STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getOrders();
      setOrders(res.data);
    } catch (err) {
      setError(err.error || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filters = ['All', 'Pending', 'Shipped', 'Delivered'];
  const filtered = orders.filter(o => {
    const matchStatus = filter === 'All' || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading your orders...</p>
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="section-title text-3xl mb-2">My Orders</h1>
            <p className="text-gray-500">Track and manage your wholesale orders</p>
          </div>
          <button onClick={fetchOrders}
            className="flex items-center gap-1.5 text-sm text-blue-700 font-semibold hover:underline mt-1">
            <FiRefreshCw className="text-xs" /> Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6 text-red-700 font-semibold text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by order ID..." className="input-field pl-11" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-blue-900 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiPackage className="text-5xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-bold text-lg">
              {orders.length === 0 ? 'No orders yet — start shopping!' : 'No orders found'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
              const open = expanded === order.id;
              return (
                <div key={order.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${cfg.border}`}>
                  <button className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    onClick={() => setExpanded(open ? null : order.id)}>
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 ${cfg.bg} ${cfg.border} border rounded-xl flex items-center justify-center ${cfg.color} text-xl flex-shrink-0`}>
                        {cfg.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-gray-900 font-display">{order.id}</p>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${cfg.badge}`}>{order.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{order.date} · {order.deliverySlot} delivery</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right hidden sm:block">
                        <p className="font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500">{order.items.length} items</p>
                      </div>
                      {open ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
                    </div>
                  </button>

                  {open && (
                    <div className="border-t border-gray-100 p-5 animate-fade-in">
                      <div className="mb-6">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Order Tracking</p>
                        <div className="flex items-center gap-0">
                          {STEPS.map((step, i) => {
                            const done = i < cfg.steps;
                            const active = i === cfg.steps - 1;
                            return (
                              <React.Fragment key={step}>
                                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${done ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-200 text-gray-400'} ${active ? 'ring-4 ring-green-100' : ''}`}>
                                    {done ? '✓' : i + 1}
                                  </div>
                                  <p className={`text-xs font-semibold text-center leading-tight w-16 ${done ? 'text-green-700' : 'text-gray-400'}`}>{step}</p>
                                </div>
                                {i < STEPS.length - 1 && (
                                  <div className={`flex-1 h-0.5 mb-5 mx-1 rounded-full ${i < cfg.steps - 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3">
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.qty} × ₹{item.price}</p>
                              </div>
                              <p className="font-bold text-gray-900">₹{(item.qty * item.price).toLocaleString('en-IN')}</p>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold">
                          <span className="text-gray-700">Order Total</span>
                          <span className="text-green-700 text-lg">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {order.address && (
                        <div className="mt-4 bg-blue-50 rounded-xl p-4 text-sm">
                          <p className="font-semibold text-blue-800">📍 {order.address}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
