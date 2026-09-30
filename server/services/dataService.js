const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');
const { initialProducts } = require('../data/initialData');

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'techbazerdb.json');
const LEGACY_DB_FILE = path.join(DATA_DIR, 'db.json');

const ensureDataFile = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE) && fs.existsSync(LEGACY_DB_FILE)) {
    try {
      fs.copyFileSync(LEGACY_DB_FILE, DB_FILE);
    } catch {}
  }
  if (!fs.existsSync(DB_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync('admin123', salt);
    const customerPasswordHash = bcrypt.hashSync('customer123', salt);

    const defaultData = {
      users: [
        {
          _id: 'usr_admin_001',
          name: 'TechBazer Admin',
          email: 'admin@techbazer.com',
          password: adminPasswordHash,
          role: 'Admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'usr_admin_002',
          name: 'TechBazer Admin (Alias)',
          email: 'admin@auspify.com',
          password: adminPasswordHash,
          role: 'Admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'usr_cust_001',
          name: 'Jane Customer',
          email: 'customer@techbazer.com',
          password: customerPasswordHash,
          role: 'Customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'usr_cust_002',
          name: 'Jane Customer (Alias)',
          email: 'customer@auspify.com',
          password: customerPasswordHash,
          role: 'Customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      products: initialProducts.map((p, index) => ({
        _id: `prod_${(index + 1).toString().padStart(3, '0')}`,
        ...p,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      orders: [],
      carts: []
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
};

const readLocalDB = () => {
  ensureDataFile();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return { users: [], products: [], orders: [], carts: [] };
  }
};

const writeLocalDB = (data) => {
  ensureDataFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

// Seed MongoDB if it's connected and empty
const seedMongoIfEmpty = async () => {
  if (!getIsConnected()) return;
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[Seed] Seeding initial products to MongoDB...');
      await Product.insertMany(initialProducts);
    }

    const adminExists = await User.findOne({ email: 'admin@auspify.com' });
    if (!adminExists) {
      console.log('[Seed] Creating default admin user in MongoDB...');
      await User.create({
        name: 'Auspify Admin',
        email: 'admin@auspify.com',
        password: 'admin123',
        role: 'Admin'
      });
    }

    const customerExists = await User.findOne({ email: 'customer@auspify.com' });
    if (!customerExists) {
      console.log('[Seed] Creating default customer user in MongoDB...');
      await User.create({
        name: 'Jane Customer',
        email: 'customer@auspify.com',
        password: 'customer123',
        role: 'Customer'
      });
    }
  } catch (err) {
    console.error('[Seed] Error seeding MongoDB:', err.message);
  }
};

// Initialize persistent storage
ensureDataFile();

const dataService = {
  seedMongoIfEmpty,

  // --- USERS ---
  async findUserByEmail(email) {
    if (getIsConnected()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const db = readLocalDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    return {
      ...user,
      id: user._id,
      matchPassword: async (candidate) => bcrypt.compare(candidate, user.password)
    };
  },

  async findUserById(id) {
    if (getIsConnected()) {
      return await User.findById(id).select('-password');
    }
    const db = readLocalDB();
    const user = db.users.find(u => u._id === id || u.id === id);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return { ...safeUser, id: safeUser._id };
  },

  async createUser({ name, email, password, role = 'Customer' }) {
    if (getIsConnected()) {
      const user = await User.create({ name, email: email.toLowerCase(), password, role });
      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      };
    }
    const db = readLocalDB();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      _id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === 'Admin' ? 'Admin' : 'Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeLocalDB(db);

    const { password: _, ...safeUser } = newUser;
    return { ...safeUser, id: safeUser._id };
  },

  // --- PRODUCTS ---
  async getProducts({ category, minPrice, maxPrice, search, sort = 'newest', page = 1, limit = 12, includeInactive = false }) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;

    if (getIsConnected()) {
      const query = {};
      if (!includeInactive) query.isActive = true;
      if (category && category !== 'All') query.category = category;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
      if (search && search.trim()) {
        query.$or = [
          { title: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
          { category: { $regex: search.trim(), $options: 'i' } }
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price-asc') sortOption = { price: 1 };
      if (sort === 'price-desc') sortOption = { price: -1 };
      if (sort === 'rating') sortOption = { rating: -1 };

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      return {
        products,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        total
      };
    }

    // Local JSON Store fallback
    const db = readLocalDB();
    let filtered = db.products.filter(p => {
      if (!includeInactive && p.isActive === false) return false;
      if (category && category !== 'All' && p.category.toLowerCase() !== category.toLowerCase()) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q);
        if (!inTitle && !inDesc && !inCat) return false;
      }
      return true;
    });

    if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = filtered.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(startIndex, startIndex + limitNum);

    return {
      products: paginated,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total
    };
  },

  async getProductById(id) {
    if (getIsConnected()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        return await Product.findById(id);
      }
    }
    const db = readLocalDB();
    return db.products.find(p => p._id === id || p.id === id) || null;
  },

  async createProduct(productData) {
    if (getIsConnected()) {
      return await Product.create(productData);
    }
    const db = readLocalDB();
    const newProduct = {
      _id: 'prod_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      title: productData.title,
      description: productData.description,
      price: Number(productData.price),
      category: productData.category,
      image: productData.image,
      stock: Number(productData.stock) || 0,
      isActive: productData.isActive !== undefined ? Boolean(productData.isActive) : true,
      rating: Number(productData.rating) || 4.5,
      reviewsCount: Number(productData.reviewsCount) || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.products.unshift(newProduct);
    writeLocalDB(db);
    return newProduct;
  },

  async updateProduct(id, updateData) {
    if (getIsConnected() && mongoose.Types.ObjectId.isValid(id)) {
      return await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    }
    const db = readLocalDB();
    const index = db.products.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;

    db.products[index] = {
      ...db.products[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    writeLocalDB(db);
    return db.products[index];
  },

  async deleteProduct(id) {
    if (getIsConnected() && mongoose.Types.ObjectId.isValid(id)) {
      return await Product.findByIdAndDelete(id);
    }
    const db = readLocalDB();
    const index = db.products.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;
    const deleted = db.products.splice(index, 1)[0];
    writeLocalDB(db);
    return deleted;
  },

  // --- CARTS ---
  async getCart({ userId, sessionId }) {
    if (getIsConnected() && userId && mongoose.Types.ObjectId.isValid(userId)) {
      let cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
      }
      return cart;
    }

    const db = readLocalDB();
    let cart = db.carts.find(c => (userId && c.userId === userId) || (sessionId && c.sessionId === sessionId));
    if (!cart) {
      cart = {
        _id: 'cart_' + Date.now().toString(36),
        userId: userId || null,
        sessionId: sessionId || null,
        items: [],
        updatedAt: new Date().toISOString()
      };
      db.carts.push(cart);
      writeLocalDB(db);
    }
    return cart;
  },

  async addToCart({ userId, sessionId, productId, quantity = 1 }) {
    const qty = parseInt(quantity, 10) || 1;
    const product = await this.getProductById(productId);
    if (!product) throw new Error('Product not found');

    const db = readLocalDB();
    let cart = db.carts.find(c => (userId && c.userId === userId) || (sessionId && c.sessionId === sessionId));
    if (!cart) {
      cart = {
        _id: 'cart_' + Date.now().toString(36),
        userId: userId || null,
        sessionId: sessionId || null,
        items: [],
        updatedAt: new Date().toISOString()
      };
      db.carts.push(cart);
    }

    const pId = product._id || product.id;
    const existingIndex = cart.items.findIndex(item => (item.productId || item.product) === pId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qty;
    } else {
      cart.items.push({
        productId: pId,
        product: pId,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: qty
      });
    }

    cart.updatedAt = new Date().toISOString();
    writeLocalDB(db);
    return cart;
  },

  async updateCartQuantity({ userId, sessionId, productId, quantity }) {
    const qty = parseInt(quantity, 10);
    const db = readLocalDB();
    let cart = db.carts.find(c => (userId && c.userId === userId) || (sessionId && c.sessionId === sessionId));
    if (!cart) return { items: [] };

    if (qty <= 0) {
      cart.items = cart.items.filter(item => (item.productId || item.product) !== productId);
    } else {
      const item = cart.items.find(item => (item.productId || item.product) === productId);
      if (item) item.quantity = qty;
    }

    cart.updatedAt = new Date().toISOString();
    writeLocalDB(db);
    return cart;
  },

  async removeFromCart({ userId, sessionId, productId }) {
    const db = readLocalDB();
    let cart = db.carts.find(c => (userId && c.userId === userId) || (sessionId && c.sessionId === sessionId));
    if (!cart) return { items: [] };

    cart.items = cart.items.filter(item => (item.productId || item.product) !== productId);
    cart.updatedAt = new Date().toISOString();
    writeLocalDB(db);
    return cart;
  },

  async clearCart({ userId, sessionId }) {
    const db = readLocalDB();
    let cart = db.carts.find(c => (userId && c.userId === userId) || (sessionId && c.sessionId === sessionId));
    if (cart) {
      cart.items = [];
      cart.updatedAt = new Date().toISOString();
      writeLocalDB(db);
    }
    return { items: [] };
  },

  // --- ORDERS ---
  async createOrder({ user, items, shippingAddress, paymentMethod = 'Credit Card' }) {
    if (!items || items.length === 0) {
      throw new Error('Order items cannot be empty');
    }

    const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
    const taxAmount = Number((subtotal * 0.08).toFixed(2));
    const shippingFee = subtotal > 100 ? 0 : 9.99;
    const totalAmount = Number((subtotal + taxAmount + shippingFee).toFixed(2));

    if (getIsConnected() && user && mongoose.Types.ObjectId.isValid(user._id || user.id)) {
      const order = await Order.create({
        user: user._id || user.id,
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        taxAmount,
        shippingFee,
        totalAmount,
        status: 'Pending'
      });
      return order;
    }

    const db = readLocalDB();
    const newOrder = {
      _id: 'ord_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      user: {
        _id: user._id || user.id,
        name: user.name,
        email: user.email
      },
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      taxAmount,
      shippingFee,
      totalAmount,
      status: 'Pending',
      isPaid: true,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);
    writeLocalDB(db);

    // Also clear user's cart if any
    await this.clearCart({ userId: user._id || user.id });

    return newOrder;
  },

  async getOrdersByUser(userId) {
    if (getIsConnected() && mongoose.Types.ObjectId.isValid(userId)) {
      return await Order.find({ user: userId }).sort({ createdAt: -1 });
    }
    const db = readLocalDB();
    return db.orders.filter(o => o.user && (o.user._id === userId || o.user.id === userId || o.user === userId));
  },

  async getAllOrders() {
    if (getIsConnected()) {
      return await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    }
    const db = readLocalDB();
    return db.orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getOrderById(id) {
    if (getIsConnected() && mongoose.Types.ObjectId.isValid(id)) {
      return await Order.findById(id).populate('user', 'name email');
    }
    const db = readLocalDB();
    return db.orders.find(o => o._id === id || o.id === id) || null;
  },

  async updateOrderStatus(id, status) {
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    if (getIsConnected() && mongoose.Types.ObjectId.isValid(id)) {
      const update = { status };
      if (status === 'Delivered') update.deliveredAt = new Date();
      return await Order.findByIdAndUpdate(id, update, { new: true });
    }

    const db = readLocalDB();
    const index = db.orders.findIndex(o => o._id === id || o.id === id);
    if (index === -1) return null;

    db.orders[index].status = status;
    db.orders[index].updatedAt = new Date().toISOString();
    if (status === 'Delivered') {
      db.orders[index].deliveredAt = new Date().toISOString();
    }
    writeLocalDB(db);
    return db.orders[index];
  },

  async getAnalytics() {
    let orders = [];
    let products = [];
    let users = [];

    if (getIsConnected()) {
      orders = await Order.find();
      products = await Product.find();
      users = await User.find();
    } else {
      const db = readLocalDB();
      orders = db.orders;
      products = db.products;
      users = db.users;
    }

    const totalRevenue = orders
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const statusCounts = {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };

    orders.forEach(o => {
      if (statusCounts[o.status] !== undefined) {
        statusCounts[o.status]++;
      }
    });

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: orders.length,
      statusCounts,
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive !== false).length,
      totalUsers: users.length,
      recentOrders: orders.slice(0, 5)
    };
  }
};

module.exports = dataService;
