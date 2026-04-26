const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

function toFrontend(o) {
  return {
    id: o.id,
    date: o.created_at.slice(0, 10),
    status: o.status,
    total: o.total,
    items: JSON.parse(o.items),
    deliverySlot: o.delivery_slot,
    address: o.address,
  };
}

// GET /api/orders — current user's orders
router.get('/', (req, res) => {
  const orders = db.prepare(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user.userId);
  res.json({ success: true, data: orders.map(toFrontend) });
});

// POST /api/orders — place new order
router.post('/', (req, res) => {
  const { items, total, deliverySlot, address } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Order must contain at least one item' });
  }
  if (!total || total <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid order total' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
  const orderId = `ORD-${Date.now()}`;
  const deliveryAddress = address || user.address || 'Address not provided';

  db.prepare(
    'INSERT INTO orders (id, user_id, status, total, items, delivery_slot, address) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(orderId, req.user.userId, 'Pending', total, JSON.stringify(items), deliverySlot || 'Morning', deliveryAddress);

  // Update credit used for this user
  db.prepare('UPDATE users SET credit_used = credit_used + ? WHERE id = ?').run(total, req.user.userId);

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  res.status(201).json({ success: true, data: toFrontend(order) });
});

module.exports = router;
