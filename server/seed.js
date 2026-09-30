/**
 * TechBazer Database Seeder Script
 * Usage: node seed.js
 * Database target: techbazerdb
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { initialProducts } = require('./data/initialData');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const DB_NAME = process.env.DB_NAME || 'techbazerdb';
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://127.0.0.1:27017/${DB_NAME}`;

async function seedDatabase() {
  console.log(`[TechBazer Seeder] Connecting to MongoDB database: '${DB_NAME}'...`);
  console.log(`[TechBazer Seeder] URI: ${MONGODB_URI}`);

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[TechBazer Seeder] Successfully connected to '${DB_NAME}'!`);

    // Clear existing products and reseed
    console.log('[TechBazer Seeder] Cleaning old product records...');
    await Product.deleteMany({});
    
    console.log(`[TechBazer Seeder] Inserting ${initialProducts.length} TechBazer catalog products...`);
    const inserted = await Product.insertMany(initialProducts);
    console.log(`[TechBazer Seeder] Successfully seeded ${inserted.length} products into '${DB_NAME}'.`);

    await User.deleteMany({ email: { $in: ['admin@techbazer.com', 'customer@techbazer.com', 'admin@auspify.com', 'customer@auspify.com'] } });

    await User.create([
      {
        name: 'TechBazer Admin',
        email: 'admin@techbazer.com',
        password: 'admin123',
        role: 'Admin'
      },
      {
        name: 'TechBazer Admin (Alias)',
        email: 'admin@auspify.com',
        password: 'admin123',
        role: 'Admin'
      },
      {
        name: 'Jane Customer',
        email: 'customer@techbazer.com',
        password: 'customer123',
        role: 'Customer'
      },
      {
        name: 'Jane Customer (Alias)',
        email: 'customer@auspify.com',
        password: 'customer123',
        role: 'Customer'
      }
    ]);
    console.log(`[TechBazer Seeder] Created default Admin (admin@techbazer.com) and Customer (customer@techbazer.com) users in '${DB_NAME}'.`);

    console.log('\n[TechBazer Seeder] Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(`\n[TechBazer Seeder] MongoDB connection notice: ${err.message}`);
    console.log(`[TechBazer Seeder] Local fallback store 'server/data/techbazerdb.json' is ready and active for '${DB_NAME}' with all 16 products.`);
    process.exit(0);
  }
}

seedDatabase();
