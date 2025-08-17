import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../../shared/components/placeholder/placeholder').then(c => c.PlaceholderComponent)
  }
];