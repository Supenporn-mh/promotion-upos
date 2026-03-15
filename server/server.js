import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock Data Source (In-Memory Database)
let promotionsData = [
  { id: 1, name: 'ลดสมาชิกใหม่ 15%', promo_code: 'NEW15', eligibility: 'MEMBER', promo_type: 'DISCOUNT', quota: 100, used_count: 45, status: 'ACTIVE', imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: 'ซื้อชาบู แถมโค้ก', promo_code: 'FREE-COKE', eligibility: 'ALL', promo_type: 'FREEBIE', quota: 50, used_count: 20, status: 'ACTIVE', imageUrl: '' },
  { id: 3, name: 'Happy Hour 1 แถม 1', promo_code: 'HH-BOGO', eligibility: 'ALL', promo_type: 'FREEBIE', quota: 0, used_count: 128, status: 'ACTIVE', imageUrl: '' },
  { id: 4, name: 'แลกซื้อน้ำดื่ม 5 บาท', promo_code: 'RDM-WATER', eligibility: 'ALL', promo_type: 'REDEMPTION', quota: 200, used_count: 180, status: 'ACTIVE', imageUrl: '' },
  { id: 5, name: 'ส่วนลดวันเกิด 20%', promo_code: 'BDAY20', eligibility: 'MEMBER', promo_type: 'DISCOUNT', quota: 10, used_count: 2, status: 'ACTIVE', imageUrl: '' },
  { id: 6, name: 'Seasonal Sale - Summer', promo_code: 'SUMMER24', eligibility: 'ALL', promo_type: 'DISCOUNT', quota: 500, used_count: 50, status: 'INACTIVE', imageUrl: '' },
  { id: 7, name: 'Coffee Lover Set', promo_code: 'COFFEE-SET', eligibility: 'MEMBER', promo_type: 'REDEMPTION', quota: 100, used_count: 15, status: 'ACTIVE', imageUrl: '' },
  { id: 8, name: 'Student Discount', promo_code: 'STUDENT10', eligibility: 'ALL', promo_type: 'DISCOUNT', quota: 0, used_count: 320, status: 'ACTIVE', imageUrl: '' },
];

let productsMock = [
  { id: "P001", name: "สลัดไก่", type: "ITEM" },
  { id: "P002", name: "ชาบู", type: "ITEM" },
  { id: "P003", name: "โค้ก", type: "ITEM" },
  { id: "C001", name: "เครื่องดื่ม", type: "CATEGORY" },
  { id: "C002", name: "อาหารจานเดียว", type: "CATEGORY" }
];

// --- 1. GET /promotions
app.get('/api/v1/promotions', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || '';

  let filtered = promotionsData;
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedItems = filtered.slice(startIndex, endIndex);

  res.json({
    items: paginatedItems,
    pagination: {
      total: filtered.length,
      page: page,
      limit: limit
    }
  });
});

// --- 2. POST /promotions
app.post('/api/v1/promotions', (req, res) => {
  const newPromo = req.body;
  
  // Basic validation
  if (!newPromo.name || !newPromo.promo_type) {
    return res.status(400).json({ error: "Missing required fields: name, promo_type" });
  }

  // Generate ID
  const newId = promotionsData.length > 0 ? Math.max(...promotionsData.map(p => p.id)) + 1 : 1;
  
  const createdPromo = {
    id: newId,
    name: newPromo.name,
    eligibility: newPromo.eligibility || 'GENERAL',
    promo_type: newPromo.promo_type,
    targetItem: newPromo.targets && newPromo.targets.length > 0 ? newPromo.targets.map(t=>t.target_name).join(', ') : '-',
    targetQty: newPromo.targets && newPromo.targets.length > 0 ? newPromo.targets.reduce((acc, t)=>acc+t.required_quantity, 0) : 0,
    start_datetime: newPromo.start_datetime || new Date().toISOString(),
    end_datetime: newPromo.end_datetime || new Date(Date.now() + 86400000).toISOString(),
    discount_value: newPromo.discount_value || 0,
    quota_remaining: newPromo.total_quota || 0,
    status: 'ACTIVE'
  };

  promotionsData.push(createdPromo);
  console.log("Mock DB: Created new promotion", createdPromo.name);

  res.status(201).json({
    message: "Promotion created successfully",
    id: newId,
    data: createdPromo
  });
});

// --- 3. GET /pos/products
app.get('/api/v1/pos/products', (req, res) => {
  const search = req.query.search || '';
  const type = req.query.type; // Optional filter

  let filtered = productsMock;
  
  if (type) {
    filtered = filtered.filter(p => p.type === type);
  }
  
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  res.json({
    data: filtered
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Mock Backend Server is running strictly following api-contract.json on http://localhost:${PORT}`);
  console.log(`Routes available:`);
  console.log(`  GET  /api/v1/promotions`);
  console.log(`  POST /api/v1/promotions`);
  console.log(`  GET  /api/v1/pos/products`);
});
