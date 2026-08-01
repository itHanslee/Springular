import { Component, OnInit, signal, computed } from '@angular/core';

interface VacunaAplicada {
  vacuna: string;
  fecha: string;
  dosis: number;
  lote: string;
}

@Component({
  selector: 'app-vacunas-aplicadas',
  standalone: true,
  imports: [],
  templateUrl: './vacunas-aplicadas.html',
  styleUrl: './vacunas-aplicadas.css',
})
export class VacunasAplicadas implements OnInit {

  terminoBusqueda = signal('');

  vacunasAplicadas = signal<VacunaAplicada[]>([]);

  cargando = signal(false);

  vacunasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();

    if (!termino) return this.vacunasAplicadas();

    return this.vacunasAplicadas().filter(v =>
      v.vacuna.toLowerCase().includes(termino) ||
      v.lote.toLowerCase().includes(termino)
    );
  });

  hayResultados = computed(() =>
    this.vacunasFiltradas().length > 0
  );

  ngOnInit(): void {
    this.cargarVacunasAplicadas();
  }

  cargarVacunasAplicadas(): void {
    this.cargando.set(true);

    this.vacunasAplicadas.set([
      {
        vacuna: 'COVID-19 (refuerzo)',
        fecha: '12/05/26',
        dosis: 3,
        lote: 'CV-2026-004'
      },
      {
        vacuna: 'Influenza',
        fecha: '20/01/25',
        dosis: 1,
        lote: 'INF-2025-002'
      },
      {
        vacuna: 'Triple viral',
        fecha: '03/06/20',
        dosis: 2,
        lote: 'TV-2020-014'
      }
    ]);

    this.cargando.set(false);
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }
}