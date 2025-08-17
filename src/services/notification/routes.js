const express = require('express');
const router = express.Router();
const notificationController = require('./controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');

// User routes
router.get('/my-notifications', authenticateToken, notificationController.getUserNotifications);
router.put('/:id/read', authenticateToken, notificationController.markAsRead);
router.delete('/:id', authenticateToken, notificationController.deleteNotification);

// Admin routes
router.get('/', authenticateToken, authorizeRoles('admin'), notificationController.getAllNotifications);
router.post('/send', authenticateToken, authorizeRoles('admin'), notificationController.sendNotification);
router.post('/broadcast', authenticateToken, authorizeRoles('admin'), notificationController.broadcastNotification);

module.exports = router;