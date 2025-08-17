import { Routes } from '@angular/router';

export const bookingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../shared/components/placeholder/placeholder').then(c => c.PlaceholderComponent)
  }
];