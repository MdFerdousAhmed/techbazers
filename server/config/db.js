const mongoose = require('mongoose');

let isConnected = false;

const DB_NAME = process.env.DB_NAME || 'techbazerdb';

const connectDB = async () => {
  if (isConnected) return true;

  const uri = process.env.MONGODB_URI || process.env.MONGOOSE_URL || `mongodb://127.0.0.1:27017/${DB_NAME}`;
  try {
    const conn = await mongoose.connect(uri, {
      dbName: DB_NAME,
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Mongoose Connected successfully to '${DB_NAME}' on host: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed (${error.message}).`);
    console.warn(`[Database] Operating with local persistent data store: '${DB_NAME}' (data/${DB_NAME}.json).`);
    isConnected = false;
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected, DB_NAME };
