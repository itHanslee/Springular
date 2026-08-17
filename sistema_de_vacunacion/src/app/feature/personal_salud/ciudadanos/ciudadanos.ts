// feature/personal_salud/ciudadanos/ciudadanos.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalSaludService } from '../../../core/services/personal-salud';
import { Ciudadano } from '../../../shared/models/ciudadano.model';
import { calcularEdad } from '../../../shared/utils/fecha.utils';

@Component({
  selector: 'app-ciudadanos',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ciudadanos.html',
  styleUrl: './ciudadanos.css'
})
export class Ciudadanos implements OnInit {
  ciudadanos = signal<Ciudadano[]>([]);
  cargando = signal(true);
  terminoBusqueda = signal('');
  mostrarFormulario = signal(false);
  mensajeError = signal<string | null>(null);

  // Ciudadano que se está editando
  ciudadanoEnEdicion = signal<Ciudadano | null>(null);

  opcionesTipoDocumento = ["CC", "RC", "TI", "CE", "PA"];
  opcionesGenero = ["MASCULINO", "FEMENINO", "OTRO"];

  ciudadanosFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    if (!termino) return this.ciudadanos();
    return this.ciudadanos().filter(c =>
      c.numeroDocumento.toLowerCase().includes(termino) ||
      c.nombre.toLowerCase().includes(termino) ||
      c.apellido.toLowerCase().includes(termino)
    );
  });

  hayResultados = computed(() => this.ciudadanosFiltrados().length > 0);

  form: FormGroup;

  constructor(
    private personalSaludService: PersonalSaludService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      numeroDocumento: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          Validators.minLength(6),
          Validators.maxLength(12)
        ]
      ],
      tipoDocumento: ['', Validators.required],
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
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
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
    this.cargarCiudadanos();
  }

  cargarCiudadanos(): void {
    this.cargando.set(true);

    this.personalSaludService.listar().subscribe({
      next: data => {
        this.ciudadanos.set(data);
        this.cargando.set(false);
      },
      error: error => {
        console.error('Error al cargar ciudadanos', error);
        this.cargando.set(false);
      }
    });
  }

  edadDe(fechaNacimiento: string): number {
    return calcularEdad(fechaNacimiento);
  }

  buscar(valor: string): void {
    this.terminoBusqueda.set(valor);
  }

  toggleFormulario(): void {
    this.mostrarFormulario.update(v => !v);

    if (!this.mostrarFormulario()) {
      this.mensajeError.set(null);
    }
  }


  // EDITAR CIUDADANO


  editar(ciudadano: Ciudadano): void {

    this.ciudadanoEnEdicion.set(ciudadano);

    this.mostrarFormulario.set(true);

    this.form.patchValue({
      numeroDocumento: ciudadano.numeroDocumento,
      tipoDocumento: ciudadano.tipoDocumento,
      nombre: ciudadano.nombre,
      apellido: ciudadano.apellido,
      email: ciudadano.email,
      telefono: ciudadano.telefono,
      fechaNacimiento: ciudadano.fechaNacimiento,
      genero: ciudadano.genero,
      direccion: ciudadano.direccion
    });


    // CAMPOS QUE NO SE PUEDEN EDITAR


    this.form.get('numeroDocumento')?.disable();
    this.form.get('tipoDocumento')?.disable();
    this.form.get('nombre')?.disable();
    this.form.get('apellido')?.disable();
    this.form.get('fechaNacimiento')?.disable();
    this.form.get('genero')?.disable();


    // CAMPOS QUE SÍ SE PUEDEN EDITAR


    this.form.get('email')?.enable();
    this.form.get('telefono')?.enable();
    this.form.get('direccion')?.enable();
  }


  // CANCELAR


  cancelarEdicion(): void {

    this.ciudadanoEnEdicion.set(null);

    this.form.reset();

    // Volver a habilitar todos los campos
    this.form.enable();
  }


  // GUARDAR / ACTUALIZAR


  guardar(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const ciudadanoEditando =
      this.ciudadanoEnEdicion();


    // ACTUALIZAR CIUDADANO


    if (ciudadanoEditando) {

      // SOLO se envían estos tres campos
      const cambios = {
        email: this.form.get('email')?.value,
        telefono: this.form.get('telefono')?.value,
        direccion: this.form.get('direccion')?.value
      };

      this.personalSaludService
        .actualizarCiudadano(
          ciudadanoEditando.id,
          cambios
        )
        .subscribe({

          next: () => {

            console.log(
              'Ciudadano actualizado correctamente'
            );

            this.cancelarEdicion();

            this.mostrarFormulario.set(false);

            this.cargarCiudadanos();
          },

          error: error => {
            console.error('Error al registrar ciudadano:', error);
            this.mensajeError.set(
              error.error?.message ?? 'No se pudo guardar el ciudadano.'
            );
          }
        });

      return;
    }


    // REGISTRAR CIUDADANO


    const datos =
      this.form.getRawValue() as Partial<Ciudadano>;

    this.personalSaludService
      .registrarCiudadano(datos)
      .subscribe({

        next: () => {

          this.form.reset();

          this.mostrarFormulario.set(false);

          this.cargarCiudadanos();
        },

        error: error => {

          console.error(
            'Error al registrar ciudadano:',
            error
          );

        }
      });
  }
}
