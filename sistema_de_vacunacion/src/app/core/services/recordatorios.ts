import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Recordatorio } from '../../shared/models/recordatorios.model';
import { API } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordatorioService {

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(
      API.RECORDATORIOS.BASE
    );
  }

  obtenerPorId(id: number): Observable<Recordatorio> {
    return this.http.get<Recordatorio>(
      API.RECORDATORIOS.POR_ID(id)
    );
  }

  listarPorEstado(
    estado: string
  ): Observable<Recordatorio[]> {
    return this.http.get<Recordatorio[]>(
      API.RECORDATORIOS.POR_ESTADO(estado)
    );
  }

  marcarComoEnviado(id: number): Observable<void> {
    return this.http.patch<void>(
      API.RECORDATORIOS.ENVIADO(id),
      {}
    );
  }

  generarRecordatorios(
    idCiudadano: number
  ): Observable<Recordatorio[]> {
    return this.http.post<Recordatorio[]>(
      `${API.RECORDATORIOS.BASE}/generar/${idCiudadano}`,
      {}
    );
  }
}