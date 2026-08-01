// feature/personal_salud/reportes/reportes.ts
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { VacunacionService } from '../../../core/services/vacunacion';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent {
  exportandoPDF = signal(false);
  exportandoExcel = signal(false);

  mensajeError = signal<string | null>(null);
  mensajeExito = signal<string | null>(null);

  form: FormGroup;

  constructor(
    private vacunacionService: VacunacionService,
    private fb: FormBuilder
  ) {
    const fechaActual = new Date();
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1)
      .toISOString().substring(0, 10);
    const hoy = fechaActual.toISOString().substring(0, 10);

    this.form = this.fb.group({
      fechaDesde: [primerDiaMes, Validators.required],
      fechaHasta: [hoy, Validators.required],
      tipoReporte: ['VACUNAS_APLICADAS', Validators.required]
    });
  }

  exportar(formato: 'PDF' | 'EXCEL'): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fechaDesde, fechaHasta, tipoReporte } = this.form.value;

    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      this.mensajeError.set('La fecha "Desde" no puede ser posterior a la fecha "Hasta".');
      return;
    }

    this.mensajeError.set(null);
    this.mensajeExito.set(null);

    if (formato === 'PDF') this.exportandoPDF.set(true);
    if (formato === 'EXCEL') this.exportandoExcel.set(true);

    const payload = {
      fechaDesde,
      fechaHasta,
      tipoReporte,
      formato
    };

    this.vacunacionService.generarReporte(payload).subscribe({
      next: (blob: Blob) => {
        this.exportandoPDF.set(false);
        this.exportandoExcel.set(false);

        const extension = formato === 'PDF' ? 'pdf' : 'xlsx';
        this.descargarBlob(blob, `Reporte_${tipoReporte}_${fechaDesde}_al_${fechaHasta}.${extension}`);
        this.mensajeExito.set(`Reporte en formato ${formato} descargado correctamente.`);
      },
      error: (error: HttpErrorResponse) => {
        this.exportandoPDF.set(false);
        this.exportandoExcel.set(false);
        const errorMsg = error.error?.message || `Ocurrió un error al generar el reporte en ${formato}.`;
        this.mensajeError.set(errorMsg);
      }
    });
  }

  private descargarBlob(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}