# Car Rental Platform

## Overview
A full-stack car rental platform with user authentication, car management, booking, payments, and notifications. This project uses Node.js/Express for the backend and Angular for the frontend.

---

## API Endpoints

### User Endpoints
- `POST /api/user/register` — Register a new user
- `POST /api/user/login` — User login
- `GET /api/user/profile` — Get current user's profile (auth required)
- `PUT /api/user/profile` — Update current user's profile (auth required)
- `POST /api/user/logout` — Logout current user (auth required)
- `GET /api/user/` — Get all users (admin only)
- `GET /api/user/:id` — Get user by ID (admin only)
- `PUT /api/user/:id/profile` — Admin update user profile (admin only)
- `PUT /api/user/:id/status` — Update user status (admin only)
- `DELETE /api/user/:id` — Delete user (admin only)

### Car Endpoints
- `GET /api/car/` — List all cars
- `GET /api/car/search` — Search cars
- `GET /api/car/:id` — Get car details
- `POST /api/car/` — Add a new car (admin only)
- `PUT /api/car/:id` — Update car details (admin only)
- `DELETE /api/car/:id` — Delete a car (admin only)
- `PUT /api/car/:id/availability` — Update car availability (admin only)

### Booking Endpoints
- `POST /api/booking/` — Create a booking (auth required)
- `GET /api/booking/my-bookings` — Get user's bookings (auth required)
- `GET /api/booking/:id` — Get booking by ID (auth required)
- `PUT /api/booking/:id` — Update booking (auth required)
- `POST /api/booking/:id/cancel` — Cancel booking (auth required)
- `GET /api/booking/` — Get all bookings (admin only)
- `PUT /api/booking/:id/status` — Update booking status (admin only)

### Payment Endpoints
- `POST /api/payment/process` — Process a payment (auth required)
- `GET /api/payment/booking/:bookingId` — Get payment by booking (auth required)
- `GET /api/payment/:id` — Get payment by ID (auth required)
- `GET /api/payment/` — Get all payments (admin only)
- `POST /api/payment/:id/refund` — Process a refund (admin only)

### Notification Endpoints
- `GET /api/notification/my-notifications` — Get user's notifications (auth required)
- `PUT /api/notification/:id/read` — Mark notification as read (auth required)
- `DELETE /api/notification/:id` — Delete notification (auth required)
- `GET /api/notification/` — Get all notifications (admin only)
- `POST /api/notification/send` — Send notification (admin only)
- `POST /api/notification/broadcast` — Broadcast notification (admin only)

---

## Usage
- Clone the repository
- Install dependencies: `npm install`
- Start backend: `node server.js`
- Start frontend: `cd frontend && npm install && npm start`

## License
MIT
