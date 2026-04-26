const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

function safeUser(user) {
  const { password_hash, ...rest } = user;
  return rest;
}

// GET /api/users/me
router.get('/me', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: safeUser(user) });
});

// PUT /api/users/me
router.put('/me', async (req, res) => {
  const { name, shop, address, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  const updates = {
    name: name || user.name,
    shop: shop !== undefined ? shop : user.shop,
    address: address !== undefined ? address : user.address,
    password_hash: user.password_hash,
  };

  if (password) {
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    updates.password_hash = await bcrypt.hash(password, 10);
  }

  db.prepare(
    'UPDATE users SET name = ?, shop = ?, address = ?, password_hash = ? WHERE id = ?'
  ).run(updates.name, updates.shop, updates.address, updates.password_hash, req.user.userId);

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.userId);
  res.json({ success: true, data: safeUser(updated) });
});

module.exports = router;
