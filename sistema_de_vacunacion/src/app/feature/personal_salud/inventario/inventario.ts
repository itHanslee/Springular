import {
  Component,
  OnInit,
  signal,
  computed,
  DestroyRef
} from '@angular/core';

import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { VacunaService } from '../../../core/services/vacuna';
import { InventarioItem } from '../../../shared/models/inventario.model';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario implements OnInit {

  terminoBusqueda = signal('');
  inventario = signal<InventarioItem[]>([]);
  cargando = signal(false);

  inventarioFiltrado = computed(() => {

    const termino =
      this.terminoBusqueda()
        .toLowerCase()
        .trim();

    if (!termino) {
      return this.inventario();
    }

    return this.inventario().filter(item =>
      item.nombre.toLowerCase().includes(termino) ||
      item.numeroLote.toLowerCase().includes(termino)
    );
  });

  hayResultados = computed(() =>
    this.inventarioFiltrado().length > 0
  );

  constructor(
    private vacunaService: VacunaService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario(): void {

    this.cargando.set(true);

    this.vacunaService
      .listarInventario()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data: InventarioItem[]) => {
          this.inventario.set(data);
          this.cargando.set(false);
        },

        error: (error: unknown) => {
          console.error(
            'Error al cargar inventario:',
            error
          );

          this.cargando.set(false);
        }
      });
  }

  buscarVacunas(valor: string): void {
    this.terminoBusqueda.set(valor);
  }
}