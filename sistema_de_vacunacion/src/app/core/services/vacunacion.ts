import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  VacunaPendiente,
  Vacunacion as VacunacionModel
} from '../../shared/models/vacunacion.model';

export interface FiltrosReporte {
  fechaDesde: Date;
  fechaHasta: Date;
  tipoReporte: string;
  formato: 'PDF' | 'EXCEL';
}

@Injectable({
  providedIn: 'root'
})
export class VacunacionService {
  private readonly baseUrl = '/api/vacunaciones';

  constructor(private http: HttpClient) {}

  buscarPendientePorDocumento(documento: string): Observable<VacunaPendiente> {
    return this.http.get<VacunaPendiente>(
      `${this.baseUrl}/pendiente/${encodeURIComponent(documento)}`
    );
  }

  registrarAplicacion(datos: Partial<VacunacionModel>): Observable<VacunacionModel> {
    return this.http.post<VacunacionModel>(this.baseUrl, datos);
  }

  obtenerHistorial(documento: string): Observable<VacunacionModel[]> {
    return this.http.get<VacunacionModel[]>(
      `${this.baseUrl}/historial/${encodeURIComponent(documento)}`
    );
  }

  generarReporte(filtros: FiltrosReporte): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/reportes`, filtros, {
      responseType: 'blob'
    });
  }
}