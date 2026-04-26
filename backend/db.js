const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'vasavi.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ──────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    shop TEXT DEFAULT '',
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    address TEXT DEFAULT '',
    credit_limit REAL DEFAULT 100000,
    credit_used REAL DEFAULT 0,
    credit_due_date TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    unit TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    min_order_qty INTEGER NOT NULL DEFAULT 1,
    bulk_discount REAL DEFAULT 0,
    demand TEXT DEFAULT 'medium',
    image TEXT DEFAULT '',
    description TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status TEXT DEFAULT 'Pending',
    total REAL NOT NULL,
    items TEXT NOT NULL,
    delivery_slot TEXT DEFAULT 'Morning',
    address TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// ── Seed products (runs only if table is empty) ──────────────────────────────

const productCount = db.prepare('SELECT COUNT(*) as c FROM products').get().c;

if (productCount === 0) {
  const insert = db.prepare(`
    INSERT INTO products (id, name, category, price, unit, stock, min_order_qty, bulk_discount, demand, image, description)
    VALUES (@id, @name, @category, @price, @unit, @stock, @min_order_qty, @bulk_discount, @demand, @image, @description)
  `);

  const seedProducts = [
    { id:1, name:"Basmati Rice Premium", category:"Rice", price:85, unit:"kg", stock:500, min_order_qty:25, bulk_discount:8, demand:"high", image:"https://plus.unsplash.com/premium_photo-1723925093264-40b6b957c44d?w=400&q=80", description:"Long-grain aromatic basmati rice, aged 2 years for perfect texture and fragrance." },
    { id:2, name:"Sona Masoori Rice", category:"Rice", price:52, unit:"kg", stock:800, min_order_qty:25, bulk_discount:6, demand:"medium", image:"https://images.unsplash.com/photo-1643622357625-c013987d90e7?w=400&q=80", description:"Medium-grain lightweight rice, ideal for daily cooking. South Indian favourite." },
    { id:3, name:"Brown Rice Organic", category:"Rice", price:95, unit:"kg", stock:120, min_order_qty:10, bulk_discount:5, demand:"low", image:"https://plus.unsplash.com/premium_photo-1675814316651-3ce3c6409922?w=400&q=80", description:"Whole grain brown rice, rich in fibre and nutrients. Health-conscious choice." },
    { id:4, name:"Ponni Boiled Rice", category:"Rice", price:45, unit:"kg", stock:1000, min_order_qty:50, bulk_discount:7, demand:"medium", image:"https://images.unsplash.com/photo-1673158190671-cd4e3baffbec?w=400&q=80", description:"Traditional parboiled rice, firm texture, widely used across South India." },
    { id:5, name:"Kolam Rice", category:"Rice", price:48, unit:"kg", stock:600, min_order_qty:25, bulk_discount:6, demand:"medium", image:"https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80", description:"Short-grain soft rice, perfect for khichdi and everyday meals." },
    { id:6, name:"Aashirvaad Atta (Wheat Flour)", category:"Flour", price:38, unit:"kg", stock:300, min_order_qty:50, bulk_discount:10, demand:"high", image:"https://plus.unsplash.com/premium_photo-1671377375657-5286f40ec0c7?w=400&q=80", description:"Whole wheat flour made from 100% whole wheat. Perfect for soft rotis and parathas." },
    { id:7, name:"Maida (Refined Flour)", category:"Flour", price:32, unit:"kg", stock:400, min_order_qty:50, bulk_discount:8, demand:"medium", image:"https://images.unsplash.com/photo-1590346336252-db96eccfd44e?w=400&q=80", description:"Fine-milled refined wheat flour for bakery, naan and snacks." },
    { id:8, name:"Besan (Chickpea Flour)", category:"Flour", price:58, unit:"kg", stock:200, min_order_qty:25, bulk_discount:6, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1726750932931-5072007889af?w=400&q=80", description:"High-protein chickpea flour for pakoras, batter and sweets." },
    { id:9, name:"Ragi Flour (Finger Millet)", category:"Flour", price:65, unit:"kg", stock:150, min_order_qty:10, bulk_discount:5, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1671130295829-23e2b49874a2?w=400&q=80", description:"Calcium-rich finger millet flour for healthy rotis and porridge." },
    { id:10, name:"Sunflower Refined Oil", category:"Oils", price:130, unit:"litre", stock:400, min_order_qty:20, bulk_discount:9, demand:"high", image:"https://plus.unsplash.com/premium_photo-1668616815449-b61c3f4d4f44?w=400&q=80", description:"Light refined sunflower oil, low cholesterol, ideal for everyday cooking." },
    { id:11, name:"Groundnut Oil Cold Pressed", category:"Oils", price:180, unit:"litre", stock:200, min_order_qty:10, bulk_discount:7, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1700156447925-00845509812e?w=400&q=80", description:"Traditional cold-pressed groundnut oil with rich flavour and aroma." },
    { id:12, name:"Mustard Oil", category:"Oils", price:150, unit:"litre", stock:250, min_order_qty:10, bulk_discount:6, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1693142331923-6f2cc7400c6a?w=400&q=80", description:"Pungent mustard oil widely used in North Indian and Bengali cooking." },
    { id:13, name:"Coconut Oil Pure", category:"Oils", price:220, unit:"litre", stock:180, min_order_qty:10, bulk_discount:6, demand:"low", image:"https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&q=80", description:"Virgin coconut oil, unrefined, ideal for South Indian cooking and hair care." },
    { id:14, name:"Vanaspati Ghee (Dalda)", category:"Oils", price:110, unit:"kg", stock:300, min_order_qty:20, bulk_discount:8, demand:"medium", image:"https://images.unsplash.com/photo-1573812461383-e5f8b759d12e?w=400&q=80", description:"Hydrogenated vegetable fat for commercial bakery and frying." },
    { id:15, name:"Toor Dal (Arhar)", category:"Pulses", price:115, unit:"kg", stock:350, min_order_qty:25, bulk_discount:8, demand:"high", image:"https://plus.unsplash.com/premium_photo-1701064865162-db655bfb998f?w=400&q=80", description:"Yellow split pigeon peas, protein-rich staple used in sambar and dal." },
    { id:16, name:"Moong Dal Yellow Split", category:"Pulses", price:108, unit:"kg", stock:280, min_order_qty:25, bulk_discount:7, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1674025751520-01102eca6352?w=400&q=80", description:"Easily digestible yellow moong dal, great for khichdi and soups." },
    { id:17, name:"Chana Dal", category:"Pulses", price:95, unit:"kg", stock:320, min_order_qty:25, bulk_discount:7, demand:"medium", image:"https://images.unsplash.com/photo-1633857462464-013f740de54b?w=400&q=80", description:"Split Bengal gram with nutty flavour, used in curries and snacks." },
    { id:18, name:"Masoor Dal Red", category:"Pulses", price:98, unit:"kg", stock:260, min_order_qty:25, bulk_discount:6, demand:"medium", image:"https://images.unsplash.com/photo-1730591857303-0fa44be3f677?w=400&q=80", description:"Red lentils that cook quickly, perfect for soups and tadka dal." },
    { id:19, name:"Urad Dal Black Whole", category:"Pulses", price:120, unit:"kg", stock:180, min_order_qty:10, bulk_discount:6, demand:"medium", image:"https://images.unsplash.com/photo-1612708024740-468e1e27b4e7?w=400&q=80", description:"Whole black gram for Dal Makhani, rich in protein and iron." },
    { id:20, name:"Rajma (Kidney Beans)", category:"Pulses", price:105, unit:"kg", stock:200, min_order_qty:10, bulk_discount:6, demand:"medium", image:"https://images.unsplash.com/photo-1733562256707-c13261bfd0a9?w=400&q=80", description:"Red kidney beans, favourite for rajma chawal. High in protein." },
    { id:21, name:"Sugar Refined (S30)", category:"Sugar & Salt", price:42, unit:"kg", stock:2000, min_order_qty:100, bulk_discount:12, demand:"high", image:"https://images.unsplash.com/photo-1559659015-6b35f4db6b4b?w=400&q=80", description:"Fine-grain refined white sugar, ideal for all food service and retail." },
    { id:22, name:"Jaggery Powder (Gud)", category:"Sugar & Salt", price:68, unit:"kg", stock:300, min_order_qty:25, bulk_discount:7, demand:"medium", image:"https://images.unsplash.com/photo-1775817590687-f1da5d70d9ad?w=400&q=80", description:"Natural unrefined jaggery powder, rich in minerals, no preservatives." },
    { id:23, name:"Iodised Salt (Tata)", category:"Sugar & Salt", price:18, unit:"kg", stock:5000, min_order_qty:100, bulk_discount:10, demand:"medium", image:"https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&q=80", description:"Fine-grain iodised salt, essential daily staple for every household." },
    { id:24, name:"Rock Salt (Sendha Namak)", category:"Sugar & Salt", price:35, unit:"kg", stock:400, min_order_qty:25, bulk_discount:6, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1726079119122-eea1b0741c6f?w=400&q=80", description:"Pure mineral rock salt used in fasting and Ayurvedic cooking." },
    { id:25, name:"Brooke Bond Taj Mahal Tea", category:"Tea & Coffee", price:420, unit:"kg", stock:150, min_order_qty:5, bulk_discount:5, demand:"high", image:"https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", description:"Premium CTC tea with rich aroma and strong taste. Best seller." },
    { id:26, name:"Green Tea Leaves", category:"Tea & Coffee", price:550, unit:"kg", stock:80, min_order_qty:2, bulk_discount:4, demand:"medium", image:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80", description:"Unfermented green tea with antioxidant properties. Health segment." },
    { id:27, name:"Nescafe Classic Coffee", category:"Tea & Coffee", price:680, unit:"kg", stock:100, min_order_qty:2, bulk_discount:5, demand:"medium", image:"https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80", description:"Rich instant coffee with bold taste, popular in cafes and canteens." },
    { id:28, name:"Filter Coffee Powder", category:"Tea & Coffee", price:390, unit:"kg", stock:120, min_order_qty:5, bulk_discount:5, demand:"medium", image:"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80", description:"Traditional South Indian filter coffee blend of coffee and chicory." },
    { id:29, name:"Turmeric Powder (Haldi)", category:"Spices", price:145, unit:"kg", stock:200, min_order_qty:10, bulk_discount:7, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1723806018929-c6d48a3b82d7?w=400&q=80", description:"Bright yellow turmeric powder, high curcumin content, pure quality." },
    { id:30, name:"Red Chilli Powder", category:"Spices", price:165, unit:"kg", stock:180, min_order_qty:10, bulk_discount:7, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1723759268094-df26a0e6757c?w=400&q=80", description:"Bold red chilli powder with medium-high heat level, vibrant colour." },
    { id:31, name:"Coriander Powder (Dhaniya)", category:"Spices", price:130, unit:"kg", stock:220, min_order_qty:10, bulk_discount:6, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1726072358351-b01ffa2f830b?w=400&q=80", description:"Aromatic ground coriander, essential base spice for Indian curries." },
    { id:32, name:"Cumin Seeds (Jeera)", category:"Spices", price:220, unit:"kg", stock:160, min_order_qty:5, bulk_discount:5, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1722686499744-59e1bcf902a6?w=400&q=80", description:"Premium whole cumin seeds for tempering and masala blends." },
    { id:33, name:"Garam Masala Blend", category:"Spices", price:280, unit:"kg", stock:130, min_order_qty:5, bulk_discount:5, demand:"medium", image:"https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", description:"Aromatic blend of 11 premium spices. Restaurant-grade quality." },
    { id:34, name:"Black Pepper Whole", category:"Spices", price:480, unit:"kg", stock:90, min_order_qty:5, bulk_discount:4, demand:"low", image:"https://plus.unsplash.com/premium_photo-1668447610065-d9f926040f24?w=400&q=80", description:"Malabar black pepper, strong pungency and bold aroma." },
    { id:35, name:"Parle-G Glucose Biscuits", category:"Snacks", price:10, unit:"pack", stock:2000, min_order_qty:100, bulk_discount:12, demand:"high", image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80", description:"India's most loved glucose biscuit. High turnover retail product." },
    { id:36, name:"Britannia Good Day Cashew", category:"Snacks", price:30, unit:"pack", stock:1000, min_order_qty:50, bulk_discount:9, demand:"medium", image:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=80", description:"Butter cookies loaded with cashews. Premium gifting and retail." },
    { id:37, name:"Lays Classic Salted Chips", category:"Snacks", price:20, unit:"pack", stock:1500, min_order_qty:100, bulk_discount:10, demand:"medium", image:"https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80", description:"Crispy potato chips with light salt, high retail demand year-round." },
    { id:38, name:"Haldiram's Mixture Namkeen", category:"Snacks", price:35, unit:"pack", stock:800, min_order_qty:50, bulk_discount:8, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1725384940666-8c04394eda4d?w=400&q=80", description:"Classic Indian savory mix with bhujia, peanuts and sev." },
    { id:39, name:"Roasted Peanuts Salted", category:"Snacks", price:85, unit:"kg", stock:400, min_order_qty:25, bulk_discount:7, demand:"medium", image:"https://images.unsplash.com/photo-1567892737950-30c4db39a4f7?w=400&q=80", description:"Crunchy salted roasted peanuts, high-protein affordable snack." },
    { id:40, name:"Poha (Flattened Rice)", category:"Grains", price:55, unit:"kg", stock:350, min_order_qty:25, bulk_discount:6, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1725878973520-f067b4613505?w=400&q=80", description:"Thick/thin flattened rice for poha, chivda and breakfast." },
    { id:41, name:"Vermicelli (Seviyan)", category:"Grains", price:62, unit:"kg", stock:300, min_order_qty:25, bulk_discount:6, demand:"medium", image:"https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&q=80", description:"Wheat vermicelli for kheer, upma and sweet dishes." },
    { id:42, name:"Semolina (Sooji/Rava)", category:"Grains", price:40, unit:"kg", stock:450, min_order_qty:25, bulk_discount:7, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1671377660174-e43996bfdf03?w=400&q=80", description:"Coarse wheat semolina for upma, halwa, idli and bakery use." },
    { id:43, name:"Daliya (Broken Wheat)", category:"Grains", price:48, unit:"kg", stock:280, min_order_qty:25, bulk_discount:6, demand:"medium", image:"https://plus.unsplash.com/premium_photo-1705146640690-00b70943c318?w=400&q=80", description:"Nutrient-dense broken wheat for porridge and health-conscious segments." },
    { id:44, name:"Tamarind (Imli) Block", category:"Spices", price:90, unit:"kg", stock:200, min_order_qty:10, bulk_discount:5, demand:"medium", image:"https://images.unsplash.com/photo-1677938578361-3398b297ea7f?w=400&q=80", description:"Seedless tamarind block with intense sour flavour for chutneys and sambar." },
    { id:45, name:"Dry Red Chilli Whole", category:"Spices", price:160, unit:"kg", stock:150, min_order_qty:10, bulk_discount:6, demand:"low", image:"https://images.unsplash.com/photo-1625921133217-8d978f7872b8?w=400&q=80", description:"Sun-dried whole red chillies for authentic tempering and pickling." },
  ];

  const insertMany = db.transaction((products) => {
    for (const p of products) insert.run(p);
  });
  insertMany(seedProducts);
  console.log('Products seeded.');
}

module.exports = db;
