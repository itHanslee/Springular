import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PersonalSalud } from '../../shared/models/personal-salud.model';
import { API } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class PersonalSaludService {
  private readonly baseUrl = API.PERSONAL_SALUD.CIUDADANOS;

  constructor(private http: HttpClient) {}

  listar(): Observable<PersonalSalud[]> {
    return this.http.get<PersonalSalud[]>(this.baseUrl);
  }

  registrar(persona: Partial<PersonalSalud>): Observable<PersonalSalud> {
    return this.http.post<PersonalSalud>(this.baseUrl, persona);
  }

  actualizar(id: number, cambios: Partial<PersonalSalud>): Observable<PersonalSalud> {
    return this.http.put<PersonalSalud>(`${this.baseUrl}/${id}`, cambios);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}