export const mockOrders = [
  { id:"ORD-2024-001", date:"2024-01-15", status:"Delivered", total:12450, items:[
    { name:"Basmati Rice Premium", qty:50, price:85 }, { name:"Toor Dal", qty:25, price:115 }, { name:"Sunflower Oil", qty:20, price:130 }
  ], deliverySlot:"Morning", address:"Shop No. 14, Gandhi Market, Hyderabad" },
  { id:"ORD-2024-002", date:"2024-01-22", status:"Shipped", total:8920, items:[
    { name:"Sugar Refined", qty:100, price:42 }, { name:"Iodised Salt", qty:50, price:18 }, { name:"Wheat Flour", qty:100, price:38 }
  ], deliverySlot:"Evening", address:"Shop No. 14, Gandhi Market, Hyderabad" },
  { id:"ORD-2024-003", date:"2024-02-03", status:"Pending", total:15680, items:[
    { name:"Sona Masoori Rice", qty:100, price:52 }, { name:"Sunflower Oil", qty:40, price:130 }, { name:"Toor Dal", qty:25, price:115 }
  ], deliverySlot:"Morning", address:"Shop No. 14, Gandhi Market, Hyderabad" },
  { id:"ORD-2024-004", date:"2024-02-10", status:"Delivered", total:6230, items:[
    { name:"Parle-G Biscuits", qty:200, price:10 }, { name:"Lays Chips", qty:100, price:20 }, { name:"Haldiram's Mixture", qty:50, price:35 }
  ], deliverySlot:"Evening", address:"Shop No. 14, Gandhi Market, Hyderabad" },
  { id:"ORD-2024-005", date:"2024-02-18", status:"Delivered", total:18950, items:[
    { name:"Basmati Rice", qty:100, price:85 }, { name:"Groundnut Oil", qty:20, price:180 }, { name:"Garam Masala", qty:10, price:280 }
  ], deliverySlot:"Morning", address:"Shop No. 14, Gandhi Market, Hyderabad" },
  { id:"ORD-2024-006", date:"2024-03-05", status:"Delivered", total:9400, items:[
    { name:"Moong Dal", qty:25, price:108 }, { name:"Chana Dal", qty:25, price:95 }, { name:"Masoor Dal", qty:25, price:98 }
  ], deliverySlot:"Morning", address:"Shop No. 14, Gandhi Market, Hyderabad" },
];

export const creditData = {
  limit: 100000,
  used: 43200,
  dueDate: "2024-03-31",
  transactions: [
    { date:"2024-01-15", amount:12450, type:"debit", ref:"ORD-2024-001" },
    { date:"2024-01-22", amount:8920, type:"debit", ref:"ORD-2024-002" },
    { date:"2024-02-01", amount:25000, type:"credit", ref:"PMT-0201" },
    { date:"2024-02-03", amount:15680, type:"debit", ref:"ORD-2024-003" },
    { date:"2024-02-18", amount:18950, type:"debit", ref:"ORD-2024-005" },
    { date:"2024-03-01", amount:37800, type:"credit", ref:"PMT-0301" },
  ]
};

export const dashboardStats = {
  totalOrders: 47,
  monthlySpend: 71450,
  avgOrderValue: 10820,
  topProduct: "Basmati Rice Premium",
  monthlySales: [
    { month:"Aug", spend:42000 }, { month:"Sep", spend:55000 }, { month:"Oct", spend:48000 },
    { month:"Nov", spend:62000 }, { month:"Dec", spend:78000 }, { month:"Jan", spend:71450 },
  ],
  categorySpend: [
    { name:"Rice", value:28000 }, { name:"Oils", value:15000 }, { name:"Pulses", value:12000 },
    { name:"Flour", value:8000 }, { name:"Spices", value:5000 }, { name:"Snacks", value:3450 },
  ],
  weeklyOrders: [
    { day:"Mon", orders:3 }, { day:"Tue", orders:5 }, { day:"Wed", orders:2 },
    { day:"Thu", orders:7 }, { day:"Fri", orders:4 }, { day:"Sat", orders:6 }, { day:"Sun", orders:1 },
  ]
};
