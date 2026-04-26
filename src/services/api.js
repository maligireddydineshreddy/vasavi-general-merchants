// ============================================================
// API Service — Mock implementation (swap with real API later)
// ============================================================
import { products } from '../data/products';
import { mockOrders } from '../data/orders';

const delay = (ms = 500) => new Promise(res => setTimeout(res, ms));

export const api = {
  getProducts: async () => { await delay(400); return { data: products, success: true }; },
  getProductById: async (id) => { await delay(300); const p = products.find(p=>p.id===+id); return p ? { data:p, success:true } : { error:'Not found', success:false }; },
  getOrders: async () => { await delay(500); return { data: mockOrders, success: true }; },
  postCart: async (items) => { await delay(300); return { data: { orderId:`ORD-${Date.now()}`, items, status:'Pending' }, success: true }; },
  searchProducts: async (q) => { await delay(200); return { data: products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())), success:true }; },
};
