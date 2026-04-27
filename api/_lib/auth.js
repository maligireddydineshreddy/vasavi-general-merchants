const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'vasavi-secret-key-2024';

function requireAuth(req, res) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Authentication required' });
    return null;
  }
  try {
    return jwt.verify(header.slice(7), JWT_SECRET);
  } catch {
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
    return null;
  }
}

module.exports = { requireAuth, JWT_SECRET };
