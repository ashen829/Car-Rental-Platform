
export const environment = {
  production: false,
  api: {
    user: 'http://localhost:30001/api',
    car: 'http://localhost:30002/api',
    booking: 'http://localhost:30003/api',
    payment: 'http://localhost:30004/api',
    notification: 'http://localhost:30005/api',
  },
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