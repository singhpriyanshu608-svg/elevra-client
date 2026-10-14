import mongoose from 'mongoose';

/**
 * Checks whether the MongoDB connection is active and ready.
 * @returns {boolean}
 */
export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Connect to MongoDB Atlas with safe connection handling.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[Database] MONGODB_URI is not set. MongoDB connection skipped. Database operations will return 503 until configured.');
    return;
  }

  try {
    // Mask credentials for safe logging
    const maskedUri = uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    console.log(`[Database] Attempting connection to ${maskedUri}...`);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('[Database] MongoDB Atlas connected successfully.');
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error.message);
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected.');
});
