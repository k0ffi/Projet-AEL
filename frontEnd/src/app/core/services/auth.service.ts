import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Login - Envoie les identifiants au backend
   * Le refresh token est géré automatiquement par le cookie HttpOnly
   */
  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${API_URL}/api/users/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          this.accessToken = response.accessToken;
          if (this.isBrowser) {
            localStorage.setItem('accessToken', response.accessToken);
          }
          this.isLoggedInSubject.next(true);
        }),
        shareReplay(1),
        catchError((error) => {
          console.error('Erreur de login:', error);
          throw error;
        }),
      );
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  /**
   * Observable pour suivre l'état de connexion
   */
  get isLoggedIn$() {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * Récupère l'access token stocké (depuis la mémoire ou localStorage)
   */
  public getAccessToken(): string | null {
    // D'abord vérifier en mémoire
    if (this.accessToken) {
      return this.accessToken;
    }
    // Sinon vérifier dans localStorage (seulement côté navigateur)
    if (this.isBrowser) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  /**
   * Déconnexion - Efface le cookie et l'état local
   */
  public logout(layoutService?: any): void {
    const token = this.accessToken;
    this.accessToken = null;
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
    }
    this.isLoggedInSubject.next(false);

    // Mettre à jour le layoutService si fourni
    if (layoutService) {
      layoutService.setLoggedIn(false);
    }

    if (token) {
      this.http
        .post(
          `${API_URL}/api/auth/logout`,
          {},
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .subscribe({
          next: () => {
            console.log('Déconnexion réussie');
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Erreur lors de la déconnexion:', error);
            this.router.navigate(['/']);
          },
        });
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Rafraîchit l'access token
   * Utilise le cookie HttpOnly automatiquement envoyé par le navigateur
   */
  public refreshToken(): Observable<any> {
    return this.http.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true }).pipe(
      tap((response: any) => {
        this.accessToken = response.accessToken;
        if (this.isBrowser) {
          localStorage.setItem('accessToken', response.accessToken);
        }
      }),
      shareReplay(1),
      catchError((error) => {
        console.error('Erreur de rafraîchissement du token:', error);
        // En cas d'erreur, déconnexion
        this.logout();
        throw error;
      }),
    );
  }

  /**
   * Inscription - Crée un nouveau compte utilisateur
   */
  public register(userData: {
    nom: string | null | undefined;
    prenom: string | null | undefined;
    date_naissance: string | null | undefined;
    email: string | null | undefined;
    password: string | null | undefined;
  }): Observable<any> {
    return this.http
      .post(`${API_URL}/api/users/register`, userData, {
        withCredentials: true,
        observe: 'response', // Pour récupérer le corps même en cas d'erreur
      })
      .pipe(
        catchError((error) => {
          console.error("Erreur d'inscription:", error);
          throw error;
        }),
      );
  }
}
