import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const API_URL = 'http://localhost:3000';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(
    null,
  );

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.authService.getAccessToken();

    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      }),
    );
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.accessToken);

          // Rejouer la requête avec le nouveau token
          return next.handle(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            }),
          );
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        }),
      );
    } else {
      // Si un refresh est déjà en cours, attendre son résultat
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) =>
          next.handle(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ),
        ),
      );
    }
  }
}
