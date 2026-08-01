import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recordatorio } from '../../shared/models/recordatorios.model';

export interface FiltrosRecordatorio {
  fechaDesde: Date;
  fechaHasta: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {
  private readonly baseUrl = '/api/recordatorios';

  constructor(private http: HttpClient) {}

  listarPorDocumento(documento: string): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(
      `${this.baseUrl}/documento/${encodeURIComponent(documento)}`
    );
  }

  obtenerPorId(id: number): Observable<Recordatorio> {
    return this.http.get<Recordatorio>(`${this.baseUrl}/${id}`);
  }

  crear(recordatorio: Partial<Recordatorio>): Observable<Recordatorio> {
    return this.http.post<Recordatorio>(this.baseUrl, recordatorio);
  }

  actualizar(
    id: number,
    cambios: Partial<Recordatorio>
  ): Observable<Recordatorio> {
    return this.http.put<Recordatorio>(`${this.baseUrl}/${id}`, cambios);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}