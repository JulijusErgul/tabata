import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  if (authService.isLoggedIn()) {
    logger.info('AuthGuard: user is logged in, access granted');
    return true;
  } else {
    logger.warn('AuthGuard: user not logged in, redirecting to /login');
    router.navigate(['/login']);
    return false;
  }
};
