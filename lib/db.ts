import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName: 'inventory',
    });
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};
