import { Component, OnInit, signal, computed } from '@angular/core';
import { Vacunacion } from '../../../shared/models/vacunacion.model';

@Component({
  selector: 'app-vacunas-aplicadas',
  standalone: true,
  imports: [],
  templateUrl: './vacunas-aplicadas.html',
  styleUrl: './vacunas-aplicadas.css'
})
export class VacunasAplicadas implements OnInit {

  terminoBusqueda = signal('');

  vacunaciones = signal<Vacunacion[]>([]);

  cargando = signal(false);

  vacunasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();

    return this.vacunaciones().filter(v =>
      !termino ||
      v.vacunaNombre.toLowerCase().includes(termino) ||
      v.numeroLote.toLowerCase().includes(termino)
    );
  });

  hayResultados = computed(() =>
    this.vacunasFiltradas().length > 0
  );

  ngOnInit(): void {
    this.cargarVacunaciones();
  }

  cargarVacunaciones(): void {
    this.cargando.set(true);

    // TODO: conectar con backend cuando esté disponible
    this.vacunaciones.set([]);

    this.cargando.set(false);
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }
}