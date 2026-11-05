import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { TokenStorageService } from './token-storage.service';

export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const tokenStorage = inject(TokenStorageService);
  const authentication = inject(AuthenticationService);
  const isLoginRequest = request.url === '/authentication/login';
  const isSameOrigin =
    new URL(request.url, window.location.origin).origin === window.location.origin;
  const token = isLoginRequest || !isSameOrigin ? null : tokenStorage.getToken();
  const authenticatedRequest = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && token) {
        authentication.logout();
      }

      return throwError(() => error);
    }),
  );
};
