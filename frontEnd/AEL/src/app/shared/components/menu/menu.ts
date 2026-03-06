import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Contrat } from '../../models/contrat.model';
import { ContratService } from '../../../core/services/contrat.service';
import { LayoutService } from '../../../core/services/layout.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  template: `
    <div class="menu-container">
      <div class="menu-header">
        <h2>Tableau de bord</h2>
      </div>

      <!-- Navigation vers Dashboard -->
      <div class="menu-item" (click)="goToDashboard()">
        <mat-icon>dashboard</mat-icon>
        <span>Dashboard</span>
      </div>

      <!-- Liste des contrats -->
      <div class="contracts-section">
        <h3 class="section-title">Mes Contrats</h3>

        @if (loading) {
          <div class="loading">Chargement...</div>
        }

        @if (error) {
          <div class="error">{{ error }}</div>
        }

        @if (!loading && contracts.length === 0) {
          <div class="empty">Aucun contrat</div>
        }

        @for (contrat of contracts; track contrat.id) {
          <div
            class="menu-item contract-item"
            [class.active]="selectedContractId === contrat.id"
            (click)="selectContract(contrat)"
          >
            <mat-icon>description</mat-icon>
            <div class="contract-info">
              <span class="contract-title">{{ contrat.information.contrat_name }}</span>
              <span class="contract-ref">Ref: {{ contrat.information.reference }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .menu-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background-color: #ffffff;
      color: black;
    }

    .menu-header {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #cacaca;
    }

    .menu-header h2 {
      margin: 0;
      font-size: 20px;
      color: black;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      color: black;
      transition: background-color 0.2s;
    }

    .menu-item:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .menu-item.active {
      background-color: #3f51b5;
      color: white;
    }

    .menu-item mat-icon {
      color: inherit;
    }

    .contracts-section {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    .section-title {
      padding: 8px 16px;
      margin: 0;
      font-size: 12px;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .contract-item {
      flex-direction: row;
      align-items: flex-start;
    }

    .contract-info {
      display: flex;
      flex-direction: column;
    }

    .contract-title {
      font-weight: 500;
      font-size: 14px;
    }

    .contract-ref {
      font-size: 11px;
      color: #757575;
    }

    .contract-item.active .contract-ref {
      color: rgba(255, 255, 255, 0.7);
    }

    .menu-footer {
      padding: 16px;
      border-top: 1px solid #cacaca;
    }

    .logout-btn {
      width: 100%;
      color: #ff6b6b !important;
      justify-content: flex-start;
    }

    .loading,
    .empty,
    .error {
      padding: 16px;
      text-align: center;
      color: #757575;
      font-size: 14px;
    }

    .error {
      color: #f44336;
    }
  `,
})
export class Menu implements OnInit {
  contracts: Contrat[] = [];
  selectedContractId: string | null = null;
  loading = true;
  error = '';

  private contratService = inject(ContratService);
  private layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadContracts();
  }

  loadContracts() {
    const userId = this.contratService.getUserIdFromToken();
    console.log('Menu - UserID extrait:', userId);

    if (!userId) {
      this.error = 'Utilisateur non connecté';
      this.loading = false;
      console.error('Menu - Aucun userID trouvé dans le token');
      return;
    }

    console.log('Menu - Appel API pour récupérer les contrats...');
    this.contratService.getContratsByUser(userId).subscribe({
      next: (data) => {
        console.log('Menu - Contrats reçus:', data);
        this.contracts = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Menu - Erreur lors du chargement des contrats:', err);
        this.error = 'Impossible de charger les contrats';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  selectContract(contrat: Contrat) {
    this.selectedContractId = contrat.id;
    this.layoutService.selectContract(contrat);
    this.router.navigate(['/accueil']);
  }

  goToDashboard() {
    this.layoutService.selectContract(null);
    this.selectedContractId = null;
    this.router.navigate(['/dashboard']);
  }
}
