const express = require('express');
const router = express.Router();
const userController = require('./controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');
const { validate, userSchemas } = require('../../middleware/validation');

// Public routes
router.post('/register', validate(userSchemas.register), userController.register);
router.post('/login', validate(userSchemas.login), userController.login);

// Protected routes
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, validate(userSchemas.updateProfile), userController.updateProfile);
router.post('/logout', authenticateToken, userController.logout);

// Admin routes
router.get('/', authenticateToken, authorizeRoles('admin'), userController.getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles('admin'), userController.getUserById);
router.put('/:id/profile', authenticateToken, authorizeRoles('admin'), validate(userSchemas.updateProfile), userController.adminUpdateUserProfile);
router.put('/:id/status', authenticateToken, authorizeRoles('admin'), userController.updateUserStatus);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);

module.exports = router;