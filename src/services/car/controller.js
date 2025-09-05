const Car = require('../../models/car');
const Booking = require('../../models/booking');
const { Op } = require('sequelize');

class CarController {
  async createCar(req, res, next) {
    try {
      console.log('DEBUG: req.body:', req.body);
      console.log('DEBUG: req.file:', req.file);
      let carData = { ...req.body, is_available: true };
      if (req.file) {
        carData.image = req.file.buffer;
      }
      // Defensive: check for required fields
      const requiredFields = ['make','model','year','license_plate','color','category','transmission','fuel_type','seats','daily_rate','location'];
      for (const field of requiredFields) {
        if (carData[field] === undefined || carData[field] === null || carData[field] === '') {
          return res.status(400).json({ status: 'error', message: `Missing required field: ${field}` });
        }
      }
      const car = await Car.create(carData);
      res.status(201).json({
        status: 'success',
        message: 'Car created successfully',
        data: { car }
      });
    } catch (error) {
      console.error('CREATE CAR ERROR:', error);
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
  // Removed is_available and daily_rate filter to return all cars

      console.log('Car search where object:', where);
      const { count, rows: cars } = await Car.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });
      console.log('Cars found:', cars.length);

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
        pickup_location = '',
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

  const where = { is_available: true };
  if (category) where.category = category;
  if (pickup_location) where.location = pickup_location;
  where.daily_rate = { $gte: min_price, $lte: max_price };

  const cars = await Car.findAll({ where });

  if (!cars.length) {
    return res.json({
      status: 'success',
      data: {
        cars: [],
        search_criteria: {
          start_date,
          end_date,
          pickup_location,
          category,
          price_range: { min: min_price, max: max_price }
        }
      }
    });
  }

  // Find bookings that overlap with the requested dates
  const bookingWhere = {
    status: ['confirmed', 'active'],
    [Op.or]: cars.map(car => ({ car_id: car.id })),
    [Op.and]: [
      { start_date: { [Op.lt]: end_date } },
      { end_date: { [Op.gt]: start_date } }
    ]
  };

  const bookings = await Booking.findAll({ where: bookingWhere });
  const bookedCarIds = new Set(bookings.map(b => b.car_id));
  const availableCars = cars.filter(car => !bookedCarIds.has(car.id));

  res.json({
    status: 'success',
    data: {
      cars: availableCars,
      search_criteria: {
        start_date,
        end_date,
        pickup_location,
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