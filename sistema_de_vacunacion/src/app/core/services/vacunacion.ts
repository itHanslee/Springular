import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Vacunacion as VacunacionModel,
  VacunaPendiente,
  
} from '../../shared/models/vacunacion.model';
import {RegistrarVacunacionRequest} from '../../shared/models/registrar-vacunacion-request.model'
import { API } from '../../../environments/environment';

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

  constructor(private http: HttpClient) {}

  registrarAplicacion(
    datos: RegistrarVacunacionRequest
  ): Observable<void> {

    return this.http.post<void>(
      API.VACUNACIONES.BASE,
      datos
    );
  }

  obtenerVacunasCiudadano(
    idCiudadano: number
  ): Observable<VacunacionModel[]> {

    return this.http.get<VacunacionModel[]>(
      API.VACUNACIONES.POR_CIUDADANO(idCiudadano)
    );
  }

  obtenerHistorial(
    idCiudadano: number
  ): Observable<VacunacionModel[]> {

    return this.http.get<VacunacionModel[]>(
      API.VACUNACIONES.HISTORIAL(idCiudadano)
    );
  }

  obtenerVacunasPendientes(
    idCiudadano: number
  ): Observable<VacunaPendiente[]> {

    return this.http.get<VacunaPendiente[]>(
      API.VACUNACIONES.PENDIENTES(idCiudadano)
    );
  }

  generarReporte(
    filtros: FiltrosReporte
  ): Observable<Blob> {

    return this.http.post(
      API.REPORTES.VACUNACIONES,
      filtros,
      {
        responseType: 'blob'
      }
    );
  }
}