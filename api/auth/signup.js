const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../_lib/db');
const cors = require('../_lib/cors');
const { JWT_SECRET } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { name, shop, phone, password } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, error: 'Name, phone and password are required' });
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, error: 'Phone must be a 10-digit number' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const pool = getPool();
    const existing = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Phone number already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, shop, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, shop || '', phone, password_hash]
    );
    const user = rows[0];

    const { password_hash: _, ...safeUser } = user;
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, name: user.name, shop: user.shop },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
