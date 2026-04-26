const { getPool } = require('../_lib/db');
const cors = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const user = requireAuth(req, res);
  if (!user) return;

  try {
    const pool = getPool();
    const { rows: orders } = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [user.userId]
    );
    const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = $1', [user.userId]);
    const dbUser = userRows[0];

    const totalOrders = orders.length;
    const totalSpend = orders.reduce((s, o) => s + parseFloat(o.total), 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSpend / totalOrders) : 0;

    // Monthly spend (last 6 months)
    const now = new Date();
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlySales = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const spend = orders
        .filter(o => {
          const d2 = new Date(o.created_at);
          return d2.getFullYear() === year && d2.getMonth() + 1 === month;
        })
        .reduce((s, o) => s + parseFloat(o.total), 0);
      monthlySales.push({ month: monthNames[d.getMonth()], spend: Math.round(spend) });
    }

    // Current month spend
    const monthlySpend = monthlySales[monthlySales.length - 1].spend;

    // Category spend
    const categoryTotals = {};
    for (const order of orders) {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      for (const item of items) {
        const cat = item.category || 'Other';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + item.price * item.qty;
      }
    }
    const categorySpend = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Top product
    const productQty = {};
    for (const order of orders) {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      for (const item of items) {
        productQty[item.name] = (productQty[item.name] || 0) + item.qty;
      }
    }
    const topProduct = Object.entries(productQty).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Weekly orders
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const weeklyOrders = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const count = orders.filter(o => new Date(o.created_at).toISOString().slice(0, 10) === dateStr).length;
      weeklyOrders.push({ day: dayNames[d.getDay()], orders: count });
    }

    // Credit data
    const creditData = {
      limit: parseFloat(dbUser?.credit_limit || 100000),
      used: parseFloat(dbUser?.credit_used || 0),
      dueDate: dbUser?.credit_due_date || '',
      transactions: orders.slice(0, 6).map(o => ({
        date: new Date(o.created_at).toISOString().slice(0, 10),
        amount: parseFloat(o.total),
        type: 'debit',
        ref: o.id,
      })),
    };

    res.json({
      success: true,
      data: {
        totalOrders, monthlySpend, avgOrderValue, topProduct,
        monthlySales, categorySpend, weeklyOrders, creditData,
        recentOrders: orders.slice(0, 5).map(o => ({
          id: o.id,
          date: new Date(o.created_at).toISOString().slice(0, 10),
          status: o.status,
          total: parseFloat(o.total),
          items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
        })),
      },
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
