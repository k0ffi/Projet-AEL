import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contrat } from '../../shared/models/contrat.model';
import { isPlatformBrowser } from '@angular/common';

const API_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ContratService {
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /**
   * Récupère l'access token depuis localStorage
   */
  private getAccessToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  /**
   * Récupère tous les contrats d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @returns Observable contenant un tableau de contrats
   */
  getContratsByUser(userId: string): Observable<Contrat[]> {
    const token = this.getAccessToken();
    console.log('Token récupéré:', token ? 'Token présent' : 'Aucun token');
    console.log('UserID:', userId);

    return this.http.get<Contrat[]>(`${API_URL}/api/contrats/user/${userId}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  /**
   * Récupère un contrat par son ID
   * @param contratId - ID du contrat
   * @returns Observable contenant le contrat
   */
  getContratById(contratId: string): Observable<Contrat> {
    const token = this.getAccessToken();
    return this.http.get<Contrat>(`${API_URL}/api/contrats/${contratId}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  /**
   * Crée un nouveau contrat
   * @param contrat - Données du contrat à créer
   * @returns Observable contenant le contrat créé
   */
  createContrat(contrat: Partial<Contrat>): Observable<Contrat> {
    const token = this.getAccessToken();
    return this.http.post<Contrat>(`${API_URL}/api/contrats`, contrat, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  /**
   * Met à jour un contrat existant
   * @param contratId - ID du contrat à mettre à jour
   * @param contrat - Nouvelles données du contrat
   * @returns Observable contenant le contrat mis à jour
   */
  updateContrat(contratId: string, contrat: Partial<Contrat>): Observable<Contrat> {
    const token = this.getAccessToken();
    return this.http.put<Contrat>(`${API_URL}/api/contrats/${contratId}`, contrat, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  /**
   * Supprime un contrat
   * @param contratId - ID du contrat à supprimer
   * @returns Observable de la réponse
   */
  deleteContrat(contratId: string): Observable<void> {
    const token = this.getAccessToken();
    return this.http.delete<void>(`${API_URL}/api/contrats/${contratId}`, {
      withCredentials: true,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  /**
   * Extrait l'ID utilisateur depuis le token JWT
   * @returns ID utilisateur ou null si non connecté
   */
  getUserIdFromToken(): string | null {
    if (!this.isBrowser) return null;

    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload du token:', payload);
      return payload.id;
    } catch (e) {
      console.error('Erreur lors du décodage du token:', e);
      return null;
    }
  }
}
