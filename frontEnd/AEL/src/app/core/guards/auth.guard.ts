import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getAccessToken();
  console.log('AuthGuard - Token:', token ? 'Présent' : 'Absent');

  if (token) {
    return true;
  } else {
    console.log('AuthGuard - Redirection vers /');
    router.navigate(['/']);
    return false;
  }
};
