// core/services/administrador/vacuna.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Vacuna } from '../../../app/shared/models/vacuna.model';

@Injectable({ providedIn: 'root' })
export class VacunaService {
  
  // 1. Creamos nuestra base de datos simulada
  private vacunasMock: Vacuna[] = [
    { id: 1, nombre: 'Pfizer-BioNTech', dosis: 2, stock: 150 },
    { id: 2, nombre: 'AstraZeneca', dosis: 2, stock: 80 },
    { id: 3, nombre: 'Janssen', dosis: 1, stock: 45 },
    { id: 4, nombre: 'Sinovac', dosis: 2, stock: 300 }
  ];

  // Ya no necesitamos HttpClient temporalmente
  constructor() {}

  listar(): Observable<Vacuna[]> {
    // of() emite los datos y delay(800) simula el tiempo de carga de la red
    return of(this.vacunasMock).pipe(delay(800));
  }
  
  listarVacunas(): Observable<Vacuna[]> {
    return this.listar();
  }

  registrar(vacuna: Partial<Vacuna>): Observable<Vacuna> {
    // Simulamos la creación asignando un ID aleatorio
    const nuevaVacuna: Vacuna = { 
      ...vacuna, 
      id: new Date().getTime() 
    } as Vacuna;
    
    this.vacunasMock.push(nuevaVacuna);
    return of(nuevaVacuna).pipe(delay(500));
  }

  actualizar(id: number, cambios: Partial<Vacuna>): Observable<Vacuna> {
    const index = this.vacunasMock.findIndex(v => v.id === id);
    
    if (index !== -1) {
      // Actualizamos el objeto en nuestro array falso
      this.vacunasMock[index] = { ...this.vacunasMock[index], ...cambios };
      return of(this.vacunasMock[index]).pipe(delay(500));
    }
    
    throw new Error('Vacuna no encontrada');
  }
}