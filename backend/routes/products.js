const express = require('express');
const db = require('../db');

const router = express.Router();

function toFrontend(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    unit: p.unit,
    stock: p.stock,
    minOrderQty: p.min_order_qty,
    bulkDiscount: p.bulk_discount,
    demand: p.demand,
    image: p.image,
    description: p.description,
  };
}

// GET /api/products?category=&search=&sort=
router.get('/', (req, res) => {
  const { category, search, sort } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (search) { sql += ' AND (name LIKE ? OR category LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  if (sort === 'price_asc') sql += ' ORDER BY price ASC';
  else if (sort === 'price_desc') sql += ' ORDER BY price DESC';
  else if (sort === 'discount') sql += ' ORDER BY bulk_discount DESC';
  else if (sort === 'name') sql += ' ORDER BY name ASC';
  else sql += ' ORDER BY id ASC';

  const products = db.prepare(sql).all(...params).map(toFrontend);
  res.json({ success: true, data: products });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  res.json({ success: true, data: toFrontend(product) });
});

module.exports = router;
