# Car Rental Microservices Backend

A comprehensive car rental management system built with Node.js, Express, and Supabase, featuring a microservices architecture.

## 🚗 Features

### Core Services
- **User Service**: Authentication, user profiles, role-based access (Users/Admins)
- **Car Service**: Vehicle inventory management, availability tracking, search functionality
- **Booking Service**: Reservation system with date conflict prevention
- **Payment Service**: Mock payment gateway integration with transaction management
- **Notification Service**: In-app notifications and email alerts

### Key Capabilities
- JWT-based authentication with role authorization
- Real-time availability checking and booking conflict resolution
- Comprehensive payment processing with refund support
- Email notifications for booking confirmations and reminders
- Admin dashboard functionality for system management
- RESTful API design with proper HTTP status codes
- Input validation and comprehensive error handling

## 🛠 Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Joi schema validation
- **Email**: Nodemailer (configurable SMTP)
- **Security**: Helmet, CORS, Row Level Security (RLS)

## 📋 Prerequisites

- Node.js (v16 or higher)
- Supabase account and project
- SMTP email service (optional, for email notifications)

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Connect to Supabase**
   - Click the "Connect to Supabase" button in the top right
   - This will automatically populate your `.env` file with database credentials

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your email service credentials (optional).

4. **Start the Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890",
  "date_of_birth": "1990-01-01",
  "license_number": "DL123456789"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Car Management

#### Get Available Cars
```http
GET /api/cars?available_only=true&category=economy&page=1&limit=10
```

#### Search Cars by Date
```http
GET /api/cars/search?start_date=2024-03-01&end_date=2024-03-05&category=suv
```

#### Create Car (Admin Only)
```http
POST /api/cars
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "license_plate": "ABC123",
  "color": "White",
  "category": "midsize",
  "transmission": "automatic",
  "fuel_type": "gasoline",
  "seats": 5,
  "daily_rate": 50.00,
  "features": ["Air Conditioning", "Bluetooth"],
  "image_url": "https://example.com/car-image.jpg"
}
```

### Booking Management

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "car_id": "car-uuid-here",
  "start_date": "2024-03-01",
  "end_date": "2024-03-05",
  "pickup_location": "Downtown Office",
  "dropoff_location": "Airport Terminal"
}
```

#### Get User Bookings
```http
GET /api/bookings/my-bookings?status=confirmed&page=1&limit=10
Authorization: Bearer <jwt_token>
```

#### Cancel Booking
```http
POST /api/bookings/{booking_id}/cancel
Authorization: Bearer <jwt_token>
```

### Payment Processing

#### Process Payment
```http
POST /api/payments/process
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "booking_id": "booking-uuid-here",
  "payment_method": "credit_card",
  "card_number": "4111111111111111",
  "card_holder_name": "John Doe",
  "expiry_month": 12,
  "expiry_year": 2025,
  "cvv": "123"
}
```

#### Test Card Numbers
- `4111111111111111` - Success
- `4000000000000002` - Card declined
- `4000000000000119` - Processing error

### Notifications

#### Get User Notifications
```http
GET /api/notifications/my-notifications?is_read=false&page=1&limit=20
Authorization: Bearer <jwt_token>
```

#### Mark Notification as Read
```http
PUT /api/notifications/{notification_id}/read
Authorization: Bearer <jwt_token>
```

## 🔐 Authentication & Authorization

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **user**: Can manage their own bookings, payments, and profile
- **admin**: Full system access including user management and car inventory

## 🗄 Database Schema

The system uses the following main tables:
- `users` - User accounts and profiles
- `cars` - Vehicle inventory
- `bookings` - Rental reservations
- `payments` - Payment transactions
- `notifications` - System notifications

All tables have Row Level Security (RLS) enabled for data protection.

## 🧪 Testing

### Sample Test Accounts
- **Admin**: `admin@carrental.com` / `admin123`
- **User**: `john.doe@example.com` / `password123`

### API Testing
Use tools like Postman, Insomnia, or curl to test the API endpoints. The system includes comprehensive error handling and validation.

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `EMAIL_HOST` - SMTP server host
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password

## 📊 Health Check

Check API status:
```http
GET /health
```

Returns service status and availability information.

## 🚀 Deployment

The application is ready for deployment to platforms like:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

Ensure environment variables are properly configured in your deployment environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.