import { Component, OnInit, signal, computed } from '@angular/core';

interface RecordatorioView {
  mensaje: string;
  fechaProgramada: string;
  estado: 'Pendiente' | 'Enviado' | 'Visto';
}

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [],
  templateUrl: './recordatorios.html',
  styleUrl: './recordatorios.css'
})
export class Recordatorios implements OnInit {

  mostrarEnSistema = signal(false);

  recordatorios = signal<RecordatorioView[]>([]);

  cargando = signal(false);

  recordatoriosFiltrados = computed(() =>
    this.recordatorios()
  );

  hayResultados = computed(() =>
    this.recordatoriosFiltrados().length > 0
  );

  ngOnInit(): void {
    this.cargarRecordatorios();
  }

  cargarRecordatorios(): void {
    this.cargando.set(true);

    this.recordatorios.set([
      {
        mensaje: 'COVID-19 (refuerzo)',
        fechaProgramada: '12/05/26',
        estado: 'Pendiente'
      },
      {
        mensaje: 'Influenza',
        fechaProgramada: '20/01/25',
        estado: 'Enviado'
      },
      {
        mensaje: 'Triple viral',
        fechaProgramada: '03/06/20',
        estado: 'Visto'
      }
    ]);

    this.cargando.set(false);
  }

  cambiarPreferencia(valor: boolean): void {
    this.mostrarEnSistema.set(valor);
  }
}