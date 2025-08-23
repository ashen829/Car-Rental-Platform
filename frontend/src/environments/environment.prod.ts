export const environment = {
  production: true,
  apiUrl: '/api',
  appName: 'Car Rental Platform',
  version: '1.0.0'
};

export const endpoints = {
  auth: {
    login: 'users/login',
    logout: 'users/logout',
    register: 'users/register',
    me: 'users/me'
  },
  cars: {
    list: 'cars',
    search: 'cars/search',
    detail: 'cars/{id}',
    availability: 'cars/{id}/availability'
  },
  bookings: {
    list: 'bookings',
    myBookings: 'bookings/my-bookings',
    create: 'bookings',
    detail: 'bookings/{id}',
    cancel: 'bookings/{id}/cancel'
  },
  notifications: {
    myNotifications: 'notifications/my-notifications',
    markRead: 'notifications/{id}/read'
  },
  users: {
    profile: 'users/profile'
  }
};