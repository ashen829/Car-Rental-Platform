import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(c => c.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register').then(c => c.Register)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];