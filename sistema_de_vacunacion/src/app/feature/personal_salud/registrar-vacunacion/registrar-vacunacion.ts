import { Component, signal, DestroyRef } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { VacunacionService } from '../../../core/services/vacunacion';
import { VacunaPendiente } from '../../../shared/models/vacunacion.model';
import { PersonalSaludService } from '../../../core/services/personal-salud';
import { Ciudadano } from '../../../shared/models/ciudadano.model';

@Component({
  selector: 'app-registrar-vacunacion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registrar-vacunacion.html',
  styleUrl: './registrar-vacunacion.css'
})
export class RegistrarVacunacion {

  documentoBusqueda = signal('');
  buscando = signal(false);
  registrando = signal(false);

  ciudadanoSeleccionado = signal<Ciudadano | null>(null);

  pendientes = signal<VacunaPendiente[]>([]);
  pendienteSeleccionada = signal<VacunaPendiente | null>(null);

  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  form: FormGroup;


  constructor(
    private vacunacionService: VacunacionService,
    private personalSaludService: PersonalSaludService,
    private destroyRef: DestroyRef,
    private fb: FormBuilder
  ) {
    const hoy = new Date().toISOString().substring(0, 10);

    this.form = this.fb.group({
      fechaAplicacion: [
        hoy,
        [Validators.required]
      ]
    });
  }


  /**
   * Actualiza el texto utilizado por el filtro.
   */
  onDocumentoChange(valor: string): void {

    this.documentoBusqueda.set(valor);

    // Al cambiar de búsqueda, limpiamos la selección
    // anterior para evitar registrar una vacuna
    // al ciudadano equivocado.
    this.ciudadanoSeleccionado.set(null);
    this.pendientes.set([]);
    this.pendienteSeleccionada.set(null);

    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  /**
   * El botón Buscar simplemente aplica el filtro
   * que ya está funcionando mediante ciudadanosFiltrados.
   */
  buscar(): void {
    const documento = this.documentoBusqueda().trim();

    // 1. Validar que no esté vacío
    if (!documento) {
      this.mensajeError.set('Ingrese un número de documento.');
      return;
    }

    // 2. Validar que contenga únicamente números
    const regexSoloNumeros = /^\d+$/;
    if (!regexSoloNumeros.test(documento)) {
      this.mensajeError.set('El documento solo debe contener números.');
      return;
    }

    // 3. Validar rango de longitud
    if (documento.length < 6 || documento.length > 12) {
      this.mensajeError.set('El documento debe tener entre 6 y 12 dígitos.');
      return;
    }

    this.buscando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    this.ciudadanoSeleccionado.set(null);
    this.pendientes.set([]);
    this.pendienteSeleccionada.set(null);

    this.personalSaludService
      .obtenerCiudadanoPorDocumento(documento)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ciudadano => {
          this.buscando.set(false);
          this.seleccionarCiudadano(ciudadano);
        },
        error: (error: HttpErrorResponse) => {
          this.buscando.set(false);
          console.error('Error al buscar ciudadano:', error);
          this.mensajeError.set(
            error.status === 404
              ? 'No se encontró ningún ciudadano con ese documento.'
              : error.error?.message ?? 'No se pudo consultar el ciudadano.'
          );
        }
      });
  }

  /**
   * Selecciona un ciudadano y consulta sus
   * vacunas pendientes.
   */
  seleccionarCiudadano(
    ciudadano: Ciudadano
  ): void {

    this.ciudadanoSeleccionado.set(ciudadano);

    this.pendientes.set([]);
    this.pendienteSeleccionada.set(null);

    this.buscando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    this.vacunacionService
      .obtenerVacunasPendientes(ciudadano.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({

        next: pendientes => {

          this.buscando.set(false);
          this.pendientes.set(pendientes);

          if (pendientes.length === 0) {

            this.mensajeError.set(
              'El ciudadano no tiene vacunas pendientes.'
            );
          }
        },

        error: (error: HttpErrorResponse) => {

          this.buscando.set(false);
          this.pendientes.set([]);

          console.error(
            'Error al obtener vacunas pendientes:',
            error
          );

          this.mensajeError.set(
            error.error?.message ??
            'No se pudieron consultar las vacunas pendientes.'
          );
        }
      });
  }


  /**
   * Selecciona la dosis que se va a aplicar.
   */
  seleccionarPendiente(
    pendiente: VacunaPendiente
  ): void {

    this.pendienteSeleccionada.set(pendiente);

    this.mensajeError.set(null);
    this.mensajeExito.set(null);
  }

  /**
   * Registra la aplicación de la vacuna seleccionada.
   */
  registrar(): void {

    const ciudadano =
      this.ciudadanoSeleccionado();

    const pendiente =
      this.pendienteSeleccionada();

    if (!ciudadano) {

      this.mensajeError.set(
        'Debe seleccionar un ciudadano.'
      );

      return;
    }

    if (!pendiente) {

      this.mensajeError.set(
        'Debe seleccionar una vacuna pendiente.'
      );

      return;
    }

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    if (pendiente.idInventario == null) {

      this.mensajeError.set(
        'La vacuna seleccionada no tiene inventario disponible.'
      );

      return;
    }

    this.registrando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    this.vacunacionService
      .registrarAplicacion({

        idCiudadano: ciudadano.id,

        idInventario:
          pendiente.idInventario,

        fechaAplicacion: this.form.value.fechaAplicacion,

        dosis:
          pendiente.dosis,

        observaciones:
          '',

        reaccionesAdversas:
          false

      })
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({

        next: () => {

          this.registrando.set(false);

          this.mensajeExito.set(
            'Aplicación registrada correctamente.'
          );

          this.pendientes.update(
            pendientes =>
              pendientes.filter(
                p => p !== pendiente
              )
          );

          this.pendienteSeleccionada.set(null);

          const hoy = new Date()
            .toISOString()
            .substring(0, 10);

          this.form.reset({
            fechaAplicacion: hoy
          });
        },

        error: (error: HttpErrorResponse) => {

          this.registrando.set(false);

          console.error(
            'Error al registrar vacunación:',
            error
          );

          this.mensajeError.set(
            error.error?.message ??
            'Ocurrió un error al registrar la aplicación.'
          );
        }
      });
  }
}