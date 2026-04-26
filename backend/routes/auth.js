const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'vasavi-secret-key-2024';
const TOKEN_TTL = '7d';

function makeToken(user) {
  return jwt.sign(
    { userId: user.id, phone: user.phone, name: user.name, shop: user.shop },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

function safeUser(user) {
  const { password_hash, ...rest } = user;
  return rest;
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
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

  const existing = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
  if (existing) {
    return res.status(409).json({ success: false, error: 'Phone number already registered' });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const result = db.prepare(
    'INSERT INTO users (name, shop, phone, password_hash) VALUES (?, ?, ?, ?)'
  ).run(name, shop || '', phone, password_hash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = makeToken(user);
  res.status(201).json({ success: true, token, user: safeUser(user) });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ success: false, error: 'Phone and password are required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE phone = ?').get(phone);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid phone number or password' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ success: false, error: 'Invalid phone number or password' });
  }

  const token = makeToken(user);
  res.json({ success: true, token, user: safeUser(user) });
});

module.exports = router;
