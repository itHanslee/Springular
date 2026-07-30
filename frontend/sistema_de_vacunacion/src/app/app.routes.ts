// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./feature/public/home/home').then(m => m.Home)
  },

  {
    path: 'ciudadano',
    loadComponent: () =>
      import('./feature/ciudadano/ciudadano-layout/ciudadano-layout').then(m => m.CiudadanoLayout),
    canActivate: [authGuard, roleGuard('CIUDADANO')],
    children: [
      { path: 'carnet', loadComponent: () =>
          import('./feature/ciudadano/carnet/carnet').then(m => m.Carnet) },
      { path: 'vacunas-aplicadas', loadComponent: () =>
          import('./feature/ciudadano/vacunas-aplicadas/vacunas-aplicadas').then(m => m.VacunasAplicadas) },
      { path: 'vacunas-pendientes', loadComponent: () =>
          import('./feature/ciudadano/vacunas-pendientes/vacunas-pendientes').then(m => m.VacunasPendientes) },
      { path: 'recordatorios', loadComponent: () =>
          import('./feature/ciudadano/recordatorios/recordatorios').then(m => m.Recordatorios) },
      { path: '', redirectTo: 'carnet', pathMatch: 'full' }
    ]
  },

  {
    path: 'personal-salud',
    loadComponent: () =>
      import('./feature/personal_salud/personal-salud-layout/personal-salud-layout').then(m => m.PersonalSaludLayout),
    canActivate: [authGuard, roleGuard('PERSONAL_SALUD')],
    children: [
      { path: 'ciudadanos', loadComponent: () =>
          import('./feature/personal_salud/ciudadanos/ciudadanos').then(m => m.Ciudadanos) },
      { path: 'registrar-vacunacion', loadComponent: () =>
          import('./feature/personal_salud/registrar-vacunacion/registrar-vacunacion').then(m => m.RegistrarVacunacion) },
      { path: 'inventario', loadComponent: () =>
          import('./feature/personal_salud/inventario/inventario').then(m => m.Inventario) },
      { path: 'reportes', loadComponent: () =>
          import('./feature/personal_salud/reportes/reportes').then(m => m.ReportesComponent) },
      { path: 'historial-clinico', loadComponent: () =>
          import('./feature/personal_salud/historial-clinico/historial-clinico').then(m => m.HistorialClinico) },
      { path: '', redirectTo: 'ciudadanos', pathMatch: 'full' }
    ]
  },

  {
    path: 'administrador',
    loadComponent: () =>
      import('./feature/administrador/administrador-layout/administrador-layout').then(m => m.AdministradorLayout),
    canActivate: [authGuard, roleGuard('ADMINISTRADOR')],
    children: [
      { path: 'auditorias-globales', loadComponent: () =>
          import('./feature/administrador/auditorias-globales/auditorias-globales').then(m => m.AuditoriasGlobales) },
      { path: 'personal-salud', loadComponent: () =>
          import('./feature/administrador/registrar-personal-salud/personal-salud').then(m => m.PersonalSaludCo) },
      { path: 'gestionar-vacunas', loadComponent: () =>
          import('./feature/administrador/gestionar-vacunas/gestionar-vacunas').then(m => m.GestionarVacunas) },
      { path: '', redirectTo: 'auditorias-globales', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];