import { Routes } from '@angular/router';

export const bookingsRoutes: Routes = [
  {
    path: '',
  loadComponent: () => import('./bookings.component').then(c => c.BookingsComponent)
  }
];