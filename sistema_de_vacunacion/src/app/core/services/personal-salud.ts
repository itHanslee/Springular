import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ciudadano } from '../../shared/models/ciudadano.model';
import { API } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalSaludService {

  constructor(private http: HttpClient) { }

  listar(): Observable<Ciudadano[]> {
    return this.http.get<Ciudadano[]>(
      API.PERSONAL_SALUD.CIUDADANOS
    );
  }

  registrarCiudadano(
    ciudadano: Partial<Ciudadano>
  ): Observable<Ciudadano> {
    return this.http.post<Ciudadano>(
      API.PERSONAL_SALUD.CIUDADANOS,
      ciudadano
    );
  }

  actualizarCiudadano(
    id: number,
    cambios: Partial<Ciudadano>
  ): Observable<void> {
    return this.http.put<void>(
      API.PERSONAL_SALUD.CIUDADANO_POR_ID(id),
      cambios
    );
  }

  obtenerCiudadanoPorDocumento(
    documento: string
  ): Observable<Ciudadano> {

    return this.http.get<Ciudadano>(
      API.PERSONAL_SALUD.CIUDADANO_POR_DOCUMENTO(documento)
    );
  }
}