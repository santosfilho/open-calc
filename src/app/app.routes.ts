import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'tempo', loadChildren: () => import('./features/time/time.routes').then(m => m.TIME_ROUTES) },
  { path: 'financas', loadChildren: () => import('./features/finance/finance.routes').then(m => m.FINANCE_ROUTES) },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
