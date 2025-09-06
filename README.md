# Car Rental Platform

## Overview
A full-stack car rental platform with user authentication, car management, booking, payments, and notifications. This project uses Node.js/Express for the backend and Angular for the frontend.

---

## Microservices Architecture
This platform is built using a microservices architecture, where each core business domain is implemented as an independent service. The main services are:
- **User Service**: Handles user registration, authentication, and profile management.
- **Car Service**: Manages car inventory, details, and availability.
- **Booking Service**: Manages booking creation, updates, and cancellations.
Each service has its own database tables and communicates with others via RESTful APIs. This separation allows for independent scaling, deployment, and maintenance.

## Cloud Architecture
The platform is designed for cloud-native deployment using Docker and Kubernetes. Key cloud architecture features include:
- **Containerization**: All services (backend, frontend, database) are packaged as Docker containers for consistency across environments.
- **Orchestration**: Kubernetes manages deployment, scaling, and self-healing of all services. Each service runs in its own pod, and services are exposed via Kubernetes Services (NodePort for local/demo, LoadBalancer for cloud).
- **Persistent Storage**: MySQL uses a PersistentVolumeClaim (PVC) to ensure data durability across pod restarts.
- **Configuration as Code**: All deployment manifests (YAML) are version-controlled, enabling reproducible infrastructure.
- **Environment Management**: Environment variables are managed via Kubernetes ConfigMaps and Secrets, ensuring secure and consistent configuration.
- **Self-Healing**: Kubernetes automatically restarts failed pods, ensuring high availability.

## Deployment Details
1. **Build Docker Images**: Each service has its own Dockerfile. Images are built and pushed to a container registry.
2. **Apply Kubernetes Manifests**: Use `kubectl apply -f k8s/` to deploy all services, including MySQL, backend microservices, and frontend.
3. **Expose Services**: NodePort is used for local/demo access
4. **Environment Variables**: Managed via Kubernetes manifests, not included in Docker images. Sensitive data is stored in Secrets.
5. **Persistent Data**: MySQL uses a PVC for data persistence.
6. **Scaling & Self-Healing**: Kubernetes ensures services are always running and can be scaled as needed.
7. **Validation**: Use `kubectl get pods`, `kubectl logs`, and browser access to verify all services are running and connected.


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


---

## Usage
- Clone the repository
- Install dependencies: `npm install`
- Start backend: `node server.js`
- Start frontend: `cd frontend && npm install && npm start`


