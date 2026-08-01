import { Component, OnInit, signal } from '@angular/core';
import { Ciudadano } from '../../../shared/models/ciudadano.model';

@Component({
  selector: 'app-carnet',
  standalone: true,
  imports: [],
  templateUrl: './carnet.html',
  styleUrl: './carnet.css'
})
export class Carnet implements OnInit {

  ciudadano = signal<Ciudadano | null>(null);

  cargando = signal(false);

  ngOnInit(): void {
    this.cargarCarnet();
  }

  cargarCarnet(): void {
    this.cargando.set(true);

    // Mock temporal para mantener la estructura visual
    this.ciudadano.set({
      id: 1,
      nombre: 'María',
      apellido: 'Ortíz',
      numeroDocumento: '1048XXXXXX',
      tipoDocumento: 'CC',
      email: 'maria@example.com',
      contrasena: '',
      telefono: '3001234567',
      estado: 'ACTIVO',
      fechaNacimiento: '2000-01-01',
      genero: 'FEMENINO',
      direccion: 'Barranquilla'
    });

    this.cargando.set(false);
  }
}