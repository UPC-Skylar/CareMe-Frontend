import { Routes } from '@angular/router';

export const caregiverRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/caregiver-list/caregiver-list.component').then(m => m.CaregiverListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/caregiver-detail/caregiver-detail.component').then(m => m.CaregiverDetailComponent)
  }
];
