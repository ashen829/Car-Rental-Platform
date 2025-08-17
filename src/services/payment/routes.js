const express = require('express');
const router = express.Router();
const paymentController = require('./controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');
const { validate, paymentSchemas } = require('../../middleware/validation');

// User routes
router.post('/process', authenticateToken, validate(paymentSchemas.process), paymentController.processPayment);
router.get('/booking/:bookingId', authenticateToken, paymentController.getPaymentByBooking);
router.get('/:id', authenticateToken, paymentController.getPaymentById);

// Admin routes
router.get('/', authenticateToken, authorizeRoles('admin'), paymentController.getAllPayments);
router.post('/:id/refund', authenticateToken, authorizeRoles('admin'), paymentController.processRefund);

module.exports = router;