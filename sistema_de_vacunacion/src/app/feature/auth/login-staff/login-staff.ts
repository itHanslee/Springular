import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize, switchMap, of } from 'rxjs';

import { AuthService } from '../../../core/services/auth';
import { LoginStaffRequest } from '../../../shared/models/login-staff-request.model';

@Component({
  selector: 'app-login-staff',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-staff.html',
  styleUrl: './login-staff.css'
})
export class LoginStaffComponent {

  cargando = signal(false);
  mensajeError = signal('');
  mostrarContrasena = signal(false);

  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup({
      usuario: new FormControl('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        ]
      }),
      contrasena: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  alternarVisibilidadContrasena(): void {
    this.mostrarContrasena.set(!this.mostrarContrasena());
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    const request: LoginStaffRequest = this.loginForm.getRawValue();

    this.authService.loginStaff(request).pipe(
      switchMap(respuesta => {
        return this.authService.cargarUsuarioActual().pipe(
          catchError(() => of(null)), // Si falla cargarUsuarioActual, continúa el flujo hacia la navegación
          switchMap(() => of(respuesta))
        );
      }),
      finalize(() => this.cargando.set(false))
    ).subscribe({
      next: (respuesta) => {
        const destino = respuesta.rol === 'ADMINISTRADOR' ? '/administrador' : '/personal-salud';
        this.router.navigate([destino]);
      },
      error: (error: HttpErrorResponse) => {
        this.mensajeError.set(
          error.status === 401
            ? 'Usuario o contraseña incorrectos.'
            : 'No se pudo iniciar sesión. Intenta nuevamente en unos minutos.'
        );
      }
    });
  }
}