const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    status: 'error',
    message: err.message || 'Internal server error',
    statusCode: err.statusCode || 500
  };

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = err.details?.[0]?.message || 'Validation error';
    error.statusCode = 400;
  }

  // ...existing code...
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        error.message = 'Resource already exists';
        error.statusCode = 409;
        break;
      case '23503': // Foreign key violation
        error.message = 'Referenced resource not found';
        error.statusCode = 400;
        break;
      case '23502': // Not null violation
        error.message = 'Required field missing';
        error.statusCode = 400;
        break;
    }
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && error.statusCode === 500) {
    error.message = 'Internal server error';
  }

  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;