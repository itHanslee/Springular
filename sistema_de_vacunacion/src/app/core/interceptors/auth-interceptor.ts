import { HttpInterceptorFn } from '@angular/common/http';

const CLAVE_SESION = 'delta_sesion';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const esLogin = req.url.includes('/api/auth/login');

  if (esLogin) {
    return next(req);
  }

  const sesion = localStorage.getItem(CLAVE_SESION);

  if (!sesion) {
    return next(req);
  }

  try {
    const data = JSON.parse(sesion);

    if (!data.token) {
      return next(req);
    }

    const requestConToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${data.token}`
      }
    });

    return next(requestConToken);

  } catch {
    localStorage.removeItem(CLAVE_SESION);
    return next(req);
  }
};