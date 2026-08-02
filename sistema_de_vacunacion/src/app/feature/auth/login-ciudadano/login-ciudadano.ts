import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
 
import { AuthService } from '../../../core/services/auth';
import { TipoDocumento } from '../../../shared/models/usuario.model';
import { LoginCiudadanoRequest } from '../../../shared/models/login-ciudadano-request.model';
 
interface OpcionTipoDocumento {
  valor: TipoDocumento;
  etiqueta: string;
}

@Component({
  selector: 'app-login-ciudadano',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-ciudadano.html',
  styleUrl: './login-ciudadano.css'
})
export class LoginCiudadanoComponent {
 
  cargando = signal(false);
  mensajeError = signal('');
 
  readonly tiposDocumento: OpcionTipoDocumento[] = [
    { valor: 'CC', etiqueta: 'Cédula de Ciudadanía' },
    { valor: 'TI', etiqueta: 'Tarjeta de Identidad' },
    { valor: 'RC', etiqueta: 'Registro Civil' },
    { valor: 'CE', etiqueta: 'Cédula de Extranjería' },
    { valor: 'PA', etiqueta: 'Pasaporte' }
  ];
 
  loginForm: FormGroup;
 
  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = new FormGroup(
      {
        tipoDocumento: new FormControl<TipoDocumento>('CC', {
          nonNullable: true,
          validators: [Validators.required]
        }),
        numeroDocumento: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern(/^[0-9]{5,15}$/)]
        }),
        ultimosDigitos: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern(/^[0-9]{4}$/)]
        })
      },
      { validators: this.validarUltimosDigitos }
    );
  }
 
  // Reemplaza al captcha: exige que el ciudadano reingrese los últimos
  // 4 dígitos de su documento como verificación manual.
  private validarUltimosDigitos(grupo: AbstractControl): ValidationErrors | null {
    const numeroDocumento = grupo.get('numeroDocumento')?.value ?? '';
    const ultimosDigitos = grupo.get('ultimosDigitos')?.value ?? '';
 
    if (!numeroDocumento || !ultimosDigitos) {
      return null;
    }
 
    const esperado = numeroDocumento.slice(-4);
    return esperado === ultimosDigitos ? null : { ultimosDigitosNoCoinciden: true };
  }
 
  get f() {
    return this.loginForm.controls;
  }
 
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
 
    this.cargando.set(true);
    this.mensajeError.set('');
 
    const request: LoginCiudadanoRequest = this.loginForm.getRawValue();
 
    this.authService.loginCiudadano(request).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/ciudadano/historial']);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mensajeError.set(
          error.status === 401
            ? 'Los datos ingresados no corresponden a ningún ciudadano registrado.'
            : 'No se pudo validar tu identidad. Intenta nuevamente en unos minutos.'
        );
      }
    });
  }
}