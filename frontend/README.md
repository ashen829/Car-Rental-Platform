# Car Rental Platform - Frontend

A modern Angular 17+ frontend application for the Car Rental Platform, built with Angular Material and featuring a comprehensive component architecture.

## 🚀 Features

### Core Architecture
- **Angular 17+** with standalone components
- **Angular Material** UI library with custom theming
- **Lazy-loaded modules** for optimal performance
- **JWT-based authentication** with interceptors
- **Route guards** for protected routes
- **Reactive forms** with validation
- **TypeScript** for type safety
- **SCSS** for styling

### Feature Modules

#### 🔐 Authentication Module
- **Login Component**: Email/password authentication with Material design
- **Register Component**: User registration with validation
- **Auth Service**: JWT token management, session handling
- **Auth Interceptor**: Automatic token attachment to HTTP requests
- **Auth Guards**: Route protection for authenticated and admin users

#### 🚗 Cars Module
- **Car List Component**: Grid view of available cars with filtering
- **Car Detail Component**: Detailed car information and booking
- **Car Service**: REST API integration for car management
- **Search & Filter**: Category-based filtering and search

#### 📋 Bookings Module (Scaffold)
- **Booking Service**: API integration for booking management
- **Components**: List, create, and detail views (placeholders ready)
- **Booking Management**: Create, view, and cancel bookings

#### 👤 Profile Module (Scaffold)
- **Profile Service**: User profile management
- **Components**: View and edit profile (placeholders ready)

#### 👨‍💼 Admin Module (Scaffold)
- **Admin Guards**: Role-based access control
- **Management Components**: Cars, bookings, users (placeholders ready)
- **Dashboard**: Admin overview (placeholder ready)

### 🛠 Technical Features
- **Environment Configuration**: Development and production configs
- **HTTP Client**: Centralized API service with interceptors
- **Error Handling**: Global error management
- **Responsive Design**: Mobile-first approach with Material breakpoints
- **Modern Angular**: Uses latest Angular features and best practices

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 17+

### Quick Start

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   - Update `src/environments/environment.ts` with your API URL
   - For production: update `src/environments/environment.prod.ts`

3. **Start development server**
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Access the application**
   - Open http://localhost:4200
   - The app will automatically reload when you change source files

## 🔧 Configuration

### Environment Variables

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Car Rental Platform',
  version: '1.0.0'
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  production: true,
  apiUrl: '/api',
  appName: 'Car Rental Platform',
  version: '1.0.0'
};
```

## 🔌 API Integration

The frontend is designed to work with the Car Rental Platform backend API:

### API Endpoints

- **Authentication**: `/api/users/login`, `/api/users/register`
- **Cars**: `/api/cars`, `/api/cars/search`, `/api/cars/:id`
- **Bookings**: `/api/bookings`, `/api/bookings/my-bookings`
- **Profile**: `/api/users/profile`

### Authentication Flow

1. User logs in via `/auth/login`
2. JWT token is stored in localStorage
3. Auth interceptor automatically adds token to API requests
4. Auth service manages user state and logout

## 🛡 Security Features

- **JWT Token Management**: Secure token storage and automatic refresh
- **Route Guards**: Protection for authenticated and admin routes
- **Input Validation**: Form validation with Angular reactive forms
- **CORS**: Configured for secure cross-origin requests
- **XSS Protection**: Angular's built-in sanitization

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full navigation and features
- **Tablet**: Optimized layout with touch-friendly interactions
- **Mobile**: Simplified navigation and mobile-optimized components

## 🚀 Development Workflow

### Available Scripts

```bash
# Development
npm start              # Start dev server
npm run build          # Build for production
npm run test           # Run unit tests

# Angular CLI
ng generate component <name>    # Generate component
ng generate service <name>      # Generate service
ng generate module <name>       # Generate module
```

## 🔮 Future Development

The scaffold includes placeholders for:

1. **Booking Management**: Complete booking workflow
2. **User Profile**: Profile editing and management
3. **Admin Dashboard**: System administration features
4. **Payment Integration**: Payment processing components
5. **Notifications**: Real-time notification system
6. **Advanced Search**: Location-based search and filters
7. **Car Management**: Admin car inventory management

## 📄 License

This project is licensed under the MIT License.
