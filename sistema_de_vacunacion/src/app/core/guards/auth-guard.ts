import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export function authGuard(loginRuta: string): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const token = authService.obtenerToken();

    if (token) {
      return true;
    }

    return router.createUrlTree([loginRuta]);
  };
}