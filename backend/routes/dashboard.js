const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/dashboard/stats
router.get('/stats', (req, res) => {
  const userId = req.user.userId;

  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

  const totalOrders = orders.length;
  const totalSpend = orders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0;

  // Monthly spend (last 6 months)
  const now = new Date();
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlySales = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const monthStr = String(month).padStart(2, '0');
    const spend = orders
      .filter(o => o.created_at.startsWith(`${year}-${monthStr}`))
      .reduce((s, o) => s + o.total, 0);
    monthlySales.push({ month: monthNames[d.getMonth()], spend });
  }

  // Current month spend
  const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const monthlySpend = orders
    .filter(o => o.created_at.startsWith(thisMonthStr))
    .reduce((s, o) => s + o.total, 0);

  // Spend by category (across all orders)
  const categoryTotals = {};
  for (const order of orders) {
    const items = JSON.parse(order.items);
    for (const item of items) {
      const cat = item.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (item.price * item.qty);
    }
  }
  const categorySpend = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Top product
  const productQty = {};
  for (const order of orders) {
    for (const item of JSON.parse(order.items)) {
      productQty[item.name] = (productQty[item.name] || 0) + item.qty;
    }
  }
  const topProduct = Object.entries(productQty).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Weekly orders (last 7 days)
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const weeklyOrders = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const count = orders.filter(o => o.created_at.startsWith(dateStr)).length;
    weeklyOrders.push({ day: dayNames[d.getDay()], orders: count });
  }

  // Credit data
  const creditData = {
    limit: user.credit_limit,
    used: user.credit_used,
    dueDate: user.credit_due_date || '',
    transactions: orders.slice(0, 6).map(o => ({
      date: o.created_at.slice(0, 10),
      amount: o.total,
      type: 'debit',
      ref: o.id,
    })),
  };

  res.json({
    success: true,
    data: {
      totalOrders,
      monthlySpend,
      avgOrderValue,
      topProduct,
      monthlySales,
      categorySpend,
      weeklyOrders,
      creditData,
      recentOrders: orders.slice(0, 5).map(o => ({
        id: o.id,
        date: o.created_at.slice(0, 10),
        status: o.status,
        total: o.total,
        items: JSON.parse(o.items),
      })),
    },
  });
});

module.exports = router;
