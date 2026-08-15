// feature/administrador/gestionar-vacunas/gestionar-vacunas.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VacunaService } from '../../../core/services/vacuna';
import { Vacuna, viaAdministracion } from '../../../shared/models/vacuna.model';

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

  opcionesViaAdministracion: viaAdministracion[] = ['Oral', 'Intramuscular', 'Subcutanea', 'Intradermica'];

  vacunasFiltradas = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    if (!termino) return this.vacunas();
    return this.vacunas().filter(v =>
      v.nombre.toLowerCase().includes(termino) ||
      v.fabricante.toLowerCase().includes(termino)
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
      temperaturaAlmacenamiento: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarVacunas();
  }

  cargarVacunas(): void {
    this.cargando.set(true);
    this.vacunaService.listar().subscribe({
      next: data => {
        this.vacunas.set(data);
        this.cargando.set(false);
      },
      error: err => {
        console.error('Error al cargar vacunas', err);
        this.cargando.set(false);
      }
    });
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.cancelarEdicion();
    }
  }

  editar(vacuna: Vacuna): void {
    this.vacunaEnEdicion.set(vacuna);
    this.mostrarFormulario.set(true);
    this.form.patchValue(vacuna);
  }

  cancelarEdicion(): void {
    this.vacunaEnEdicion.set(null);
    this.form.reset({ dosisTotales: 1 });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const enEdicion = this.vacunaEnEdicion();
    const datos = this.form.value as Partial<Vacuna>;

    const accion = enEdicion
      ? this.vacunaService.actualizar(enEdicion.id, datos)
      : this.vacunaService.registrar(datos);

    accion.subscribe(() => {
      this.mostrarFormulario.set(false);
      this.cancelarEdicion();
      this.cargarVacunas();
    });
  }
}