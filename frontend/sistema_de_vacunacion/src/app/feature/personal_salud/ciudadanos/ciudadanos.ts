// feature/personal_salud/ciudadanos/ciudadanos.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CiudadanoService } from '../../../core/services/ciudadano';
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

  opcionesTipoDocumento = ["CC","RC","TI","CE", "PA"];
  opcionesGenero = ["Masculino", "Femenino", "Otro"];

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
    private ciudadanoService: CiudadanoService,
    private fb: FormBuilder
  ) {
    
    this.form = this.fb.group({
      numeroDocumento: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required, Validators.minLength(8)],
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
    this.ciudadanoService.listar().subscribe(data => {
      this.ciudadanos.set(data);
      this.cargando.set(false);
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
    this.ciudadanoService.registrar(this.form.value as Partial<Ciudadano>).subscribe(() => {
      this.form.reset();
      this.mostrarFormulario.set(false);
      this.cargarCiudadanos();
    });
  }
}