const Car = require('../../models/car');
const Booking = require('../../models/booking');

class CarController {
  async createCar(req, res, next) {
    try {
      const car = await Car.create({ ...req.body, is_available: true });
      res.status(201).json({
        status: 'success',
        message: 'Car created successfully',
        data: { car }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllCars(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        category = '',
        transmission = '',
        fuel_type = '',
        min_price = 0,
        max_price = 1000,
        available_only = 'false'
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};
      if (category) where.category = category;
      if (transmission) where.transmission = transmission;
      if (fuel_type) where.fuel_type = fuel_type;
      if (available_only === 'true') where.is_available = true;
      where.daily_rate = { $gte: min_price, $lte: max_price };

      const { count, rows: cars } = await Car.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });

      res.json({
        status: 'success',
        data: {
          cars,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            pages: Math.ceil(count / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCarById(req, res, next) {
    try {
      const { id } = req.params;
      const car = await Car.findByPk(id);
      if (!car) {
        return res.status(404).json({
          status: 'error',
          message: 'Car not found'
        });
      }
      res.json({
        status: 'success',
        data: { car }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCar(req, res, next) {
    try {
      const { id } = req.params;
      const [updated] = await Car.update(req.body, { where: { id } });
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'Car not found'
        });
      }
      const car = await Car.findByPk(id);
      res.json({
        status: 'success',
        message: 'Car updated successfully',
        data: { car }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCar(req, res, next) {
    try {
      const { id } = req.params;
      // Check if car has active bookings
      const activeBookings = await Booking.findAll({
        where: {
          car_id: id,
          status: ['pending', 'confirmed', 'active']
        }
      });
      if (activeBookings && activeBookings.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete car with active bookings'
        });
      }
      const deleted = await Car.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Car not found'
        });
      }
      res.json({
        status: 'success',
        message: 'Car deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAvailability(req, res, next) {
    try {
      const { id } = req.params;
      const { is_available } = req.body;
      const [updated] = await Car.update({ is_available }, { where: { id } });
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'Car not found'
        });
      }
      const car = await Car.findByPk(id, { attributes: ['id', 'make', 'model', 'license_plate', 'is_available'] });
      res.json({
        status: 'success',
        message: `Car availability updated to ${is_available ? 'available' : 'unavailable'}`,
        data: { car }
      });
    } catch (error) {
      next(error);
    }
  }

  async searchCars(req, res, next) {
    try {
      const {
        start_date,
        end_date,
        location = '',
        category = '',
        min_price = 0,
        max_price = 1000
      } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({
          status: 'error',
          message: 'Start date and end date are required'
        });
      }

      // Find all available cars
      const where = { is_available: true };
      if (category) where.category = category;
      where.daily_rate = { $gte: min_price, $lte: max_price };

      // Get all cars
      const cars = await Car.findAll({ where });

      // Get all bookings that conflict with the requested period
      const bookings = await Booking.findAll({
        where: {
          status: ['confirmed', 'active'],
          [Booking.sequelize.Op.or]: cars.map(car => ({
            car_id: car.id
          })),
          [Booking.sequelize.Op.and]: [
            { start_date: { $lt: end_date } },
            { end_date: { $gt: start_date } }
          ]
        }
      });

      // Filter out cars with conflicting bookings
      const bookedCarIds = new Set(bookings.map(b => b.car_id));
      const availableCars = cars.filter(car => !bookedCarIds.has(car.id));

      res.json({
        status: 'success',
        data: {
          cars: availableCars,
          search_criteria: {
            start_date,
            end_date,
            location,
            category,
            price_range: { min: min_price, max: max_price }
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CarController();