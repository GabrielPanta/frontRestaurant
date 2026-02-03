import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data?.['roles'] as string[] | undefined;
  const userRole = auth.getRole();

  if (roles && userRole && !roles.includes(userRole)) {
    router.navigate(['/no-autorizado']);
    return false;
  }

  return true;
};
