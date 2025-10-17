const mongoose = require('mongoose');

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'Missing MONGODB_URI environment variable. Create a .env file (see .env.example) and supply your MongoDB connection string.'
    );
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = {
  connectDatabase
};
