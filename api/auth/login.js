const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('../_lib/db');
const cors = require('../_lib/cors');
const { JWT_SECRET } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ success: false, error: 'Phone and password are required' });
    }

    const pool = getPool();
    const { rows } = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, error: 'Invalid phone number or password' });
    }

    const { password_hash, ...safeUser } = user;
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, name: user.name, shop: user.shop },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
