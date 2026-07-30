import { Component, OnInit, signal, computed } from '@angular/core';

interface Recordatorio {
  vacuna: string;
  fecha: string;
}

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [],
  templateUrl: './recordatorios.html',
  styleUrl: './recordatorios.css',
})
export class Recordatorios implements OnInit {

  mostrarEnSistema = signal(false);

  recordatorios = signal<Recordatorio[]>([]);

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
        vacuna: 'COVID-19 (refuerzo)',
        fecha: '12/05/26'
      },
      {
        vacuna: 'Influenza',
        fecha: '20/01/25'
      },
      {
        vacuna: 'Triple viral',
        fecha: '03/06/20'
      }
    ]);

    this.cargando.set(false);
  }

  cambiarPreferencia(valor: boolean): void {
    this.mostrarEnSistema.set(valor);
  }
}