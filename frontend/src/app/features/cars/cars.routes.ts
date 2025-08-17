import { Routes } from '@angular/router';

export const carsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/car-list/car-list').then(c => c.CarList)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/car-detail/car-detail').then(c => c.CarDetail)
  }
];