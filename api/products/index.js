const { getPool } = require('../_lib/db');
const cors = require('../_lib/cors');

function toFrontend(p) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: parseFloat(p.price),
    unit: p.unit,
    stock: p.stock,
    minOrderQty: p.min_order_qty,
    bulkDiscount: parseFloat(p.bulk_discount),
    demand: p.demand,
    image: p.image,
    description: p.description,
  };
}

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { category, search, sort } = req.query;
    const pool = getPool();

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];
    let idx = 1;

    if (category) { sql += ` AND category = $${idx++}`; params.push(category); }
    if (search) { sql += ` AND (name ILIKE $${idx} OR category ILIKE $${idx++})`; params.push(`%${search}%`); }

    if (sort === 'price_asc') sql += ' ORDER BY price ASC';
    else if (sort === 'price_desc') sql += ' ORDER BY price DESC';
    else if (sort === 'discount') sql += ' ORDER BY bulk_discount DESC';
    else if (sort === 'name') sql += ' ORDER BY name ASC';
    else sql += ' ORDER BY id ASC';

    const { rows } = await pool.query(sql, params);
    res.json({ success: true, data: rows.map(toFrontend) });
  } catch (err) {
    console.error('Products error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
