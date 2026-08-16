// feature/administrador/gestionar-vacunas/gestionar-vacunas.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VacunaService } from '../../../core/services/vacuna';
import { InventarioLote, Vacuna, viaAdministracion } from '../../../shared/models/vacuna.model';
import { switchMap } from 'rxjs/internal/operators/switchMap';

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
  lotesPorVacuna =signal<Record<number, InventarioLote[]>>({});
  opcionesViaAdministracion: viaAdministracion[] = ['Oral', 'Intramuscular', 'Subcutanea', 'Intradermica'];

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
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      fabricante: ['', Validators.required],
      dosisTotales: [1, [Validators.required, Validators.min(1)]],
      viaAdministracion: ['', Validators.required],
      temperaturaAlmacenamiento: [null, Validators.required],
      numeroLote: ['', Validators.required],
      cantidadRecibida: [null, [Validators.required, Validators.min(1)]],
      fechaVencimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarVacunas();
  }

  cargarVacunas(): void {
    this.cargando.set(true);
    this.vacunaService
      .listarInventarioCompleto()
      .subscribe({next: resultados => {
          const vacunas = resultados.map(resultado => resultado.vacuna);
          const lotes: Record<number, InventarioLote[]> = {};
          resultados.forEach(
            resultado => {
              lotes[
                resultado.vacuna.id
              ] = resultado.lotes;

            }
          );

          this.vacunas.set(vacunas);
          this.lotesPorVacuna.set(lotes);
          this.cargando.set(false);
        },


        error: err => {

          console.error(
            'Error al cargar vacunas',
            err
          );

          this.cargando.set(false);
        }

      });
  }

getLoteActual(vacunaId: number): InventarioLote | undefined {
  const lotes = this.lotesPorVacuna()[vacunaId];
  if (!lotes || lotes.length === 0) return undefined;

  return lotes.find(lote => lote.activo) ?? lotes[0];
}
  // BUSCAR

  buscar(valor: string): void {
    this.terminoBusqueda.set(
      valor
    );
  }


  // MOSTRAR / OCULTAR FORMULARIO

  toggleFormulario(): void {

    this.mostrarFormulario.update(valor => !valor);
    if (!this.mostrarFormulario()) {
      this.cancelarEdicion();
    }
  }


  // EDITAR

  editar(vacuna: Vacuna): void {
    this.vacunaEnEdicion.set(vacuna);
    this.mostrarFormulario.set(true);

    this.form.patchValue({
      codigo:vacuna.codigo,
      nombre:vacuna.nombre,
      fabricante:vacuna.fabricante,
      dosisTotales:vacuna.dosisTotales,
      viaAdministracion:vacuna.viaAdministracion,
      temperaturaAlmacenamiento:vacuna.temperaturaAlmacenamiento

    });


    this.desactivarValidadoresLote();
  }


  // VALIDADORES DEL LOTE

  private desactivarValidadoresLote(): void {
    this.form.get('numeroLote')?.clearValidators();
    this.form.get('fechaVencimiento')?.clearValidators();
    this.form.get('cantidadRecibida')?.clearValidators();
    this.form.get('numeroLote')?.updateValueAndValidity();
    this.form.get('fechaVencimiento')?.updateValueAndValidity();
    this.form.get('cantidadRecibida')?.updateValueAndValidity();
  }


  private activarValidadoresLote(): void {
    this.form.get('numeroLote')?.setValidators(Validators.required);
    this.form.get('fechaVencimiento')?.setValidators(Validators.required);
    this.form.get('cantidadRecibida')?.setValidators([Validators.required, Validators.min(1)]);
    this.form.get('numeroLote')?.updateValueAndValidity();
    this.form.get('fechaVencimiento')?.updateValueAndValidity();
    this.form.get('cantidadRecibida')?.updateValueAndValidity();
  }


  // CANCELAR
 

  cancelarEdicion(): void {
      this.vacunaEnEdicion.set(
      null
    );


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

  // GUARDAR
 
  guardar(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }


    const enEdicion =
      this.vacunaEnEdicion();


    const valores =
      this.form.getRawValue();


    // DATOS DE LA VACUNA

    const vacuna: Partial<Vacuna> = {
      codigo:valores.codigo,
      nombre:valores.nombre,
      fabricante:valores.fabricante,
      dosisTotales:valores.dosisTotales,
      viaAdministracion:valores.viaAdministracion,
      temperaturaAlmacenamiento:valores.temperaturaAlmacenamiento
    };


    // EDICIÓN

    if (enEdicion) {

      this.vacunaService
        .actualizar(
          enEdicion.id,
          vacuna
        )
        .subscribe({

          next: () => {

            this.mostrarFormulario
              .set(false);

            this.cancelarEdicion();

            this.cargarVacunas();
          },


          error: err => {

            console.error(
              'Error al actualizar vacuna',
              err
            );

            alert(
              this.obtenerMensajeError(
                err,
                'No se pudo actualizar la vacuna.'
              )
            );
          }

        });

      return;
    }

    // NUEVA VACUNA
  
    this.vacunaService
      .registrar(vacuna)

      .pipe(

        switchMap(
          vacunaCreada => {

            const lote:
              Omit<InventarioLote,'id' |'stockActual' |'activo'> = {
                numeroLote:valores.numeroLote,
                cantidadRecibida:valores.cantidadRecibida,
                fechaVencimiento:valores.fechaVencimiento,
                idVacuna:vacunaCreada.id
              };
            return this.vacunaService
              .registrarLote(lote);
          }
        )

      )

      .subscribe({

        next: () => {

          this.mostrarFormulario
            .set(false);

          this.cancelarEdicion();

          this.cargarVacunas();
        },


        error: err => {

          console.error('Error al registrar vacuna/lote',
            err);


          alert(
            this.obtenerMensajeError(
              err,'No se pudo registrar la vacuna y el lote.'));
        }

      });
  }

  // LOTES

  obtenerLotes(
    idVacuna: number
  ): InventarioLote[] {

    return this.lotesPorVacuna()[idVacuna]
      ?? [];
  }


  obtenerStockTotal(
    idVacuna: number
  ): number {

    return this.obtenerLotes(
      idVacuna
    )
      .filter(
        lote =>
          lote.activo
      )
      .reduce(
        (total, lote) =>
          total + (lote.stockActual ?? 0),
        0
      );
  }


  obtenerLotePrincipal(
    idVacuna: number
  ): InventarioLote | null {

    const lotes =
      this.obtenerLotes(idVacuna)
        .filter(
          lote =>
            lote.activo &&
            lote.stockActual > 0
        )
        .sort(
          (a, b) =>
            a.fechaVencimiento.localeCompare(
              b.fechaVencimiento
            )
        );


    return lotes.length > 0
      ? lotes[0]
      : null;
  }



  // MENSAJE DE ERROR
 

  private obtenerMensajeError(
    error: any, mensajePorDefecto: string): string {
      return (
        error?.error?.message ??
        error?.error ??
        mensajePorDefecto
    );
  }
}