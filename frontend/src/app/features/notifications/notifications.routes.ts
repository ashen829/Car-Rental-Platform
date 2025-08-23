import { Routes } from '@angular/router';

export const notificationsRoutes: Routes = [
  {
    path: 'notifications',
    loadComponent: () => import('./notifications.component').then(m => m.NotificationsComponent)
  }
];
