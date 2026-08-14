import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API } from '../../../environments/environment';
import { PersonalSalud } from '../../shared/models/personal-salud.model';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  constructor(private http: HttpClient) { }

  listarPersonalSalud(): Observable<PersonalSalud[]> {
    return this.http.get<PersonalSalud[]>(
      API.ADMIN.PERSONAL_SALUD
    );
  }

  registrarPersonalSalud(
    personal: Partial<PersonalSalud>
  ): Observable<PersonalSalud> {

    return this.http.post<PersonalSalud>(
      API.ADMIN.PERSONAL_SALUD,
      personal
    );
  }

    actualizarPersonalSalud(
      id: number,
      datos: Partial<PersonalSalud>
    ): Observable<PersonalSalud> {
      return this.http.put<PersonalSalud>(
        API.ADMIN.PERSONAL_SALUD_POR_ID(id),
        datos
      );
    }


    cambiarEstadoPersonalSalud(
    id: number,
    estado: 'ACTIVO' | 'INACTIVO'
  ): Observable<void> {
    return this.http.patch<void>(
      API.ADMIN.ESTADO_PERSONAL(id),
      null,
      {
        params: { estado }
      }
    );
  }
}