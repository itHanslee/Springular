
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../../../shared/components/app-header/app-header';
import { AppSidebar, MenuItem } from '../../../shared/components/app-sidebar/app-sidebar';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-administrador-layout',
  standalone: true,
  imports: [RouterOutlet, AppHeader, AppSidebar],
  templateUrl: './administrador-layout.html',
  styleUrls: ['./administrador-layout.css'],
})
export class AdministradorLayout {
  nombreUsuario: string; 

  menuItems: MenuItem[] = [
    { label: 'Auditorias globales', ruta: 'auditorias-globales', icon: 'bi bi-list-ul' },
    { label: 'Gestionar vacunas', ruta: 'gestionar-vacunas', icon: 'bi bi-folder-plus' },
    { label: 'Personal salud', ruta: 'personal-salud', icon: 'bi bi-people' }
  ];

  constructor(private authService: AuthService) {
    // 👇 se asigna DENTRO del constructor, cuando authService ya existe
    this.nombreUsuario = this.authService.usuarioActual().nombre;
  }
}