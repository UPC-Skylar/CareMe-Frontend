import { Routes } from '@angular/router';

export const supportRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/support-form/support-form.component').then(m => m.SupportFormComponent)
  }
];
