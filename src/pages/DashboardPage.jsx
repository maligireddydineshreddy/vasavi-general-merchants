import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FiShoppingBag, FiTrendingUp, FiStar, FiCreditCard, FiPackage } from 'react-icons/fi';

const COLORS = ['#1e3a8a', '#15803d', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const StatCard = ({ icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white text-xl shadow-sm`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-gray-900 font-display mb-1">{value}</p>
    <p className="text-sm font-semibold text-gray-700">{label}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

export default function DashboardPage() {
  const { user } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getDashboardStats()
      .then(res => setStats(res.data))
      .catch(err => setError(err.error || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-900/20 border-t-blue-900 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    </div>
  );

  const { totalOrders, monthlySpend, avgOrderValue, topProduct, monthlySales, categorySpend, weeklyOrders, creditData, recentOrders } = stats;
  const creditUsedPct = creditData.limit > 0 ? (creditData.used / creditData.limit) * 100 : 0;
  const creditRemaining = creditData.limit - creditData.used;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="section-title text-3xl">Dashboard</h1>
          <p className="text-gray-500 mt-1">Business overview for <span className="font-semibold text-gray-700">{user?.shop || 'Your Shop'}</span></p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={<FiShoppingBag />} label="Total Orders" value={totalOrders}
            sub="All time" color="bg-blue-900" />
          <StatCard icon={<FiTrendingUp />} label="Monthly Spend" value={monthlySpend > 0 ? `₹${(monthlySpend / 1000).toFixed(1)}K` : '₹0'}
            sub="This month" color="bg-green-700" />
          <StatCard icon={<FiStar />} label="Top Product" value={topProduct !== 'N/A' ? topProduct.split(' ').slice(0, 2).join(' ') : 'N/A'}
            sub="Most ordered" color="bg-amber-500" />
          <StatCard icon={<FiPackage />} label="Avg Order Value" value={avgOrderValue > 0 ? `₹${(avgOrderValue / 1000).toFixed(1)}K` : '₹0'}
            sub="Per order" color="bg-purple-600" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-1">Monthly Spend Trend</h2>
            <p className="text-gray-500 text-xs mb-5">Last 6 months spending overview</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlySales} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={v => `₹${v / 1000}K`} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Spend']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="spend" stroke="#1e3a8a" strokeWidth={2.5} fill="url(#spendGrad)" dot={{ fill: '#1e3a8a', r: 4 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-1">Spend by Category</h2>
            <p className="text-gray-500 text-xs mb-4">All time</p>
            {categorySpend.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categorySpend} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                      dataKey="value" paddingAngle={3}>
                      {categorySpend.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, '']} contentStyle={{ borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {categorySpend.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-gray-600 font-medium">{item.name}</span>
                      </span>
                      <span className="font-bold text-gray-900">₹{(item.value / 1000).toFixed(1)}K</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">No spend data yet</div>
            )}
          </div>
        </div>

        {/* Weekly Orders + Credit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-1">Weekly Orders</h2>
            <p className="text-gray-500 text-xs mb-5">Orders placed this week</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyOrders} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                <Bar dataKey="orders" fill="#15803d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
              <FiCreditCard className="text-blue-700" />Credit Account
            </h2>
            {creditData.dueDate && <p className="text-gray-500 text-xs mb-5">Due date: {creditData.dueDate}</p>}

            <div className="space-y-4 mb-6">
              {[
                { label: 'Credit Limit', value: creditData.limit, color: 'text-gray-900' },
                { label: 'Amount Used', value: creditData.used, color: 'text-red-600' },
                { label: 'Available Credit', value: creditRemaining, color: 'text-green-700' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">{label}</span>
                  <span className={`font-bold text-base ${color}`}>₹{value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Used: {creditUsedPct.toFixed(1)}%</span>
                <span>Remaining: {(100 - creditUsedPct).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${creditUsedPct > 80 ? 'bg-red-500' : creditUsedPct > 60 ? 'bg-amber-500' : 'bg-green-600'}`}
                  style={{ width: `${Math.min(creditUsedPct, 100)}%` }}
                />
              </div>
            </div>

            <p className={`text-xs font-semibold mt-3 ${creditUsedPct > 80 ? 'text-red-600' : 'text-green-700'}`}>
              {creditUsedPct > 80 ? '⚠ Approaching credit limit! Please make a payment.' : '✓ Credit in good standing'}
            </p>

            {creditData.transactions.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Recent Orders</p>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {creditData.transactions.map((t, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">{t.ref} · {t.date}</span>
                      <span className="font-bold text-red-600">-₹{t.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-5">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No orders yet. Start shopping to see your order history here!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    {['Order ID', 'Date', 'Items', 'Amount', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map(order => {
                    const statusColors = { Delivered: 'text-green-700 bg-green-50', Shipped: 'text-blue-700 bg-blue-50', Pending: 'text-amber-700 bg-amber-50' };
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-gray-900 text-sm">{order.id}</td>
                        <td className="py-3 px-4 text-gray-500 text-sm">{order.date}</td>
                        <td className="py-3 px-4 text-gray-700 text-sm">{order.items.length} items</td>
                        <td className="py-3 px-4 font-bold text-gray-900">₹{order.total.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[order.status] || 'text-gray-700 bg-gray-50'}`}>{order.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
