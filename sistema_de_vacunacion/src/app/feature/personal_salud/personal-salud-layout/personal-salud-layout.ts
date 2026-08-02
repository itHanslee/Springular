// feature/personal_salud/personal-salud-layout/personal-salud-layout.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../../../shared/components/app-header/app-header';
import { AppSidebar, MenuItem } from '../../../shared/components/app-sidebar/app-sidebar';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-personal-salud-layout',
  standalone: true,
  imports: [RouterOutlet, AppHeader, AppSidebar],
  templateUrl: './personal-salud-layout.html',
  styleUrl: './personal-salud-layout.css'
})
export class PersonalSaludLayout {
  nombreUsuario: string; 

  menuItems: MenuItem[] = [
    { label: 'Ciudadanos', ruta: 'ciudadanos', icon: 'bi bi-people' },
    { label: 'Registrar vacunación', ruta: 'registrar-vacunacion', icon: 'bi bi-journal-medical' },
    { label: 'Inventario', ruta: 'inventario', icon: 'bi bi-box-seam' },
    { label: 'Reportes', ruta: 'reportes', icon: 'bi bi-bar-chart' },
    { label: 'Historial clínico', ruta: 'historial-clinico', icon: 'bi bi-file-medical' },
  ];

  constructor(private authService: AuthService) {
    
    this.nombreUsuario = this.authService.usuarioActual()?.nombre ?? '';
  }
}