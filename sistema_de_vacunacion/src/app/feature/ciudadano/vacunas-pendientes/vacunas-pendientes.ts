import { Component, OnInit, signal, computed } from '@angular/core';
import { VacunaPendiente } from '../../../shared/models/vacunacion.model';

@Component({
  selector: 'app-vacunas-pendientes',
  standalone: true,
  imports: [],
  templateUrl: './vacunas-pendientes.html',
  styleUrl: './vacunas-pendientes.css',
})
export class VacunasPendientes implements OnInit {

  terminoBusqueda = signal('');

  vacunasPendientes = signal<VacunaPendiente[]>([]);

  cargando = signal(false);

  vacunasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();

    return this.vacunasPendientes().filter(v =>
      !termino ||
      v.vacunaNombre.toLowerCase().includes(termino) ||
      v.descripcion.toLowerCase().includes(termino)
    );
  });

  hayResultados = computed(() =>
    this.vacunasFiltradas().length > 0
  );

  ngOnInit(): void {
    this.cargarVacunasPendientes();
  }

  cargarVacunasPendientes(): void {
    this.cargando.set(true);

    // TODO: conectar con backend cuando esté disponible
    this.vacunasPendientes.set([]);

    this.cargando.set(false);
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }
}