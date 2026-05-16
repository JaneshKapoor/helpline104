import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'role-selection',
    loadComponent: () => import('./features/auth/role-selection/role-selection').then(m => m.RoleSelectionComponent),
    canActivate: [authGuard],
  },

  // Protected routes inside main layout
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'calls',
        loadComponent: () => import('./features/call-management/call-management').then(m => m.CallManagementComponent),
      },
      {
        path: 'beneficiary',
        loadComponent: () => import('./features/beneficiary/beneficiary').then(m => m.BeneficiaryComponent),
      },
      {
        path: 'case-sheet',
        redirectTo: '/dashboard',
      },
      {
        path: 'reports',
        redirectTo: '/dashboard',
      },
      {
        path: 'settings',
        redirectTo: '/dashboard',
      },
    ],
  },

  { path: '**', redirectTo: '/login' },
];
