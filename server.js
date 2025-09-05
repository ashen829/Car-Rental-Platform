const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const userRoutes = require('./src/services/user/routes');
// ...existing code...
const carRoutes = require('./src/services/car/routes');
const bookingRoutes = require('./src/services/booking/routes');
const paymentRoutes = require('./src/services/payment/routes');
const notificationRoutes = require('./src/services/notification/routes');

const errorHandler = require('./src/middleware/errorHandler');
const sequelize = require('./src/config/database');
const User = require('./src/models/user');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Car Rental API is running',
    timestamp: new Date().toISOString(),
    services: {
      user: 'active',
      car: 'active',
      booking: 'active',
      payment: 'active',
      notification: 'active'
    }
  });
});

// API Routes
// Only apply express.json and express.urlencoded to routes that do NOT use multer (file upload)
app.use('/api/users', express.json({ limit: '10mb' }), express.urlencoded({ extended: true }), userRoutes);
app.use('/api/bookings', express.json({ limit: '10mb' }), express.urlencoded({ extended: true }), bookingRoutes);
app.use('/api/payments', express.json({ limit: '10mb' }), express.urlencoded({ extended: true }), paymentRoutes);
app.use('/api/notifications', express.json({ limit: '10mb' }), express.urlencoded({ extended: true }), notificationRoutes);
// For /api/cars, do NOT use express.json or express.urlencoded globally, let multer handle multipart/form-data
// But for /api/cars/:id/availability, apply express.json() to parse JSON bodies
const expressJson = express.json({ limit: '10mb' });
app.use('/api/cars/:id/availability', expressJson, carRoutes);
app.use('/api/cars', carRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully');
    app.listen(PORT, () => {
      console.log(`🚗 Car Rental API Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

sequelize.sync(); // This will create the table if it doesn't exist

startServer();