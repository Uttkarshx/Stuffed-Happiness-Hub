const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment');
    }

    mongoose.connection.on('connected', () => {
      console.info('MongoDB connected');
    });

    mongoose.connection.on('error', (error) => {
      console.error(`MongoDB runtime error: ${error.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    return true;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
