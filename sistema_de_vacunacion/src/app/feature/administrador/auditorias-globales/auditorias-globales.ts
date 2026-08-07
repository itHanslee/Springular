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

  opcionesTipoAuditoria: TipoAuditoria[] = ['CREAR', 'EDITAR', 'ELIMINAR', 'CONSULTAR'];

  auditoriasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    const tipo = this.tipoSeleccionado();

    return this.auditorias().filter(a => {
      const coincideTexto =
        !termino ||
        a.descripcion.toLowerCase().includes(termino) ||
        `${a.usuario.nombre} ${a.usuario.apellido}`.toLowerCase().includes(termino);

      const coincideTipo = !tipo || a.tipoAuditoria === tipo;

      return coincideTexto && coincideTipo;
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
    next: data => {
      this.auditorias.set(data);
      this.cargando.set(false);
    },
    error: err => {
      console.error('Error al cargar auditorías', err);
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

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString('es-CO');
  }
}