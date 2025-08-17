/*
  # Sample Data for Car Rental System

  1. Sample Data
    - Admin user account
    - Sample cars in different categories
    - Test bookings and payments
    - Sample notifications

  2. Test Accounts
    - Admin: admin@carrental.com / admin123
    - User: john.doe@example.com / password123
*/

-- Insert sample admin user
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, date_of_birth, license_number, role, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@carrental.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Admin', 'User', '+1234567890', '1985-01-01', 'ADMIN001', 'admin', true),
('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'John', 'Doe', '+1987654321', '1990-05-15', 'DL123456789', 'user', true),
('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Jane', 'Smith', '+1555123456', '1988-08-22', 'DL987654321', 'user', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample cars
INSERT INTO cars (id, make, model, year, license_plate, color, category, transmission, fuel_type, seats, daily_rate, features, image_url, is_available) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Toyota', 'Corolla', 2023, 'ABC123', 'White', 'economy', 'automatic', 'gasoline', 5, 35.00, '{"Air Conditioning", "Bluetooth", "Backup Camera"}', 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg', true),
('660e8400-e29b-41d4-a716-446655440001', 'Honda', 'Civic', 2023, 'DEF456', 'Silver', 'compact', 'automatic', 'gasoline', 5, 40.00, '{"Air Conditioning", "Bluetooth", "Backup Camera", "Lane Assist"}', 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg', true),
('660e8400-e29b-41d4-a716-446655440002', 'Nissan', 'Altima', 2023, 'GHI789', 'Black', 'midsize', 'automatic', 'gasoline', 5, 50.00, '{"Air Conditioning", "Bluetooth", "Backup Camera", "Heated Seats"}', 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg', true),
('660e8400-e29b-41d4-a716-446655440003', 'Ford', 'Explorer', 2023, 'JKL012', 'Blue', 'suv', 'automatic', 'gasoline', 7, 75.00, '{"Air Conditioning", "Bluetooth", "Backup Camera", "Third Row Seating", "4WD"}', 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg', true),
('660e8400-e29b-41d4-a716-446655440004', 'BMW', '3 Series', 2023, 'MNO345', 'Red', 'luxury', 'automatic', 'gasoline', 5, 95.00, '{"Air Conditioning", "Bluetooth", "Backup Camera", "Leather Seats", "Sunroof", "Premium Audio"}', 'https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg', true),
('660e8400-e29b-41d4-a716-446655440005', 'Tesla', 'Model 3', 2023, 'PQR678', 'White', 'luxury', 'automatic', 'electric', 5, 85.00, '{"Air Conditioning", "Bluetooth", "Backup Camera", "Autopilot", "Supercharging", "Premium Interior"}', 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg', true),
('660e8400-e29b-41d4-a716-446655440006', 'Chevrolet', 'Malibu', 2022, 'STU901', 'Gray', 'midsize', 'automatic', 'gasoline', 5, 45.00, '{"Air Conditioning", "Bluetooth", "Backup Camera"}', 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg', true),
('660e8400-e29b-41d4-a716-446655440007', 'Jeep', 'Wrangler', 2023, 'VWX234', 'Green', 'suv', 'manual', 'gasoline', 4, 70.00, '{"Air Conditioning", "Bluetooth", "4WD", "Removable Top"}', 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg', true)
ON CONFLICT (license_plate) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (id, user_id, car_id, start_date, end_date, pickup_location, dropoff_location, total_amount, status) VALUES
('770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', '2024-02-01', '2024-02-05', 'Downtown Office', 'Downtown Office', 140.00, 'completed'),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '2024-02-10', '2024-02-12', 'Airport Terminal', 'Airport Terminal', 80.00, 'confirmed'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '2024-02-15', '2024-02-20', 'Hotel Pickup', 'Airport Terminal', 375.00, 'pending')
ON CONFLICT (id) DO NOTHING;

-- Insert sample payments
INSERT INTO payments (id, booking_id, user_id, amount, payment_method, status, transaction_id, processed_at) VALUES
('880e8400-e29b-41d4-a716-446655440000', '770e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 140.00, 'credit_card', 'completed', 'txn_12345678', '2024-01-25 10:00:00'),
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 80.00, 'debit_card', 'completed', 'txn_87654321', '2024-02-08 14:30:00')
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (id, user_id, type, title, message, is_read) VALUES
('990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'booking_confirmed', 'Booking Confirmed', 'Your booking for Toyota Corolla has been confirmed for Feb 1-5, 2024.', true),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'booking_confirmed', 'Booking Confirmed', 'Your booking for Honda Civic has been confirmed for Feb 10-12, 2024.', false),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'booking_reminder', 'Booking Reminder', 'Reminder: Your booking for Ford Explorer starts tomorrow (Feb 15, 2024).', false),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'welcome', 'Welcome to Car Rental Service', 'Welcome to our car rental platform! We are excited to serve you.', false),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'welcome', 'Welcome to Car Rental Service', 'Welcome to our car rental platform! We are excited to serve you.', false)
ON CONFLICT (id) DO NOTHING;