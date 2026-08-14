import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { LoginCiudadanoRequest } from '../../shared/models/login-ciudadano-request.model';
import { LoginStaffRequest } from '../../shared/models/login-staff-request.model';
import { LoginResponse } from '../../shared/models/login-response.model';
import { Usuario } from '../../shared/models/usuario.model';

import { API } from '../../../environments/environment';

const CLAVE_SESION = 'delta_sesion';
const CLAVE_USUARIO = 'delta_usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuario = signal<Usuario | null>(null);

  constructor(private http: HttpClient) {
    this.cargarUsuarioGuardado();
  }

  loginCiudadano(
    data: LoginCiudadanoRequest
  ): Observable<LoginResponse> {

    const request = {
      usuario: data.numeroDocumento,
      contrasena: data.ultimosDigitos
    };

    return this.http.post<LoginResponse>(
      API.AUTH.LOGIN,
      request
    ).pipe(
      tap(response => this.guardarSesion(response))
    );
  }

  loginStaff(
    data: LoginStaffRequest
  ): Observable<LoginResponse> {

    const request = {
      usuario: data.usuario,
      contrasena: data.contrasena
    };

    return this.http.post<LoginResponse>(
      API.AUTH.LOGIN,
      request
    ).pipe(
      tap(response => this.guardarSesion(response))
    );
  }

  cargarUsuarioActual(): Observable<Usuario> {

    return this.http.get<Usuario>(
      API.USUARIOS.ME
    ).pipe(
      tap(usuario => {
        this.usuario.set(usuario);

        localStorage.setItem(
          CLAVE_USUARIO,
          JSON.stringify(usuario)
        );
      })
    );
  }

  usuarioActual(): Usuario | null {
    return this.usuario();
  }

  obtenerToken(): string | null {

    const sesion = localStorage.getItem(CLAVE_SESION);

    if (!sesion) {
      return null;
    }

    try {
      const response: LoginResponse = JSON.parse(sesion);

      return response.token;

    } catch {
      return null;
    }
  }

  cerrarSesion(): void {

    localStorage.removeItem(CLAVE_SESION);
    localStorage.removeItem(CLAVE_USUARIO);

    this.usuario.set(null);
  }

  private guardarSesion(response: LoginResponse): void {

    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify(response)
    );
  }

  private cargarUsuarioGuardado(): void {

    const usuarioGuardado =
      localStorage.getItem(CLAVE_USUARIO);

    if (!usuarioGuardado) {
      return;
    }

    try {

      this.usuario.set(
        JSON.parse(usuarioGuardado) as Usuario
      );

    } catch {

      localStorage.removeItem(CLAVE_USUARIO);
    }
  }
}