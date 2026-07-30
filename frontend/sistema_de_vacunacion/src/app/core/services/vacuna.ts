// core/services/administrador/vacuna.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vacuna } from '../../../app/shared/models/vacuna.model';

@Injectable({ providedIn: 'root' })
export class VacunaService {
  private readonly baseUrl = '';

  constructor(private http: HttpClient) {}

  listar(): Observable<Vacuna[]> {
    return this.http.get<Vacuna[]>(this.baseUrl);
  }

  listarVacunas(): Observable<Vacuna[]> {
    return this.listar();
  }

  registrar(vacuna: Partial<Vacuna>): Observable<Vacuna> {
    return this.http.post<Vacuna>(this.baseUrl, vacuna);
  }

  actualizar(id: number, cambios: Partial<Vacuna>): Observable<Vacuna> {
    return this.http.put<Vacuna>(`${this.baseUrl}/${id}`, cambios);
  }
}