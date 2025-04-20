import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to database
connectDB();

const app = express();

// Increase payload size limit for Base64 uploads
app.use(express.json({ limit: '50mb' })); // Adjust limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Adjust limit as needed

// Enable CORS
// You might want to configure this more strictly for production
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- Deployment Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const parentDir = path.resolve(__dirname, '..'); // Go up one level from /backend

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder (assuming frontend build is in 'dist' at the root)
  app.use(express.static(path.join(parentDir, 'dist')));

  // Serve index.html for any route not handled by API
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(parentDir, 'dist', 'index.html'))
  );
} else {
  // Basic route for development
  app.get('/', (req, res) => {
    res.send('API is running in development mode...');
  });
}

// --- Error Handling Middleware ---
// Not Found handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// General error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Provide stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)); 