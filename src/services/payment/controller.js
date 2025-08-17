const Payment = require('../../models/payment');
const Booking = require('../../models/booking');

class PaymentController {
  // Mock payment gateway simulation
  async mockPaymentGateway(paymentData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success/failure based on card number (for testing)
    const { card_number } = paymentData;
    
    // Test card numbers
    const testCards = {
      '4111111111111111': { success: true, message: 'Payment successful' },
      '4000000000000002': { success: false, message: 'Card declined' },
      '4000000000000119': { success: false, message: 'Processing error' }
    };

    if (testCards[card_number]) {
      return testCards[card_number];
    }

    // Default success for other valid card numbers
    if (card_number && card_number.length === 16) {
      return {
        success: true,
        message: 'Payment successful',
        transaction_id: `txn_${uuidv4().substring(0, 8)}`,
        gateway_response: {
          status: 'approved',
          authorization_code: Math.random().toString(36).substring(2, 8).toUpperCase()
        }
      };
    }

    return { success: false, message: 'Invalid card number' };
  }

  async processPayment(req, res, next) {
    try {
      const { booking_id, payment_method, ...paymentDetails } = req.body;
      const user_id = req.user.id;

      // Verify booking exists and belongs to user
      const booking = await Booking.findOne({ where: { id: booking_id, user_id } });
      if (!booking) {
        return res.status(404).json({
          status: 'error',
          message: 'Booking not found'
        });
      }
      if (booking.status !== 'pending') {
        return res.status(400).json({
          status: 'error',
          message: 'Payment can only be processed for pending bookings'
        });
      }

      // Check if payment already exists for this booking
      const existingPayment = await Payment.findOne({ where: { booking_id, status: 'completed' } });
      if (existingPayment) {
        return res.status(400).json({
          status: 'error',
          message: 'Payment already processed for this booking'
        });
      }

      // Process payment through mock gateway
      const gatewayResponse = await this.mockPaymentGateway(paymentDetails);

      // Create payment record
      const payment = await Payment.create({
        booking_id,
        user_id,
        amount: booking.total_amount,
        payment_method,
        status: gatewayResponse.success ? 'completed' : 'failed',
        transaction_id: gatewayResponse.transaction_id || null,
        gateway_response: gatewayResponse.gateway_response || null,
        failure_reason: gatewayResponse.success ? null : gatewayResponse.message,
        processed_at: new Date()
      });

      // Update booking status if payment successful
      if (gatewayResponse.success) {
        await Booking.update({ status: 'confirmed' }, { where: { id: booking_id } });
      }

      res.status(gatewayResponse.success ? 201 : 400).json({
        status: gatewayResponse.success ? 'success' : 'error',
        message: gatewayResponse.message,
        data: { payment }
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentByBooking(req, res, next) {
    try {
      const { bookingId } = req.params;
      const where = { booking_id: bookingId };
      if (req.user.role !== 'admin') {
        where.user_id = req.user.id;
      }
      const payment = await Payment.findOne({ where });
      if (!payment) {
        return res.status(404).json({
          status: 'error',
          message: 'Payment not found'
        });
      }
      res.json({
        status: 'success',
        data: { payment }
      });
    } catch (error) {
      next(error);
    }
  }

  async getPaymentById(req, res, next) {
    try {
      const { id } = req.params;
      const where = { id };
      if (req.user.role !== 'admin') {
        where.user_id = req.user.id;
      }
      const payment = await Payment.findOne({ where });
      if (!payment) {
        return res.status(404).json({
          status: 'error',
          message: 'Payment not found'
        });
      }
      res.json({
        status: 'success',
        data: { payment }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllPayments(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status = '', 
        user_id = '',
        start_date = '',
        end_date = ''
      } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (status) where.status = status;
      if (user_id) where.user_id = user_id;
      if (start_date) where.processed_at = { ...(where.processed_at || {}), $gte: start_date };
      if (end_date) where.processed_at = { ...(where.processed_at || {}), $lte: end_date };
      const { count, rows: payments } = await Payment.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['processed_at', 'DESC']]
      });
      res.json({
        status: 'success',
        data: {
          payments,
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

  async processRefund(req, res, next) {
    try {
      const { id } = req.params;
      const { reason = 'Admin refund' } = req.body;
      // Get payment details
      const payment = await Payment.findByPk(id);
      if (!payment) {
        return res.status(404).json({
          status: 'error',
          message: 'Payment not found'
        });
      }
      if (payment.status !== 'completed') {
        return res.status(400).json({
          status: 'error',
          message: 'Only completed payments can be refunded'
        });
      }
      if (payment.refunded_at) {
        return res.status(400).json({
          status: 'error',
          message: 'Payment already refunded'
        });
      }
      // Mock refund processing
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update payment record
      const refund_transaction_id = `rfnd_${Math.random().toString(36).substring(2, 10)}`;
      await Payment.update({
        status: 'refunded',
        refunded_at: new Date(),
        refund_reason: reason,
        refund_transaction_id,
        updated_at: new Date()
      }, { where: { id } });
      const updatedPayment = await Payment.findByPk(id);
      // Update booking status to cancelled
      await Booking.update({
        status: 'cancelled',
        cancelled_at: new Date(),
        updated_at: new Date()
      }, { where: { id: payment.booking_id } });
      res.json({
        status: 'success',
        message: 'Refund processed successfully',
        data: { payment: updatedPayment }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();