import { Component, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { VacunaService } from '../../../core/services/vacuna';
import { InventarioLote, Vacuna, viaAdministracion } from '../../../shared/models/vacuna.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-gestionar-vacunas',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './gestionar-vacunas.html',
  styleUrl: './gestionar-vacunas.css'
})
export class GestionarVacunas implements OnInit {
  vacunas = signal<Vacuna[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  mostrarFormulario = signal(false);
  vacunaEnEdicion = signal<Vacuna | null>(null);
  lotesPorVacuna = signal<Record<number, InventarioLote[]>>({});
  opcionesViaAdministracion: viaAdministracion[] = ['Oral', 'Intramuscular', 'Subcutanea', 'Intradermica'];
  mensajeError = signal<string | null>(null);

  vacunasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    if (!termino) return this.vacunas();
    return this.vacunas().filter(v =>
      v.nombre.toLowerCase().includes(termino) ||
      v.fabricante.toLowerCase().includes(termino) ||
      v.codigo.toLowerCase().includes(termino)
    );
  });

  hayResultados = computed(() => this.vacunasFiltradas().length > 0);

  form: FormGroup;

  constructor(
    private vacunaService: VacunaService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      codigo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9\-_]{3,15}$/)
        ]
      ],
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/),
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      fabricante: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.]+$/),
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],
      dosisTotales: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(10)
        ]
      ],
      viaAdministracion: ['', Validators.required],
      temperaturaAlmacenamiento: [
        null,
        [
          Validators.required,
          Validators.min(-80),
          Validators.max(25)
        ]
      ],
      numeroLote: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9\-_]{3,20}$/)
        ]
      ],
      cantidadRecibida: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(100000)
        ]
      ],
      fechaVencimiento: [
        '',
        [
          Validators.required,
          this.fechaFuturaValidator
        ]
      ]
    });
  }

  /**
   * Validador para asegurar que la fecha de vencimiento sea posterior a hoy.
   */
  private fechaFuturaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const fechaIngresada = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return fechaIngresada > hoy ? null : { fechaPasada: true };
  }

  ngOnInit(): void {
    this.cargarVacunas();
  }

  cargarVacunas(): void {
    this.cargando.set(true);
    this.vacunaService
      .listarInventarioCompleto()
      .subscribe({
        next: resultados => {
          const vacunas = resultados.map(resultado => resultado.vacuna);
          const lotes: Record<number, InventarioLote[]> = {};
          resultados.forEach(resultado => {
            lotes[resultado.vacuna.id] = resultado.lotes;
          });

          this.vacunas.set(vacunas);
          this.lotesPorVacuna.set(lotes);
          this.cargando.set(false);
        },
        error: err => {
          console.error('Error al cargar vacunas', err);
          this.cargando.set(false);
        }
      });
  }

  getLoteActual(vacunaId: number): InventarioLote | undefined {
    const lotes = this.lotesPorVacuna()[vacunaId];
    if (!lotes || lotes.length === 0) return undefined;

    return lotes.find(lote => lote.activo) ?? lotes[0];
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update(valor => !valor);
    if (!this.mostrarFormulario()) {
      this.mensajeError.set(null);
      this.cancelarEdicion();
    }
  }

  editar(vacuna: Vacuna): void {
    this.vacunaEnEdicion.set(vacuna);
    this.mostrarFormulario.set(true);

    this.form.patchValue({
      codigo: vacuna.codigo,
      nombre: vacuna.nombre,
      fabricante: vacuna.fabricante,
      dosisTotales: vacuna.dosisTotales,
      viaAdministracion: vacuna.viaAdministracion,
      temperaturaAlmacenamiento: vacuna.temperaturaAlmacenamiento
    });

    this.desactivarValidadoresLote();
  }

  private desactivarValidadoresLote(): void {
    this.form.get('numeroLote')?.clearValidators();
    this.form.get('fechaVencimiento')?.clearValidators();
    this.form.get('cantidadRecibida')?.clearValidators();
    this.form.get('numeroLote')?.updateValueAndValidity();
    this.form.get('fechaVencimiento')?.updateValueAndValidity();
    this.form.get('cantidadRecibida')?.updateValueAndValidity();
  }

  private activarValidadoresLote(): void {
    this.form.get('numeroLote')?.setValidators([
      Validators.required,
      Validators.pattern(/^[A-Za-z0-9\-_]{3,20}$/)
    ]);
    this.form.get('fechaVencimiento')?.setValidators([
      Validators.required,
      this.fechaFuturaValidator
    ]);
    this.form.get('cantidadRecibida')?.setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(100000)
    ]);
    this.form.get('numeroLote')?.updateValueAndValidity();
    this.form.get('fechaVencimiento')?.updateValueAndValidity();
    this.form.get('cantidadRecibida')?.updateValueAndValidity();
  }

  cancelarEdicion(): void {
    this.vacunaEnEdicion.set(null);

    this.form.reset({
      codigo: '',
      nombre: '',
      fabricante: '',
      dosisTotales: 1,
      viaAdministracion: '',
      temperaturaAlmacenamiento: null,
      numeroLote: '',
      fechaVencimiento: '',
      cantidadRecibida: 1
    });
    this.activarValidadoresLote();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const enEdicion = this.vacunaEnEdicion();
    const valores = this.form.getRawValue();

    const vacuna: Partial<Vacuna> = {
      codigo: valores.codigo,
      nombre: valores.nombre,
      fabricante: valores.fabricante,
      dosisTotales: valores.dosisTotales,
      viaAdministracion: valores.viaAdministracion,
      temperaturaAlmacenamiento: valores.temperaturaAlmacenamiento
    };

    if (enEdicion) {
      this.vacunaService
        .actualizar(enEdicion.id, vacuna)
        .subscribe({
          next: () => {
            this.mostrarFormulario.set(false);
            this.cancelarEdicion();
            this.cargarVacunas();
          },
          error: err => {
            console.error('Error al actualizar vacuna', err);
            this.mensajeError.set(
              this.obtenerMensajeError(err, 'No se pudo actualizar la vacuna.')
            );
          }
        });

      return;
    }

    this.vacunaService
      .registrar(vacuna)
      .pipe(
        switchMap(vacunaCreada => {
          const lote: Omit<InventarioLote, 'id' | 'stockActual' | 'activo'> = {
            numeroLote: valores.numeroLote,
            cantidadRecibida: valores.cantidadRecibida,
            fechaVencimiento: valores.fechaVencimiento,
            idVacuna: vacunaCreada.id
          };
          return this.vacunaService.registrarLote(lote);
        })
      )
      .subscribe({
        next: () => {
          this.mostrarFormulario.set(false);
          this.cancelarEdicion();
          this.cargarVacunas();
        },
        error: err => {
          console.error('Error al registrar vacuna/lote', err);
          this.mensajeError.set(
            this.obtenerMensajeError(err, 'No se pudo registrar la vacuna y el lote.')
          );
        }
      });
  }

  obtenerLotes(idVacuna: number): InventarioLote[] {
    return this.lotesPorVacuna()[idVacuna] ?? [];
  }

  obtenerStockTotal(idVacuna: number): number {
    return this.obtenerLotes(idVacuna)
      .filter(lote => lote.activo)
      .reduce((total, lote) => total + (lote.stockActual ?? 0), 0);
  }

  obtenerLotePrincipal(idVacuna: number): InventarioLote | null {
    const lotes = this.obtenerLotes(idVacuna)
      .filter(lote => lote.activo && lote.stockActual > 0)
      .sort((a, b) => a.fechaVencimiento.localeCompare(b.fechaVencimiento));

    return lotes.length > 0 ? lotes[0] : null;
  }

  private obtenerMensajeError(error: any, mensajePorDefecto: string): string {
    return (
      error?.error?.message ??
      error?.error ??
      mensajePorDefecto
    );
  }
}