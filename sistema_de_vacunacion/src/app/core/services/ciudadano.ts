// core/services/ciudadano.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {delay} from 'rxjs/operators';
import { Ciudadano } from '../../shared/models/ciudadano.model';


@Injectable({ providedIn: 'root' })
export class CiudadanoService {
  private readonly baseUrl = 'http://localhost:8080/api/ciudadanos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Ciudadano[]> {
    return this.http.get<Ciudadano[]>(this.baseUrl);
  }

  registrar(ciudadano: Partial<Ciudadano>): Observable<Ciudadano> {
    return this.http.post<Ciudadano>(this.baseUrl, ciudadano);
  }
}
