// feature/ciudadano/ciudadano-layout/ciudadano-layout.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppHeader } from '../../../shared/components/app-header/app-header';
import { AppSidebar, MenuItem } from '../../../shared/components/app-sidebar/app-sidebar';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-ciudadano-layout',
  standalone: true,
  imports: [RouterOutlet, AppHeader, AppSidebar],
  templateUrl: './ciudadano-layout.html',
  styleUrl: './ciudadano-layout.css'
})
export class CiudadanoLayout {

  nombreUsuario: string;

menuItems: MenuItem[] = [
  { label: 'Mi carné', ruta: 'carnet', icon: 'bi bi-person' },
  { label: 'Vacunas aplicadas', ruta: 'vacunas-aplicadas', icon: 'bi bi-clipboard-check' },
  { label: 'Vacunas pendientes', ruta: 'vacunas-pendientes', icon: 'bi bi-file-medical' },
  { label: 'Recordatorios', ruta: 'recordatorios', icon: 'bi bi-bell' }
];

  constructor(private authService: AuthService) {
  const usuario = this.authService.usuarioActual();

  this.nombreUsuario = usuario
    ? `${usuario.nombre} ${usuario.apellido}`
    : '';
}
}