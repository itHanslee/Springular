import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { CiudadanoService } from '../../../core/services/ciudadano';
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
  descargando = signal(false);

  constructor(
    private authService: AuthService,
    private ciudadanoService: CiudadanoService
  ) {}

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

    descargarCarnet(): void {

    const datos = this.ciudadano();

    if (!datos) {
      console.error(
        'No hay información del ciudadano.'
      );

      return;
    }

    this.descargando.set(true);

    this.ciudadanoService
      .descargarCarne(datos.id)
      .subscribe({

        next: (archivo: Blob) => {

          const url =
            window.URL.createObjectURL(archivo);

          const enlace =
            document.createElement('a');

          enlace.href = url;

          enlace.download =
            'carnet-vacunacion-delta.pdf';
          enlace.click();

          window.URL.revokeObjectURL(url);

          this.descargando.set(false);
        },

        error: (error: unknown) => {

          console.error(
            'Error al descargar el carnet:',
            error
          );

          this.descargando.set(false);
        }
      });
  }
}