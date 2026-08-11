import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { LoginCiudadanoRequest } from '../../shared/models/login-ciudadano-request.model';
import { LoginStaffRequest } from '../../shared/models/login-staff-request.model';
import { LoginResponse } from '../../shared/models/login-response.model';
import { environment } from '../../../environments/environment';

const CLAVE_SESION = 'delta_sesion';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loginCiudadano(data: LoginCiudadanoRequest) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login-ciudadano`,
      data
    );
  }

  loginStaff(data: LoginStaffRequest) {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/auth/login-staff`,
      data
    );
  }
}
