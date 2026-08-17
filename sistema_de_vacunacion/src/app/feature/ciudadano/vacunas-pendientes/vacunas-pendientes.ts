import { Component, OnInit, signal, computed } from '@angular/core';
import { VacunaPendiente } from '../../../shared/models/vacunacion.model';
import { VacunacionService } from '../../../core/services/vacunacion';
import { AuthService } from '../../../core/services/auth';
 
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
 
  constructor(
    private vacunacionService: VacunacionService,
    private authService: AuthService
  ) {}
 
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
 
    const usuario = this.authService.usuarioActual();
 
    if (!usuario) {
      this.vacunasPendientes.set([]);
      return;
    }
 
    const idCiudadano = usuario.id;
 
    console.log(' ID CIUDADANO:', idCiudadano);
 
    this.cargando.set(true);
 
    this.vacunacionService.obtenerVacunasPendientes(idCiudadano).subscribe({
      next: (datos: VacunaPendiente[]) => {
        console.log(' VACUNAS PENDIENTES:', datos);
 
        this.vacunasPendientes.set(datos);
        this.cargando.set(false);
      },
 
      error: (error: unknown) => {
        console.error(' ERROR AL CARGAR VACUNAS PENDIENTES:', error);
 
        this.vacunasPendientes.set([]);
        this.cargando.set(false);
      }
    });
  }
 
  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }
 
  /**
   * Determina si una vacuna pendiente está "próxima"
   * (dentro del umbral de días definido, por defecto 30 días)
   */
  esProxima(fecha: string, umbralDias: number = 30): boolean {
    const dias = this.diferenciaDias(fecha);
    return dias <= umbralDias;
  }
 
  
  etiquetaTiempo(fecha: string): string {
    const dias = this.diferenciaDias(fecha);
 
    if (dias <= 0) {
      return 'Vencida';
    }
 
    const meses = Math.round(dias / 30);
 
    if (meses <= 0) {
      return `En ${dias} día${dias === 1 ? '' : 's'}`;
    }
 
    return meses === 1 ? 'En 1 mes' : `En ${meses} meses`;
  }
 
  /**
   * Calcula la diferencia en días entre hoy y la fecha programada
   */
  private diferenciaDias(fecha: string): number {
    const hoy = new Date();
    const objetivo = new Date(fecha);
    const msPorDia = 1000 * 60 * 60 * 24;
 
    // Normaliza ambas fechas a medianoche para evitar diferencias por horas
    hoy.setHours(0, 0, 0, 0);
    objetivo.setHours(0, 0, 0, 0);
 
    return Math.round((objetivo.getTime() - hoy.getTime()) / msPorDia);
  }
}