import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component'),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];
