import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes)
  },
  {
    path: 'caregivers',
    loadChildren: () => import('./caregiver-management/caregiver-management.routes').then(m => m.caregiverRoutes)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.routes').then(m => m.profileRoutes)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./subscription/subscription.routes').then(m => m.subscriptionRoutes)
  },
  {
    path: 'favorites',
    loadChildren: () => import('./favorites/favorites.routes').then(m => m.favoritesRoutes)
  },
  {
    path: 'history',
    loadChildren: () => import('./history/history.routes').then(m => m.historyRoutes)
  },
  {
    path: 'support',
    loadChildren: () => import('./support/support.routes').then(m => m.supportRoutes)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
