import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDb, saveDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'granit_super_secret_key_2026_workshop';

// Basic security middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Anti-brute-force rate limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Слишком много неудачных попыток входа с этого IP. Повторите попытку через 15 минут.',
  },
});

// Middleware: Verify JWT Authentication
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Доступ запрещен: требуется авторизация' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Недействительный или истекший токен доступа' });
  }
};

// Middleware: Admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Недостаточно прав. Требуется роль администратора' });
  }
};

// ---------------- AUTH ROUTES ----------------

// POST /api/auth/login
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Введите имя пользователя и пароль' });
  }

  const db = getDb();
  const user = db.users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Неверный логин или пароль' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Неверный логин или пароль' });
  }

  // Generate JWT token (valid for 7 days)
  const token = jwt.sign(
    { id: user.id, username: user.username, fullName: user.fullName, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: 'Авторизация успешна',
    token,
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  res.json({
    user: {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

// POST /api/auth/change-password
app.post('/api/auth/change-password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 5) {
    return res.status(400).json({ error: 'Пароль должен содержать не менее 5 символов' });
  }

  const db = getDb();
  const userIndex = db.users.findIndex((u) => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const user = db.users[userIndex];
  if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'Неверный текущий пароль' });
  }

  const salt = bcrypt.genSaltSync(10);
  db.users[userIndex].passwordHash = bcrypt.hashSync(newPassword, salt);
  saveDb(db);

  res.json({ message: 'Пароль успешно обновлен' });
});

// ---------------- CATALOG & PRICING ROUTES ----------------

// GET /api/catalog
app.get('/api/catalog', authMiddleware, (req, res) => {
  const db = getDb();
  res.json({
    materials: db.materials,
    steles: db.steles,
    stands: db.stands,
    flowerBeds: db.flowerBeds,
    plates: db.plates,
    tiles: db.tiles,
    services: db.services,
    settings: db.systemSettings,
  });
});

// POST /api/catalog/:category
// Updates existing item or adds a new one in any catalog section!
app.post('/api/catalog/:category', authMiddleware, adminOnly, (req, res) => {
  const { category } = req.params;
  const itemData = req.body;

  const validCategories = ['materials', 'steles', 'stands', 'flowerBeds', 'plates', 'tiles', 'services'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Неизвестная категория каталога' });
  }

  const db = getDb();
  const collection = db[category] || [];

  if (itemData.id) {
    // Update
    const idx = collection.findIndex((i) => i.id === itemData.id);
    if (idx !== -1) {
      collection[idx] = { ...collection[idx], ...itemData };
    } else {
      collection.push(itemData);
    }
  } else {
    // Create new
    const newId = `${category.slice(0, 3)}_${Date.now()}`;
    collection.push({ ...itemData, id: newId });
  }

  db[category] = collection;
  saveDb(db);

  res.json({ message: 'Сохранено успешно', items: db[category] });
});

// DELETE /api/catalog/:category/:id
app.delete('/api/catalog/:category/:id', authMiddleware, adminOnly, (req, res) => {
  const { category, id } = req.params;
  const db = getDb();

  if (!db[category]) {
    return res.status(400).json({ error: 'Категория не найдена' });
  }

  db[category] = db[category].filter((item) => item.id !== id);
  saveDb(db);

  res.json({ message: 'Позиция удалена', items: db[category] });
});

// ---------------- ORDERS ROUTES ----------------

// GET /api/orders
app.get('/api/orders', authMiddleware, (req, res) => {
  const db = getDb();
  res.json(db.orders || []);
});

// POST /api/orders
app.post('/api/orders', authMiddleware, (req, res) => {
  const orderData = req.body;
  const db = getDb();

  const newId = `ord_${Date.now()}`;
  const orderCount = (db.orders || []).length + 1;
  const orderNumber = `№ 2026-${String(orderCount).padStart(3, '0')}`;

  const newOrder = {
    ...orderData,
    id: newId,
    orderNumber,
    orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
    status: orderData.status || 'new',
    createdBy: req.user.username,
  };

  db.orders = [newOrder, ...(db.orders || [])];
  saveDb(db);

  res.status(201).json({ message: 'Заказ успешно создан', order: newOrder });
});

// PATCH /api/orders/:id/status
app.patch('/api/orders/:id/status', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { status, paymentUpdate } = req.body;

  const db = getDb();
  const orderIndex = db.orders.findIndex((o) => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }

  if (status) {
    db.orders[orderIndex].status = status;
  }

  if (paymentUpdate !== undefined) {
    const prevPrepayment = Number(db.orders[orderIndex].prepayment || 0);
    const added = Number(paymentUpdate);
    const newPrepayment = prevPrepayment + added;
    const totalSell = Number(db.orders[orderIndex].totalSellPrice || 0);

    db.orders[orderIndex].prepayment = newPrepayment;
    db.orders[orderIndex].remainingPayment = Math.max(0, totalSell - newPrepayment);
  }

  saveDb(db);
  res.json({ message: 'Заказ обновлен', order: db.orders[orderIndex] });
});

// DELETE /api/orders/:id
app.delete('/api/orders/:id', authMiddleware, adminOnly, (req, res) => {
  const { id } = req.params;
  const db = getDb();

  db.orders = (db.orders || []).filter((o) => o.id !== id);
  saveDb(db);

  res.json({ message: 'Заказ удален' });
});

// ---------------- ANALYTICS / STATS ----------------

// GET /api/stats
app.get('/api/stats', authMiddleware, (req, res) => {
  const db = getDb();
  const orders = db.orders || [];

  const totalTurnover = orders.reduce((sum, o) => sum + (Number(o.totalSellPrice) || 0), 0);
  const totalCost = orders.reduce((sum, o) => sum + (Number(o.totalBuyCost) || 0), 0);
  const totalProfit = totalTurnover - totalCost;
  const totalPrepaid = orders.reduce((sum, o) => sum + (Number(o.prepayment) || 0), 0);
  const totalPendingPayment = orders.reduce((sum, o) => sum + (Number(o.remainingPayment) || 0), 0);

  const activeOrdersCount = orders.filter((o) => o.status !== 'completed').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;

  res.json({
    totalTurnover,
    totalCost,
    totalProfit,
    totalPrepaid,
    totalPendingPayment,
    activeOrdersCount,
    completedOrdersCount,
    totalOrders: orders.length,
  });
});

app.listen(PORT, () => {
  console.log(`[Granit ERP Server] running on http://localhost:${PORT}`);
});
