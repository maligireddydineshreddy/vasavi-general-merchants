const { getPool } = require('../_lib/db');
const cors = require('../_lib/cors');

module.exports = async (req, res) => {
  if (cors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const { id } = req.query;
    const pool = getPool();
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Product not found' });

    const p = rows[0];
    res.json({
      success: true,
      data: {
        id: p.id, name: p.name, category: p.category,
        price: parseFloat(p.price), unit: p.unit, stock: p.stock,
        minOrderQty: p.min_order_qty, bulkDiscount: parseFloat(p.bulk_discount),
        demand: p.demand, image: p.image, description: p.description,
      },
    });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
