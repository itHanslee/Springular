import { Component, OnInit, signal } from '@angular/core';

interface DatosCarnet {
  nombre: string;
  documento: string;
}

@Component({
  selector: 'app-carnet',
  standalone: true,
  imports: [],
  templateUrl: './carnet.html',
  styleUrl: './carnet.css',
})
export class Carnet implements OnInit {

  datosCarnet = signal<DatosCarnet | null>(null);

  cargando = signal(false);

  ngOnInit(): void {
    this.cargarCarnet();
  }

  cargarCarnet(): void {
    this.cargando.set(true);

    this.datosCarnet.set({
      nombre: 'María Ortiz',
      documento: '1048XXXXXX'
    });

    this.cargando.set(false);
  }

  descargarCarnet(): void {
    console.log('Descargar PDF');
  }
}

