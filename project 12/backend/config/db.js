import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); // Load env vars from root .env

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB; 