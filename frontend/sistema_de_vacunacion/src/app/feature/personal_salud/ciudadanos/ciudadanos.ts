// feature/personal_salud/ciudadanos/ciudadanos.ts
import { Component, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CiudadanoService } from '../../../core/services/ciudadano';
import { Ciudadano } from '../../../shared/models/ciudadano.model';

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

  ciudadanosFiltrados = computed(() => {
    const termino = this.terminoBusqueda().toLowerCase().trim();
    if (!termino) return this.ciudadanos();
    return this.ciudadanos().filter(c =>
      c.documento.toLowerCase().includes(termino) ||
      c.nombre.toLowerCase().includes(termino)
    );
  });

  hayResultados = computed(() => this.ciudadanosFiltrados().length > 0);

  form: FormGroup; // 👈 solo se declara el tipo aquí, sin inicializar

  constructor(
    private ciudadanoService: CiudadanoService,
    private fb: FormBuilder
  ) {
    // 👇 ahora se inicializa DENTRO del constructor, cuando this.fb ya existe
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      documento: ['', Validators.required],
      edad: [null as number | null, [Validators.required, Validators.min(0)]],
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