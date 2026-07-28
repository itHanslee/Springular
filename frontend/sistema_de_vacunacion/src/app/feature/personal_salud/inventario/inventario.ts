import { Component, OnInit, signal, computed } from '@angular/core';
import { VacunaService } from '../../../core/services/vacuna';
import { Vacuna } from '../../../shared/models/vacuna.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})

export class Inventario implements OnInit {
  terminoBusqueda = signal('');
  vacunas = signal<Vacuna[]>([]);
  cargando = signal(false);

  vacunasFiltradas = computed(() => {
  const termino = this.terminoBusqueda().toLowerCase().trim();
  if (!termino) return this.vacunas();
  return this.vacunas().filter(v =>
    v.nombre.toLowerCase().includes(termino) ||
    v.numeroLote.toLowerCase().includes(termino)
  );
});

hayResultados = computed(() => this.vacunasFiltradas().length > 0);

constructor(private vacunaService: VacunaService) {}

ngOnInit(): void {
  this.cargarVacunas();
}

cargarVacunas(): void {
  this.cargando.set(true);
  this.vacunaService.listarVacunas().subscribe(data => {
    this.vacunas.set(data);
    this.cargando.set(false);
  });
}

buscarVacunas(valor: string): void {
  this.terminoBusqueda.set(valor);
}


}


