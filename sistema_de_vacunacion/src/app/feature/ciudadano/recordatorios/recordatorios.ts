import {
  Component,
  OnInit,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RecordatorioService } from '../../../core/services/recordatorios';
import { Recordatorio } from '../../../shared/models/recordatorios.model';
import { AuthService } from '../../../core/services/auth';

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

    const termino =
      this.terminoBusqueda()
        .toLowerCase()
        .trim();

    if (!this.mostrarEnSistema()) {
      return [];
    }

    let resultado = this.recordatorios();

    if (termino) {
      resultado = resultado.filter(recordatorio =>
        recordatorio.vacunaNombre
          ?.toLowerCase()
          .includes(termino)
      );
    }

    return resultado;
  });

  hayResultados = computed(() =>
    this.recordatoriosFiltrados().length > 0
  );

  constructor(
    private recordatorioService: RecordatorioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarRecordatorios();
  }

  cargarRecordatorios(): void {

    this.cargando.set(true);

    const usuario = this.authService.usuarioActual();

    if (!usuario || !usuario.id) {

      console.error('❌ No hay ciudadano autenticado');

      this.recordatorios.set([]);
      this.cargando.set(false);

      return;
    }

    const idCiudadano = usuario.id;

    console.log('👤 ID CIUDADANO:', idCiudadano);

    this.recordatorioService
      .listarTodos()
      .subscribe({

        next: (data) => {

         console.log(
      '🔥 TODOS LOS RECORDATORIOS:',
        JSON.stringify(data, null, 2)
  );

          const delCiudadano =
            data.filter(
              r => r.idCiudadano === idCiudadano
            );

          console.log(
            '👤 RECORDATORIOS DEL CIUDADANO:',
            delCiudadano
          );

          const convertidos: Recordatorio[] =
            delCiudadano.map(r => ({

              ...r,

              fechaProgramada:
                new Date(r.fechaProgramada),

              fechaEnvio:
                r.fechaEnvio
                  ? new Date(r.fechaEnvio)
                  : null

            }));

          this.recordatorios.set(convertidos);

          this.cargando.set(false);
        },

        error: (error) => {

          console.error(
            '❌ Error obteniendo recordatorios:',
            error
          );

          this.recordatorios.set([]);

          this.cargando.set(false);
        }

      });
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }

  cambiarPreferencia(valor: boolean): void {
    this.mostrarEnSistema.set(valor);
  }

  formatearFecha(
    fecha: string | Date
  ): string {

    const fechaObj =
      fecha instanceof Date
        ? fecha
        : new Date(fecha);

    return fechaObj.toLocaleDateString(
      'es-CO',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );
  }
}