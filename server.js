const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const userRoutes = require('./src/services/user/routes');
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);

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