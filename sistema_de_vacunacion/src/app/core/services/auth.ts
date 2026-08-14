import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LoginCiudadanoRequest } from '../../shared/models/login-ciudadano-request.model';
import { LoginStaffRequest } from '../../shared/models/login-staff-request.model';
import { LoginResponse } from '../../shared/models/login-response.model';

import { API } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  loginCiudadano(data: LoginCiudadanoRequest) {

    const request = {
      usuario: data.numeroDocumento,
      contrasena: data.ultimosDigitos
    };

    return this.http.post<LoginResponse>(
      API.AUTH.LOGIN,
      request
    );
  }

  loginStaff(data: LoginStaffRequest) {

    const request = {
      usuario: data.usuario,
      contrasena: data.contrasena
    };

    return this.http.post<LoginResponse>(
      API.AUTH.LOGIN,
      request
    );
  }
}