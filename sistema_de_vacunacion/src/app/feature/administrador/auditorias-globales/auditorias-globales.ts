// feature/administrador/auditorias-globales/auditorias-globales.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { AuditoriaService } from '../../../core/services/auditoria';
import { Auditoria, TipoAuditoria } from '../../../shared/models/auditoria.model';

@Component({
  selector: 'app-auditorias-globales',
  standalone: true,
  imports: [],
  templateUrl: './auditorias-globales.html',
  styleUrl: './auditorias-globales.css'
})
export class AuditoriasGlobales implements OnInit {
  auditorias = signal<Auditoria[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  tipoSeleccionado = signal<TipoAuditoria | ''>('');
  tablaSeleccionada = signal<string>('');

  opcionesTipoAuditoria: TipoAuditoria[] = ['CREAR', 'EDITAR', 'ELIMINAR', 'CONSULTAR'];

  opcionesTabla = computed(() => {
      const tablas = this.auditorias()
        .map(a => a.tablaAfectada)
        .filter(Boolean);
      return [...new Set(tablas)];
    });

  auditoriasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    const tipo = this.tipoSeleccionado();
    const tabla = this.tablaSeleccionada();

        return this.auditorias().filter(auditoria => {

      const texto = `
        ${auditoria.nombreUsuario ?? ''}
        ${auditoria.apellidoUsuario ?? ''}
        ${auditoria.idUsuario}
        ${auditoria.tablaAfectada}
        ${auditoria.tipoAccion}
      `.toLowerCase();

      const coincideBusqueda =
        !termino ||
        texto.includes(termino);

      const coincideTipo =
        !tipo ||
        auditoria.tipoAccion === tipo;

      const coincideTabla =
        !tabla ||
        auditoria.tablaAfectada === tabla;
             return (
        coincideBusqueda &&
        coincideTipo &&
        coincideTabla
      );

    }); 
  });

  hayResultados = computed(() => this.auditoriasFiltradas().length > 0);

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit(): void {
    this.cargarAuditorias();
  }

 
  cargarAuditorias(): void {

    this.cargando.set(true);

    this.auditoriaService.listar().subscribe({

      next: (data: Auditoria[]) => {

        const ordenadas = [...data].sort(
          (a, b) =>
            new Date(b.fechaAccion).getTime() -
            new Date(a.fechaAccion).getTime()
        );

        this.auditorias.set(ordenadas);
        this.cargando.set(false);

      },
      error: (error) => {

        console.error(
          'Error al cargar las auditorías:',
          error
        );

        this.auditorias.set([]);
        this.cargando.set(false);

      }

    });

  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }

  filtrarPorTipo(valor: string): void {
    this.tipoSeleccionado.set(valor as TipoAuditoria | '');
  }

  filtrarPorTabla(valor: string): void {
    this.tablaSeleccionada.set(valor);
  }

  formatearFecha(fecha: string): string {

    return new Date(fecha).toLocaleString(
      'es-CO',
      {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    );

  }
  formatearTabla(tabla: string): string {

    const nombres: Record<string, string> = {
      personal_salud: 'Personal de salud',
      ciudadano: 'Ciudadano',
      vacuna: 'Vacuna',
      vacunacion: 'Aplicación de vacuna'
    };

    return nombres[tabla] ?? tabla;
  }

  formatearAccion(accion: TipoAuditoria): string {
    const nombres: Record<TipoAuditoria, string> = {

      CREAR: 'Creación',
      EDITAR: 'Edición',
      ELIMINAR: 'Eliminación',
      CONSULTAR: 'Consulta'

    };

    return nombres[accion];

  }
}