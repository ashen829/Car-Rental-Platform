const Notification = require('../../models/notification');
const nodemailer = require("nodemailer");

class NotificationController {
  constructor() {
    // Initialize email transporter (mock for development)
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Mock email sending (for development)
  async sendEmail(to, subject, html) {
    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('📧 Mock Email Sent:');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Content: ${html}`);
        return { success: true, messageId: `mock_${Date.now()}` };
      }

      const info = await this.emailTransporter.sendMail({
        from: `"Car Rental Service" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });

      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async createNotification(user_id, type, title, message, metadata = {}) {
    try {
      const Notification = require('../../models/notification');
      const notification = await Notification.create({
        user_id,
        type,
        title,
        message,
        metadata,
        is_read: false
      });
      return notification;
    } catch (error) {
      console.error('Notification creation failed:', error);
      return null;
    }
  }

  async sendBookingConfirmation(booking) {
    try {
      const { user_id, id: booking_id, start_date, end_date, cars, users } = booking;
      
      // Create in-app notification
      await this.createNotification(
        user_id,
        'booking_confirmed',
        'Booking Confirmed',
        `Your booking for ${cars.make} ${cars.model} has been confirmed for ${new Date(start_date).toLocaleDateString()} to ${new Date(end_date).toLocaleDateString()}.`,
        { booking_id }
      );

      // Send email notification
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Booking Confirmation</h2>
          <p>Dear ${users.first_name} ${users.last_name},</p>
          <p>Your car rental booking has been confirmed!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Car:</strong> ${cars.make} ${cars.model}</p>
            <p><strong>Pickup Date:</strong> ${new Date(start_date).toLocaleDateString()}</p>
            <p><strong>Return Date:</strong> ${new Date(end_date).toLocaleDateString()}</p>
            <p><strong>Booking ID:</strong> ${booking_id}</p>
          </div>
          
          <p>Thank you for choosing our car rental service!</p>
          <p>Best regards,<br>Car Rental Team</p>
        </div>
      `;

      await this.sendEmail(
        users.email,
        'Booking Confirmation - Car Rental Service',
        emailHtml
      );

      return { success: true };
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
      return { success: false, error: error.message };
    }
  }

  async sendBookingReminder(booking) {
    try {
      const { user_id, id: booking_id, start_date, cars, users } = booking;
      
      // Create in-app notification
      await this.createNotification(
        user_id,
        'booking_reminder',
        'Booking Reminder',
        `Reminder: Your booking for ${cars.make} ${cars.model} starts tomorrow (${new Date(start_date).toLocaleDateString()}).`,
        { booking_id }
      );

      // Send email notification
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Booking Reminder</h2>
          <p>Dear ${users.first_name} ${users.last_name},</p>
          <p>This is a reminder that your car rental booking starts tomorrow!</p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <p><strong>Car:</strong> ${cars.make} ${cars.model}</p>
            <p><strong>Pickup Date:</strong> ${new Date(start_date).toLocaleDateString()}</p>
            <p><strong>Booking ID:</strong> ${booking_id}</p>
          </div>
          
          <p>Please ensure you have all required documents for pickup.</p>
          <p>Best regards,<br>Car Rental Team</p>
        </div>
      `;

      await this.sendEmail(
        users.email,
        'Booking Reminder - Car Rental Service',
        emailHtml
      );

      return { success: true };
    } catch (error) {
      console.error('Failed to send booking reminder:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserNotifications(req, res, next) {
    try {
      const { page = 1, limit = 20, is_read = '' } = req.query;
      const offset = (page - 1) * limit;
      const where = { user_id: req.user.id };
      if (is_read !== '') where.is_read = is_read === 'true';
      const { count, rows: notifications } = await Notification.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });
      res.json({
        status: 'success',
        data: {
          notifications,
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
    async getUserNotifications(req, res, next) {
      try {
        const { page = 1, limit = 10, is_read = '' } = req.query;
        const offset = (page - 1) * limit;
        const where = { user_id: req.user.id };
        if (is_read !== '') where.is_read = is_read === 'true';
        const { count, rows: notifications } = await Notification.findAndCountAll({
          where,
          offset: parseInt(offset),
          limit: parseInt(limit),
          order: [['createdAt', 'DESC']]
        });
        res.json({
          status: 'success',
          data: {
            notifications,
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

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const [updated] = await Notification.update({ is_read: true, read_at: new Date(), updated_at: new Date() }, { where: { id, user_id: req.user.id } });
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'Notification not found'
        });
      }
      const notification = await Notification.findByPk(id);
      res.json({
        status: 'success',
        message: 'Notification marked as read',
        data: { notification }
      });
    } catch (error) {
      next(error);
    }
  }
    async markAsRead(req, res, next) {
      try {
        const { id } = req.params;
        const [updated] = await Notification.update({ is_read: true }, { where: { id, user_id: req.user.id } });
        if (!updated) {
          return res.status(404).json({
            status: 'error',
            message: 'Notification not found'
          });
        }
        const notification = await Notification.findByPk(id);
        res.json({
          status: 'success',
          message: 'Notification marked as read',
          data: { notification }
        });
      } catch (error) {
        next(error);
      }
    }

  async deleteNotification(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await Notification.destroy({ where: { id, user_id: req.user.id } });
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Notification not found'
        });
      }
      res.json({
        status: 'success',
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
    async deleteNotification(req, res, next) {
      try {
        const { id } = req.params;
        const deleted = await Notification.destroy({ where: { id, user_id: req.user.id } });
        if (!deleted) {
          return res.status(404).json({
            status: 'error',
            message: 'Notification not found'
          });
        }
        res.json({
          status: 'success',
          message: 'Notification deleted successfully'
        });
      } catch (error) {
        next(error);
      }
    }

  async getAllNotifications(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        type = '', 
        is_read = '',
        user_id = ''
      } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (type) where.type = type;
      if (is_read !== '') where.is_read = is_read === 'true';
      if (user_id) where.user_id = user_id;
      const { count, rows: notifications } = await Notification.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });
      res.json({
        status: 'success',
        data: {
          notifications,
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

  async sendNotification(req, res, next) {
    try {
      const { user_id, type, title, message, send_email = false } = req.body;
      if (!user_id || !type || !title || !message) {
        return res.status(400).json({
          status: 'error',
          message: 'user_id, type, title, and message are required'
        });
      }
      // Create in-app notification
      const notification = await this.createNotification(user_id, type, title, message);
      // Send email if requested
      if (send_email) {
        const User = require('../../models/user');
        const user = await User.findByPk(user_id);
        if (user) {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">${title}</h2>
              <p>Dear ${user.first_name} ${user.last_name},</p>
              <p>${message}</p>
              <p>Best regards,<br>Car Rental Team</p>
            </div>
          `;
          await this.sendEmail(user.email, title, emailHtml);
        }
      }
      res.status(201).json({
        status: 'success',
        message: 'Notification sent successfully',
        data: { notification }
      });
    } catch (error) {
      next(error);
    }
  }

  async broadcastNotification(req, res, next) {
    try {
      const { type, title, message, user_role = '', send_email = false } = req.body;
      if (!type || !title || !message) {
        return res.status(400).json({
          status: 'error',
          message: 'type, title, and message are required'
        });
      }
      // Get target users
      const User = require('../../models/user');
      const where = { is_active: true };
      if (user_role) where.role = user_role;
      const users = await User.findAll({ where });
      // Create notifications for all users
      const notifications = users.map(user => ({
        user_id: user.id,
        type,
        title,
        message,
        metadata: { broadcast: true },
        is_read: false,
        created_at: new Date()
      }));
      await Notification.bulkCreate(notifications);
      // Send emails if requested
      if (send_email) {
        const emailPromises = users.map(user => {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">${title}</h2>
              <p>Dear ${user.first_name} ${user.last_name},</p>
              <p>${message}</p>
              <p>Best regards,<br>Car Rental Team</p>
            </div>
          `;
          return this.sendEmail(user.email, title, emailHtml);
        });
        await Promise.allSettled(emailPromises);
      }
      res.status(201).json({
        status: 'success',
        message: `Broadcast notification sent to ${users.length} users`,
        data: {
          recipients_count: users.length,
          email_sent: send_email
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();