const express = require('express');
const router = express.Router();
const bookingController = require('./controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');
const { validate, bookingSchemas } = require('../../middleware/validation');

// User routes
router.post('/', authenticateToken, validate(bookingSchemas.create), bookingController.createBooking);
router.get('/my-bookings', authenticateToken, bookingController.getUserBookings);
router.get('/:id', authenticateToken, bookingController.getBookingById);
router.put('/:id', authenticateToken, validate(bookingSchemas.update), bookingController.updateBooking);
router.post('/:id/cancel', authenticateToken, bookingController.cancelBooking);

// Admin routes
router.get('/', authenticateToken, authorizeRoles('admin'), bookingController.getAllBookings);
router.put('/:id/status', authenticateToken, authorizeRoles('admin'), bookingController.updateBookingStatus);

module.exports = router;