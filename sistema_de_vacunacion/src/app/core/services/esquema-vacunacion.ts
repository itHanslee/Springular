import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EsquemaVacunacion, ProximaDosisResult } from '../../shared/models/esquema-vacunacion.model';

@Injectable({ providedIn: 'root' })
export class EsquemaVacunacionService {

  private baseUrl = '/api/esquemas-vacunacion';

  constructor(private http: HttpClient) {}

  listarPorVacuna(vacunaId: number): Observable<EsquemaVacunacion[]> {
    return this.http.get<EsquemaVacunacion[]>(`${this.baseUrl}/vacuna/${vacunaId}`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  crear(esquema: EsquemaVacunacion): Observable<EsquemaVacunacion> {
    return this.http.post<EsquemaVacunacion>(this.baseUrl, esquema).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  actualizar(id: number, esquema: EsquemaVacunacion): Observable<EsquemaVacunacion> {
    return this.http.put<EsquemaVacunacion>(`${this.baseUrl}/${id}`, esquema).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  calcularProximaDosis(documento: string): Observable<ProximaDosisResult> {
    return this.http.get<ProximaDosisResult>(`${this.baseUrl}/proxima-dosis/${documento}`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  verificarEsquema(documento: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verificar/${documento}`).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }
}