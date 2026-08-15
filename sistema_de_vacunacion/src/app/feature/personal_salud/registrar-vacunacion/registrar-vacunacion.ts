import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { VacunacionService } from '../../../core/services/vacunacion';
import { VacunaPendiente } from '../../../shared/models/vacunacion.model';
import { PersonalSaludService } from '../../../core/services/personal-salud';

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

  pendiente = signal<VacunaPendiente | null>(null);
  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  form: FormGroup;

  constructor(
    private vacunacionService: VacunacionService,
    private personalSaludService: PersonalSaludService,
    private fb: FormBuilder
  ) {
    const hoy = new Date().toISOString().substring(0, 10);
    this.form = this.fb.group({
      fechaAplicacion: [hoy, Validators.required],
    });
  }

  onDocumentoChange(valor: string): void {
    this.documentoBusqueda.set(valor);
  }

  buscar(): void {
    const documento = this.documentoBusqueda().trim();
    if (!documento) {
      this.mensajeError.set('Ingrese un número de documento válido.');
      return;
    }

    this.buscando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);
    this.pendiente.set(null);

    this.personalSaludService
      .obtenerCiudadanoPorDocumento(documento)
      .subscribe({
        next: (ciudadano) => {

          this.vacunacionService
            .obtenerVacunasPendientes(ciudadano.id)
            .subscribe({
              next: (pendientes) => {

                // Aquí guardas los pendientes
                // según cómo esté definido tu componente.
                console.log('Ciudadano:', ciudadano);
                console.log('Pendientes:', pendientes);

              },

              error: (error) => {
                console.error(
                  'Error al obtener vacunas pendientes:',
                  error
                );
              }
            });

        },

        error: (error) => {
          console.error(
            'Error al buscar ciudadano:',
            error
          );
        }
      });
  }

  registrar(): void {
    const pendienteActual = this.pendiente();
    if (!pendienteActual || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.registrando.set(true);
    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    this.vacunacionService.registrarAplicacion({
      ciudadanoDocumento: pendienteActual.documentoCiudadano,
      vacunaNombre: pendienteActual.vacunaNombre,
      numeroLote: pendienteActual.numeroLote,
      dosis: pendienteActual.dosis,
      fechaAplicacion: this.form.value.fechaAplicacion,
    }).subscribe({
      next: () => {
        this.registrando.set(false);
        this.mensajeExito.set('Aplicación registrada correctamente.');
        this.pendiente.set(null);

        const hoy = new Date().toISOString().substring(0, 10);
        this.form.reset({ fechaAplicacion: hoy });
        this.documentoBusqueda.set('');
      },
      error: (error: HttpErrorResponse) => {
        this.registrando.set(false);
        const errorMsg = error.error?.message || 'Ocurrió un error al registrar la aplicación.';
        this.mensajeError.set(errorMsg);
      }
    });
  }
}