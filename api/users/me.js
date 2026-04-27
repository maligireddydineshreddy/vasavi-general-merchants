const bcrypt = require('bcryptjs');
const { getPool } = require('../_lib/db');
const cors = require('../_lib/cors');
const { requireAuth } = require('../_lib/auth');

module.exports = async (req, res) => {
  if (cors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  const pool = getPool();

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [user.userId]);
      if (!rows[0]) return res.status(404).json({ success: false, error: 'User not found' });
      const { password_hash, ...safeUser } = rows[0];
      res.json({ success: true, data: safeUser });
    } catch (err) {
      console.error('Get user error:', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }

  } else if (req.method === 'PUT') {
    try {
      const { rows: existing } = await pool.query('SELECT * FROM users WHERE id = $1', [user.userId]);
      const dbUser = existing[0];
      if (!dbUser) return res.status(404).json({ success: false, error: 'User not found' });

      const { name, shop, address, password } = req.body;
      let password_hash = dbUser.password_hash;

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
        }
        password_hash = await bcrypt.hash(password, 10);
      }

      const { rows } = await pool.query(
        'UPDATE users SET name=$1, shop=$2, address=$3, password_hash=$4 WHERE id=$5 RETURNING *',
        [name || dbUser.name, shop !== undefined ? shop : dbUser.shop, address !== undefined ? address : dbUser.address, password_hash, user.userId]
      );
      const { password_hash: _, ...safeUser } = rows[0];
      res.json({ success: true, data: safeUser });
    } catch (err) {
      console.error('Update user error:', err);
      res.status(500).json({ success: false, error: 'Server error' });
    }

  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
};
