import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { TipoUsuario } from '../../shared/models/login-response.model';

export function roleGuard(
  rolEsperado: TipoUsuario,
  loginRuta: string
): CanActivateFn {

  return () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const sesion = localStorage.getItem('delta_sesion');

    if (!sesion) {
      return router.createUrlTree([loginRuta]);
    }

    try {
      const respuesta = JSON.parse(sesion);

      if (respuesta.rol === rolEsperado) {
        return true;
      }

      authService.cerrarSesion();

      return router.createUrlTree([loginRuta]);

    } catch {
      authService.cerrarSesion();

      return router.createUrlTree([loginRuta]);
    }
  };
}