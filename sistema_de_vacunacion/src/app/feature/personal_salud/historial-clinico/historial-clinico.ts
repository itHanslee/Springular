import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { VacunacionService } from '../../../core/services/vacunacion';
import { Vacunacion } from '../../../shared/models/vacunacion.model';

@Component({
  selector: 'app-historial-clinico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historial-clinico.html',
  styleUrl: './historial-clinico.css',
})

export class HistorialClinico {
  buscando = signal(false);
  busquedaRealizada = signal(false);

  mensajeError = signal<string | null>(null);
  historial = signal<Vacunacion[]>([]);

  form: FormGroup;

  constructor(
    private VacunacionService: VacunacionService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      documento: ['', Validators.required],
    });
  }

  buscar(): void{
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const documento = (this.form.value.documento as string).trim();

    this.mensajeError.set(null);
    this.buscando.set(true);
    this.busquedaRealizada.set(false);

    this.VacunacionService.obtenerHistorial(documento).subscribe({
      next: (historial) => {
        this.buscando.set(false);
        this.busquedaRealizada.set(true);
        this.historial.set(
          [...historial].sort((a,b) => new Date (b.fechaAplicacion).getTime() - (a.fechaAplicacion).getTime())
        );
      },

      error: (error: HttpErrorResponse) => {
        this.buscando.set(false);
        this.busquedaRealizada.set(true);
        this.historial.set([]);
        this.mensajeError.set(error.error?.message || 'Ocurrió un error al consultar el historial clínico.');
      }
    });
  }


}
