import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (
    req.url.includes('/auth/login-ciudadano') ||
    req.url.includes('/auth/login-staff')
  ) {
    return next(req);
  }

  const session = localStorage.getItem('delta_sesion');

  if (!session) {
    return next(req);
  }

  const data = JSON.parse(session);

  if (!data.token) {
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${data.token}`
    }
  });

  return next(clonedRequest);
};