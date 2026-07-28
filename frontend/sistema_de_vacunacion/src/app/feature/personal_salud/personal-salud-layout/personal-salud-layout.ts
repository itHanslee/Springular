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
    { label: 'Ciudadanos', ruta: 'ciudadanos' },
    { label: 'Registrar vacunación', ruta: 'registrar-vacunacion' },
    { label: 'Inventario', ruta: 'inventario' },
    { label: 'Reportes', ruta: 'reportes' },
    { label: 'Historial clínico', ruta: 'historial-clinico' },
  ];

  constructor(private authService: AuthService) {
    // 👇 se asigna DENTRO del constructor, cuando authService ya existe
    this.nombreUsuario = this.authService.usuarioActual().nombre;
  }
}