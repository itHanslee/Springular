// feature/administrador/personal-salud/personal-salud.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalSaludService } from '../../../core/services/personal-salud';
import { PersonalSalud } from '../../../shared/models/personal-salud.model';

@Component({
  selector: 'app-personal-salud',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './personal-salud.html',
  styleUrl: './personal-salud.css'
})
export class PersonalSaludCo implements OnInit {
  personal = signal<PersonalSalud[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  mostrarFormulario = signal(false);
  personaEnEdicion = signal<PersonalSalud | null>(null);

  opcionesTipoDocumento = ['CC', 'RC', 'TI', 'CE', 'PA'];
  opcionesGenero = ['Masculino', 'Femenino', 'Otro'];

  personalFiltrado = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    if (!termino) return this.personal();
    return this.personal().filter(p =>
      p.numeroDocumento.toLowerCase().includes(termino) ||
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(termino)
    );
  });

  hayResultados = computed(() => this.personalFiltrado().length > 0);

  form: FormGroup;

  constructor(
    private personalSaludService: PersonalSaludService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cargo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      direccion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarPersonal();
  }

  cargarPersonal(): void {
    this.cargando.set(true);
    this.personalSaludService.listar().subscribe({
      next: data => {
        this.personal.set(data);
        this.cargando.set(false);
      },
      error: err => {
        console.error('Error al cargar personal de salud', err);
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

  editar(persona: PersonalSalud): void {
    this.personaEnEdicion.set(persona);
    this.mostrarFormulario.set(true);
    this.form.patchValue(persona);
  }

  cancelarEdicion(): void {
    this.personaEnEdicion.set(null);
    this.form.reset();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const enEdicion = this.personaEnEdicion();
    const datos = this.form.value as Partial<PersonalSalud>;

    const accion = enEdicion
      ? this.personalSaludService.actualizar(enEdicion.id, datos)
      : this.personalSaludService.registrar(datos);

    accion.subscribe(() => {
      this.mostrarFormulario.set(false);
      this.cancelarEdicion();
      this.cargarPersonal();
    });
  }

  eliminar(persona: PersonalSalud): void {
    if (!confirm(`¿Eliminar a ${persona.nombre} ${persona.apellido} del personal de salud?`)) {
      return;
    }
    this.personalSaludService.eliminar(persona.id).subscribe(() => {
      this.cargarPersonal();
    });
  }
}