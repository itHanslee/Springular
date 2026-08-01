// core/services/auth.ts
import { Injectable, signal } from '@angular/core';

export type Rol = 'CIUDADANO' | 'PERSONAL_SALUD' | 'ADMINISTRADOR';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // 👇 usuario simulado mientras no hay backend — cambia el rol para probar otros layouts
  private usuario = signal({ nombre: 'personal_salud', rol: 'PERSONAL_SALUD' as Rol });

  usuarioActual() {
    return this.usuario();
  }

  rolActual(): Rol {
    return this.usuario().rol;
  }
}
