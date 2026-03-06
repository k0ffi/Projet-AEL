import { Injectable, signal } from '@angular/core';
import { Contrat } from '../../shared/models/contrat.model';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  // Signal pour suivre le contrat sélectionné
  selectedContract = signal<Contrat | null>(null);

  // Signal pour suivre si l'utilisateur est connecté
  isLoggedIn = signal<boolean>(false);

  /**
   * Sélectionne un contrat
   */
  selectContract(contrat: Contrat | null): void {
    this.selectedContract.set(contrat);
  }

  /**
   * Retourne le contrat actuellement sélectionné
   */
  getSelectedContract(): Contrat | null {
    return this.selectedContract();
  }

  /**
   * Met à jour l'état de connexion
   */
  setLoggedIn(value: boolean): void {
    this.isLoggedIn.set(value);
  }

  /**
   * Retourne si l'utilisateur est connecté
   */
  getIsLoggedIn(): boolean {
    return this.isLoggedIn();
  }
}
