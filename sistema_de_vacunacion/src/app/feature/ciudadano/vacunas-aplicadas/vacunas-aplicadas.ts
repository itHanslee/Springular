import { Component, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Vacunacion } from '../../../shared/models/vacunacion.model';
import { VacunacionService } from '../../../core/services/vacunacion';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-vacunas-aplicadas',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './vacunas-aplicadas.html',
  styleUrl: './vacunas-aplicadas.css'
})
export class VacunasAplicadas implements OnInit {

  terminoBusqueda = signal('');

  vacunaciones = signal<Vacunacion[]>([]);

  cargando = signal(false);

  constructor(
    private vacunacionService: VacunacionService,
    private authService: AuthService
  ) {}

  vacunasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();

    return this.vacunaciones().filter(v =>
      !termino ||
      v.vacuna.toLowerCase().includes(termino) ||
      (v.numeroLote ?? '').toLowerCase().includes(termino)
    );
  });

  hayResultados = computed(() =>
    this.vacunasFiltradas().length > 0
  );

  ngOnInit(): void {
    this.cargarVacunaciones();
  }

  cargarVacunaciones(): void {

    const usuario = this.authService.usuarioActual();

    if (!usuario) {
      this.vacunaciones.set([]);
      return;
    }

    const idCiudadano = usuario.id;

    this.cargando.set(true);

    this.vacunacionService.obtenerVacunasCiudadano(idCiudadano).subscribe({
      next: (datos: Vacunacion[]) => {
        console.log(' VACUNAS APLICADAS:', datos);

        this.vacunaciones.set(datos);
        this.cargando.set(false);
      },

      error: (error: unknown) => {
        console.error(' ERROR AL CARGAR VACUNAS APLICADAS:', error);

        this.vacunaciones.set([]);
        this.cargando.set(false);
      }
    });
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }
}