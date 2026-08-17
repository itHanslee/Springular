import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { Usuario } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-carnet',
  standalone: true,
  imports: [],
  templateUrl: './carnet.html',
  styleUrl: './carnet.css'
})
export class Carnet implements OnInit {

  ciudadano = signal<Usuario | null>(null);

  cargando = signal(false);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarCarnet();
  }

  cargarCarnet(): void {
    this.cargando.set(true);

    this.authService.cargarUsuarioActual().subscribe({
      next: (datos: Usuario) => {
        this.ciudadano.set(datos);
        this.cargando.set(false);
      },

      error: (error: unknown) => {
        console.error(
          'Error al cargar los datos del ciudadano:',
          error
        );

        this.cargando.set(false);
      }
    });
  }
}