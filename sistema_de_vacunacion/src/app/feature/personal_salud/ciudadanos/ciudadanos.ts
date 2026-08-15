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

  form: FormGroup; // 👈 solo se declara el tipo aquí, sin inicializar

  constructor(
    private personalSaludService: PersonalSaludService,
    private fb: FormBuilder
  ) {

    this.form = this.fb.group({
      numeroDocumento: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      direccion: ['', Validators.required]
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
      this.form.reset();
    }
  }

  registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.personalSaludService.registrarCiudadano(
      this.form.value as Partial<Ciudadano>
    ).subscribe({
      next: () => {
        this.form.reset();
        this.mostrarFormulario.set(false);
        this.cargarCiudadanos();
      },
      error: error => {
        console.error('Error al registrar ciudadano', error);
      }
    });
  }
}