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
  recordatorios = signal<Recordatorio[]>([])
  cargando = signal(true)
  terminoBusqueda = signal('')
  mostrarEnSistema = signal(true)

  recordatoriosFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim()
    let resultado = this.recordatorios()

    if (!this.mostrarEnSistema()) {
      return []
    }

    if (termino) {
      resultado = resultado.filter(r =>
        r.mensaje.toLowerCase().includes(termino)
      )
    }

    return resultado
  })

  hayResultados = computed(() => this.recordatoriosFiltrados().length > 0)

  constructor(private recordatorioService: RecordatorioService) {}

  ngOnInit(): void {
    this.cargarRecordatorios()
  }

cargarRecordatorios(): void {
  this.cargando.set(true);

  this.recordatorioService.listarTodos().subscribe({
    next: (data: Recordatorio[]) => {
      console.log('🔥 DATOS DEL BACKEND =>', data);

      const convertidos = data.map(r => ({
        ...r,
        fechaProgramada: new Date(r.fechaProgramada),
        fechaEnvio: r.fechaEnvio ? new Date(r.fechaEnvio) : undefined
      }));

      console.log('✅ DATOS CONVERTIDOS =>', convertidos);

      this.recordatorios.set(convertidos);
      this.cargando.set(false);
    },
    error: (err: unknown) => {
      console.error('❌ Error cargando recordatorios', err);
      this.cargando.set(false);
    }
  });
}

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor)
  }

  cambiarPreferencia(valor: boolean): void {
    this.mostrarEnSistema.set(valor)
  }

  formatearFecha(fecha: string | Date): string {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);

  return fechaObj.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
}