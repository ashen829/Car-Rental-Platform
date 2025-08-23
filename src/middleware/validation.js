const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }
    next();
  };
};

// User validation schemas
const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/).required(),
    date_of_birth: Joi.date().max('now').required(),
    license_number: Joi.string().min(5).max(20).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    first_name: Joi.string().min(2).max(50),
    last_name: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^\+?[\d\s-()]+$/),
    date_of_birth: Joi.date().max('now'),
    license_number: Joi.string().min(5).max(20)
  })
};

// Car validation schemas
const carSchemas = {
  create: Joi.object({
    make: Joi.string().min(2).max(50).required(),
    model: Joi.string().min(2).max(50).required(),
    year: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).required(),
    license_plate: Joi.string().min(3).max(15).required(),
    color: Joi.string().min(3).max(30).required(),
    category: Joi.string().valid('economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'convertible').required(),
    transmission: Joi.string().valid('manual', 'automatic').required(),
    fuel_type: Joi.string().valid('gasoline', 'diesel', 'hybrid', 'electric').required(),
    seats: Joi.number().integer().min(2).max(8).required(),
    daily_rate: Joi.number().positive().required(),
    features: Joi.array().items(Joi.string()),
    image_url: Joi.string().uri().allow(''),
    location: Joi.string().min(2).max(100).required()
  }),

  update: Joi.object({
    make: Joi.string().min(2).max(50),
    model: Joi.string().min(2).max(50),
    year: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1),
    license_plate: Joi.string().min(3).max(15),
    color: Joi.string().min(3).max(30),
    category: Joi.string().valid('economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'convertible'),
    transmission: Joi.string().valid('manual', 'automatic'),
    fuel_type: Joi.string().valid('gasoline', 'diesel', 'hybrid', 'electric'),
    seats: Joi.number().integer().min(2).max(8),
    daily_rate: Joi.number().positive(),
    features: Joi.array().items(Joi.string()),
    image_url: Joi.string().uri().allow(''),
    is_available: Joi.boolean(),
    location: Joi.string().min(2).max(100)
  })
};

// Booking validation schemas
const bookingSchemas = {
  create: Joi.object({
    car_id: Joi.string().uuid().required(),
    start_date: Joi.date().min('now').required(),
    end_date: Joi.date().greater(Joi.ref('start_date')).required(),
    pickup_location: Joi.string().min(5).max(200).required(),
    dropoff_location: Joi.string().min(5).max(200).required()
  }),

  update: Joi.object({
    start_date: Joi.date().min('now'),
    end_date: Joi.date().greater(Joi.ref('start_date')),
    pickup_location: Joi.string().min(5).max(200),
    dropoff_location: Joi.string().min(5).max(200),
    status: Joi.string().valid('pending', 'confirmed', 'active', 'completed', 'cancelled')
  })
};

// Payment validation schemas
const paymentSchemas = {
  process: Joi.object({
    booking_id: Joi.string().uuid().required(),
    payment_method: Joi.string().valid('credit_card', 'debit_card', 'paypal').required(),
    card_number: Joi.string().pattern(/^\d{16}$/).when('payment_method', {
      is: Joi.string().valid('credit_card', 'debit_card'),
      then: Joi.required()
    }),
    card_holder_name: Joi.string().min(2).max(100).when('payment_method', {
      is: Joi.string().valid('credit_card', 'debit_card'),
      then: Joi.required()
    }),
    expiry_month: Joi.number().integer().min(1).max(12).when('payment_method', {
      is: Joi.string().valid('credit_card', 'debit_card'),
      then: Joi.required()
    }),
    expiry_year: Joi.number().integer().min(new Date().getFullYear()).when('payment_method', {
      is: Joi.string().valid('credit_card', 'debit_card'),
      then: Joi.required()
    }),
    cvv: Joi.string().pattern(/^\d{3,4}$/).when('payment_method', {
      is: Joi.string().valid('credit_card', 'debit_card'),
      then: Joi.required()
    })
  })
};

module.exports = {
  validate,
  userSchemas,
  carSchemas,
  bookingSchemas,
  paymentSchemas
};