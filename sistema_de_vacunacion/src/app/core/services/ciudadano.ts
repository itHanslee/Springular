import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Ciudadano } from '../../shared/models/ciudadano.model';
import { API } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CiudadanoService {

  constructor(private http: HttpClient) {}

  obtenerPerfil(id: number): Observable<Ciudadano> {
    return this.http.get<Ciudadano>(
      API.CIUDADANOS.PERFIL(id)
    );
  }

  descargarCarne(id: number): Observable<Blob> {
    return this.http.get(
      API.CIUDADANOS.CARNE(id),
      {
        responseType: 'blob'
      }
    );
  }
}