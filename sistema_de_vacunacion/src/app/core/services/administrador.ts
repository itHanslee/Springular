import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API } from '../../../environments/environment';
import { PersonalSalud } from '../../shared/models/personal-salud.model';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  constructor(private http: HttpClient) {}

  registrarPersonalSalud(
    personal: Partial<PersonalSalud>
  ): Observable<PersonalSalud> {

    return this.http.post<PersonalSalud>(
      API.ADMIN.PERSONAL_SALUD,
      personal
    );
  }

  cambiarEstadoPersonalSalud(
    id: number,
    estado: string
  ): Observable<PersonalSalud> {

    return this.http.patch<PersonalSalud>(
      API.ADMIN.ACTUALIZAR_PERSONAL_SALUD(id),
      { estado }
    );
  }
}