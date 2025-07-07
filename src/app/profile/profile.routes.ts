import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/profile-view/profile-view.component').then(m => m.ProfileViewComponent)
  }
];
