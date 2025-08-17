const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const Booking = require('../../models/booking');

class UserController {
  // Admin: update any user's profile
  async adminUpdateUserProfile(req, res, next) {
    try {
      const { id } = req.params;
      const [updated] = await User.update(req.body, { where: { id } });
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      const user = await User.findByPk(id);
      res.json({
        status: 'success',
        message: 'User profile updated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
  async register(req, res, next) {
    try {
      const { email, password, first_name, last_name, phone, date_of_birth, license_number, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          status: 'error',
          message: 'User with this email already exists'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Only allow 'admin' role if explicitly provided, otherwise default to 'user'
      const userRole = role === 'admin' ? 'admin' : 'user';

      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        phone,
        date_of_birth,
        license_number,
        role: userRole
      });

      // Generate JWT token with actual user role
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userData = user.toJSON();
      delete userData.password;

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
          user: userData,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Invalid email or password'
        });
      }

      // Generate JWT token with actual user role
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      // Remove password from response
      const userData = user.toJSON();
      delete userData.password;

      res.json({
        status: 'success',
        message: 'Login successful',
        data: {
          user: userData,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      res.json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const [updated] = await User.update(req.body, { where: { id: req.user.id } });
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      const user = await User.findByPk(req.user.id);
      res.json({
        status: 'success',
        message: 'Profile updated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // In a real application, you might want to blacklist the token
      res.json({
        status: 'success',
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 10, search = '', role = '' } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (search) {
        where[User.sequelize.Op.or] = [
          { first_name: { [User.sequelize.Op.like]: `%${search}%` } },
          { last_name: { [User.sequelize.Op.like]: `%${search}%` } },
          { email: { [User.sequelize.Op.like]: `%${search}%` } }
        ];
      }
      if (role) where.role = role;
      const { count, rows: users } = await User.findAndCountAll({
        where,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']]
      });
      res.json({
        status: 'success',
        data: {
          users,
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

  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      res.json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      const [updated] = await User.update({ is_active }, { where: { id } });
      if (!updated) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      const user = await User.findByPk(id);
      res.json({
        status: 'success',
        message: `User ${is_active ? 'activated' : 'deactivated'} successfully`,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      // Check if user has active bookings
      const activeBookings = await Booking.findAll({
        where: {
          user_id: id,
          status: ['pending', 'confirmed', 'active']
        }
      });
      if (activeBookings && activeBookings.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete user with active bookings'
        });
      }
      const deleted = await User.destroy({ where: { id } });
      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      res.json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();