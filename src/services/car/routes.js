const express = require('express');
const router = express.Router();
const carController = require('./controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth');
const { validate, carSchemas } = require('../../middleware/validation');

// Public routes
router.get('/', carController.getAllCars);
router.get('/search', carController.searchCars);
router.get('/:id', carController.getCarById);

// Admin routes
router.post('/', authenticateToken, authorizeRoles('admin'), validate(carSchemas.create), carController.createCar);
router.put('/:id', authenticateToken, authorizeRoles('admin'), validate(carSchemas.update), carController.updateCar);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), carController.deleteCar);
router.put('/:id/availability', authenticateToken, authorizeRoles('admin'), carController.updateAvailability);

module.exports = router;