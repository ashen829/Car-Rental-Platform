import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent)
  }
  ,
  {
    path: 'vehicles',
    loadComponent: () => import('./admin-vehicles.component').then(m => m.AdminVehiclesComponent)
  }
  ,
  {
    path: 'vehicles/add',
    loadComponent: () => import('./admin-vehicle-add.component').then(m => m.AdminVehicleAddComponent)
  }
  ,
  {
    path: 'bookings',
    loadComponent: () => import('./admin-bookings.component').then(m => m.AdminBookingsComponent)
  }
];