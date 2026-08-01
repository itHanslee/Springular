// core/guards/role-guard.ts
import { CanActivateFn } from '@angular/router';

export function roleGuard(rolEsperado: string): CanActivateFn {
  return () => {
    
    return true;
  };
}