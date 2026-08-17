import { Component, OnInit, signal, computed } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { AdministradorService } from '../../../core/services/administrador';
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
  opcionesGenero = ['MASCULINO', 'FEMENINO', 'OTRO'];

  personalFiltrado = computed(() => {
    const termino = this.terminoBusqueda()
      .toLowerCase()
      .trim();

    if (!termino) {
      return this.personal();
    }

    return this.personal().filter(persona =>
      persona.numeroDocumento
        .toLowerCase()
        .includes(termino) ||
      `${persona.nombre} ${persona.apellido}`
        .toLowerCase()
        .includes(termino)
    );
  });

  hayResultados = computed(() => {
    return this.personalFiltrado().length > 0;
  });

  form: FormGroup;

  constructor(
    private administradorService: AdministradorService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      tipoDocumento: ['', Validators.required],

      numeroDocumento: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ],

      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/),
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      apellido: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/),
          Validators.minLength(2),
          Validators.maxLength(50)
        ]
      ],

      cargo: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/),
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      ],

      contrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.minLength(7),
          Validators.maxLength(10)
        ]
      ],

      fechaNacimiento: ['', Validators.required],

      genero: ['', Validators.required],

      direccion: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.cargarPersonal();
  }

  cargarPersonal(): void {
    this.cargando.set(true);

    this.administradorService.listarPersonalSalud().subscribe({
      next: data => {
        this.personal.set(data);
        this.cargando.set(false);
      },

      error: err => {
        console.error(
          'Error al cargar personal de salud',
          err
        );

        this.cargando.set(false);
      }
    });
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }

  toggleFormulario(): void {
    if (this.mostrarFormulario()) {
      this.mostrarFormulario.set(false);
      this.cancelarEdicion();
      return;
    }

    this.mostrarFormulario.set(true);
    this.prepararFormularioNuevo();
  }

  prepararFormularioNuevo(): void {
    this.personaEnEdicion.set(null);

    this.form.reset();

    this.habilitarCamposEdicion();

    const contrasena =
      this.form.get('contrasena');

    contrasena?.setValidators([
      Validators.required,
      Validators.minLength(8)
    ]);

    contrasena?.updateValueAndValidity();
  }

  editar(persona: PersonalSalud): void {
    this.personaEnEdicion.set(persona);
    this.mostrarFormulario.set(true);

    this.form.patchValue({
      tipoDocumento: persona.tipoDocumento,
      numeroDocumento: persona.numeroDocumento,
      nombre: persona.nombre,
      apellido: persona.apellido,
      cargo: persona.cargo,
      email: persona.email,
      telefono: persona.telefono,
      fechaNacimiento: persona.fechaNacimiento,
      genero: persona.genero,
      direccion: persona.direccion,
      contrasena: ''
    });

    /*
     * El backend actualiza únicamente:
     * nombre, apellido, email, teléfono,
     * dirección, cargo y contraseña opcional.
     *
     * Estos campos no los editamos desde aquí.
     */
    this.form.get('tipoDocumento')?.disable();
    this.form.get('numeroDocumento')?.disable();
    this.form.get('fechaNacimiento')?.disable();
    this.form.get('genero')?.disable();

    const contrasena =
      this.form.get('contrasena');

    contrasena?.clearValidators();

    contrasena?.setValidators([
      Validators.minLength(8)
    ]);

    contrasena?.updateValueAndValidity();
  }

  cancelarEdicion(): void {
    this.personaEnEdicion.set(null);

    this.form.reset();

    this.habilitarCamposEdicion();

    const contrasena =
      this.form.get('contrasena');

    contrasena?.setValidators([
      Validators.required,
      Validators.minLength(8)
    ]);

    contrasena?.updateValueAndValidity();
  }

  habilitarCamposEdicion(): void {
    this.form.get('tipoDocumento')?.enable();
    this.form.get('numeroDocumento')?.enable();
    this.form.get('fechaNacimiento')?.enable();
    this.form.get('genero')?.enable();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const enEdicion =
      this.personaEnEdicion();

    /*
     * En edición, los campos deshabilitados
     * no se incluyen en form.value.
     * Eso está bien porque el backend actual
     * no los modifica.
     */
    const datos =
      this.form.value as Partial<PersonalSalud>;

    const accion = enEdicion
      ? this.administradorService.actualizarPersonalSalud(
        enEdicion.id,
        datos
      )
      : this.administradorService.registrarPersonalSalud(
        datos
      );

    accion.subscribe({
      next: () => {
        this.mostrarFormulario.set(false);
        this.cancelarEdicion();
        this.cargarPersonal();
      },

      error: err => {
        console.error(
          'Error al guardar personal de salud',
          err
        );
      }
    });
  }

  cambiarEstado(persona: PersonalSalud): void {
    const nuevoEstado =
      persona.estado === 'ACTIVO'
        ? 'INACTIVO'
        : 'ACTIVO';

    this.administradorService
      .cambiarEstadoPersonalSalud(
        persona.id,
        nuevoEstado
      )
      .subscribe({
        next: () => {
          this.cargarPersonal();
        },

        error: err => {
          console.error(
            'Error al cambiar estado del personal',
            err
          );
        }
      });
  }
}