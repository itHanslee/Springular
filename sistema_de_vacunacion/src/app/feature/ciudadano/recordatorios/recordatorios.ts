import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordatorioService } from '../../../core/services/recordatorios';
import { Recordatorio } from '../../../shared/models/recordatorios.model';

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recordatorios.html',
  styleUrls: ['./recordatorios.css']
})
export class Recordatorios implements OnInit {
  recordatorios = signal<Recordatorio[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  mostrarEnSistema = signal(true);

  recordatoriosFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    let resultado = this.recordatorios();

    if (!this.mostrarEnSistema()) {
      return [];
    }

    if (termino) {
      resultado = resultado.filter(r =>
        r.mensaje.toLowerCase().includes(termino)
      );
    }

    return resultado;
  });

  hayResultados = computed(() => this.recordatoriosFiltrados().length > 0);

  constructor(private recordatorioService: RecordatorioService) {}

  ngOnInit(): void {
    this.cargarRecordatorios();
  }

  cargarRecordatorios(): void {
    this.cargando.set(true);

    setTimeout(() => {
      this.recordatorios.set([
        {
          id: 1,
          fechaProgramada: new Date('2026-05-12'),
          mensaje: 'COVID-19 (refuerzo)'
        },
        {
          id: 2,
          fechaProgramada: new Date('2025-01-20'),
          mensaje: 'Influenza'
        },
        {
          id: 3,
          fechaProgramada: new Date('2020-06-03'),
          mensaje: 'Triple viral'
        }
      ]);
      this.cargando.set(false);
    }, 400);
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }

  cambiarPreferencia(valor: boolean): void {
    this.mostrarEnSistema.set(valor);
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}