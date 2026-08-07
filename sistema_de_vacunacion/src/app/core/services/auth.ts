import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { LoginCiudadanoRequest } from '../../shared/models/login-ciudadano-request.model';
import { LoginStaffRequest } from '../../shared/models/login-staff-request.model';
import { LoginResponse } from '../../shared/models/login-response.model';
import { Usuario } from '../../shared/models/usuario.model';

const CLAVE_SESION = 'delta_sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly _usuarioActual = signal<Usuario | null>(this.cargarSesionGuardada());
  readonly usuarioActual = this._usuarioActual.asReadonly();

  constructor(private http: HttpClient) {}

  loginCiudadano(request: LoginCiudadanoRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login-ciudadano', request).pipe(
      tap(respuesta => this.guardarSesion(respuesta)),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  loginStaff(request: LoginStaffRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login-staff', request).pipe(
      tap(respuesta => this.guardarSesion(respuesta)),
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  cerrarSesion(): void {
    localStorage.removeItem(CLAVE_SESION);
    this._usuarioActual.set(null);
  }

  private guardarSesion(respuesta: LoginResponse): void {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(respuesta));
    this._usuarioActual.set(respuesta.usuario);
  }

  private cargarSesionGuardada(): Usuario | null {
    const data = localStorage.getItem(CLAVE_SESION);
    if (!data) return null;
    try {
      return (JSON.parse(data) as LoginResponse).usuario;
    } catch {
      return null;
    }
  }
}