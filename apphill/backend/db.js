const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async (uri) => {
  const mongoURI = uri || process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('⚠️ No MONGODB_URI found in environment. Running in in-memory fallback mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.error('🔥 MongoDB Connection Error:', err.message);
    console.warn('⚠️ Falling back to in-memory store until MongoDB is available.');
    return false;
  }
};

const isDBConnected = () => isConnected && mongoose.connection.readyState === 1;

module.exports = {
  connectDB,
  isDBConnected,
};
