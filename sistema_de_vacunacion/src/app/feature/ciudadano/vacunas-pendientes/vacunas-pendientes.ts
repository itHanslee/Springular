import { Component, OnInit, signal, computed } from '@angular/core';

interface VacunaPendiente {
  vacuna: string;
  estado: string;
  proxima: boolean;
}

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

    if (!termino) return this.vacunasPendientes();

    return this.vacunasPendientes().filter(v =>
      v.vacuna.toLowerCase().includes(termino) ||
      v.estado.toLowerCase().includes(termino)
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

    this.vacunasPendientes.set([
      {
        vacuna: 'Refuerzo influenza',
        estado: 'Próxima',
        proxima: true
      },
      {
        vacuna: 'Refuerzo Tétanos',
        estado: 'En 4 meses',
        proxima: false
      }
    ]);

    this.cargando.set(false);
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }
}