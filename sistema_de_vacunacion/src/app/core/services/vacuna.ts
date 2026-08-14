import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API } from '../../../environments/environment';
import { Vacuna } from '../../shared/models/vacuna.model';

@Injectable({
  providedIn: 'root'
})
export class VacunaService {

  constructor(private http: HttpClient) {}

  listar(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(
      API.VACUNAS.BASE
    );
  }

  listarVacunas(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(
      API.VACUNAS.BASE
    );
  }

  registrar(
    vacuna: Partial<Vacuna>
  ): Observable<Vacuna> {
    return this.http.post<Vacuna>(
      API.VACUNAS.BASE,
      vacuna
    );
  }

  actualizar(
    id: number,
    cambios: Partial<Vacuna>
  ): Observable<Vacuna> {
    return this.http.put<Vacuna>(
      API.VACUNAS.POR_ID(id),
      cambios
    );
  }

  cambiarEstado(
    id: number,
    estado: string
  ): Observable<void> {
    return this.http.patch<void>(
      API.VACUNAS.ESTADO(id),
      null,
      {
        params: { estado }
      }
    );
  }
}