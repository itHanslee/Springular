import { Routes } from '@angular/router';

// app.routes.ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./feature/public/home/home').then(m => m.Home) },
  { path: 'personal_salud', loadComponent: () => import('./feature/personal_salud/ciudadanos/ciudadanos').then(m => m.Ciudadanos) }
  // ...resto de rutas
];