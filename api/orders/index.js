const { getPool } = require('../_lib/db');
const cors = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');

function toFrontend(o) {
  return {
    id: o.id,
    date: new Date(o.created_at).toISOString().slice(0, 10),
    status: o.status,
    total: parseFloat(o.total),
    items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
    deliverySlot: o.delivery_slot,
    address: o.address,
  };
}

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  const pool = getPool();

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
        [user.userId]
      );
      res.json({ success: true, data: rows.map(toFrontend) });
    } catch (err) {
      console.error('Get orders error:', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }

  } else if (req.method === 'POST') {
    try {
      const { items, total, deliverySlot, address } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
      }
      if (!total || total <= 0) {
        return res.status(400).json({ success: false, error: 'Invalid order total' });
      }

      const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = $1', [user.userId]);
      const dbUser = userRows[0];
      const orderId = `ORD-${Date.now()}`;
      const deliveryAddress = address || dbUser?.address || 'Address not provided';

      const { rows } = await pool.query(
        'INSERT INTO orders (id, user_id, status, total, items, delivery_slot, address) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [orderId, user.userId, 'Pending', total, JSON.stringify(items), deliverySlot || 'Morning', deliveryAddress]
      );

      await pool.query('UPDATE users SET credit_used = credit_used + $1 WHERE id = $2', [total, user.userId]);

      res.status(201).json({ success: true, data: toFrontend(rows[0]) });
    } catch (err) {
      console.error('Place order error:', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }

  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
};
