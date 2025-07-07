import { Routes } from '@angular/router';

export const subscriptionRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/subscription-plans/subscription-plans.component').then(m => m.SubscriptionPlansComponent)
  }
];
