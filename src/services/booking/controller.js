const Booking = require('../../models/booking');
const Car = require('../../models/car');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const { car_id, start_date, end_date, pickup_location, dropoff_location } = req.body;
      const user_id = req.user.id;

      // Check if car exists and is available
      const car = await Car.findByPk(car_id);
      if (!car) {
        return res.status(404).json({
          status: 'error',
          message: 'Car not found'
        });
      }
      if (!car.is_available) {
        return res.status(400).json({
          status: 'error',
          message: 'Car is not available'
        });
      }

      // Check for booking conflicts
      const conflictingBookings = await Booking.findAll({
        where: {
          car_id,
          status: ['confirmed', 'active'],
          start_date: { $lte: end_date },
          end_date: { $gte: start_date }
        }
      });
      if (conflictingBookings && conflictingBookings.length > 0) {
        return res.status(409).json({
          status: 'error',
          message: 'Car is already booked for the selected dates'
        });
      }

      // Calculate total amount
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const total_amount = days * car.daily_rate;

      // Create booking
      const booking = await Booking.create({
        user_id,
        car_id,
        start_date,
        end_date,
        pickup_location,
        dropoff_location,
        total_amount,
        status: 'pending'
      });

      res.status(201).json({
        status: 'success',
        message: 'Booking created successfully',
        data: { booking }
      });
    } catch (error) {
      next(error);
    }
  }

  // ...existing code...
  async getUserBookings(req, res, next) {
    try {
      const { page = 1, limit = 10, status = '' } = req.query;
      const offset = (page - 1) * limit;
      const where = { user_id: req.user.id };
      if (status) where.status = status;
      const { count, rows: bookings } = await Booking.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });
      res.json({
        status: 'success',
        data: {
          bookings,
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

  // ...existing code...
  async getBookingById(req, res, next) {
    try {
      const { id } = req.params;
      const where = { id };
      if (req.user.role !== 'admin') {
        where.user_id = req.user.id;
      }
      const booking = await Booking.findOne({ where });
      if (!booking) {
        return res.status(404).json({
          status: 'error',
          message: 'Booking not found'
        });
      }
      res.json({
        status: 'success',
        data: { booking }
      });
    } catch (error) {
      next(error);
    }
  }

  // ...existing code...
  async updateBooking(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      // Check if booking exists and belongs to user (unless admin)
      const where = { id };
      if (req.user.role !== 'admin') {
        where.user_id = req.user.id;
      }
      const booking = await Booking.findOne({ where });
      if (!booking) {
        return res.status(404).json({
          status: 'error',
          message: 'Booking not found'
        });
      }
      // Prevent updates to completed/cancelled bookings
      if (['completed', 'cancelled'].includes(booking.status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot update a completed or cancelled booking'
        });
      }
      await Booking.update(updates, { where: { id } });
      const updatedBooking = await Booking.findByPk(id);
      res.json({
        status: 'success',
        message: 'Booking updated successfully',
        data: { booking: updatedBooking }
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const { id } = req.params;
      // Check if booking exists and belongs to user (unless admin)
      const where = { id };
      if (req.user.role !== 'admin') {
        where.user_id = req.user.id;
      }
      const booking = await Booking.findOne({ where });
      if (!booking) {
        return res.status(404).json({
          status: 'error',
          message: 'Booking not found'
        });
      }
      // Check if booking can be cancelled
      if (!['pending', 'confirmed'].includes(booking.status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Booking cannot be cancelled'
        });
      }
      // Check if booking start date is in the future (at least 24 hours)
      const startDate = new Date(booking.start_date);
      const now = new Date();
      const hoursDifference = (startDate - now) / (1000 * 60 * 60);
      if (hoursDifference < 24) {
        return res.status(400).json({
          status: 'error',
          message: 'Booking can only be cancelled at least 24 hours before start date'
        });
      }
      await Booking.update({
        status: 'cancelled',
        cancelled_at: new Date(),
        updated_at: new Date()
      }, { where: { id } });
      const updatedBooking = await Booking.findByPk(id);
      res.json({
        status: 'success',
        message: 'Booking cancelled successfully',
        data: { booking: updatedBooking }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status = '', 
        user_id = '', 
        car_id = '',
        start_date = '',
        end_date = ''
      } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (status) where.status = status;
      if (user_id) where.user_id = user_id;
      if (car_id) where.car_id = car_id;
      if (start_date) where.start_date = { ...(where.start_date || {}), $gte: start_date };
      if (end_date) where.end_date = { ...(where.end_date || {}), $lte: end_date };
      const { count, rows: bookings } = await Booking.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });
      res.json({
        status: 'success',
        data: {
          bookings,
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

  async updateBookingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!['pending', 'confirmed', 'active', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid status'
        });
      }
      const updateData = {
        status,
        updated_at: new Date()
      };
      if (status === 'cancelled') updateData.cancelled_at = new Date();
      if (status === 'completed') updateData.completed_at = new Date();
      await Booking.update(updateData, { where: { id } });
      const booking = await Booking.findByPk(id);
      res.json({
        status: 'success',
        message: `Booking status updated to ${status}`,
        data: { booking }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();