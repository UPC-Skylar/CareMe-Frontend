import { Routes } from '@angular/router';

export const favoritesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/favorites-list/favorites-list.component').then(m => m.FavoritesListComponent)
  }
];
