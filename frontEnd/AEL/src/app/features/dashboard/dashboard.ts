import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';
import { ContratService } from '../../core/services/contrat.service';

import { Contrat } from '../../shared/models/contrat.model';
import { FactureCard } from '../../shared/components/facture-card/facture-card';
import { ConsommationChart } from '../../shared/components/consommation-chart/consommation-chart';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FactureCard,
    ConsommationChart,
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-grid">
        <!-- Consommation -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title class="title">
              <mat-icon>show_chart</mat-icon>
              Consommation
            </mat-card-title>
          </mat-card-header>

          <mat-card-content class="chart-content">
            <app-consommation-chart
              *ngIf="contrat?.consommation"
              [consommation]="contrat!.consommation"
              [width]="500"
              [height]="190"
            >
            </app-consommation-chart>
          </mat-card-content>
        </mat-card>

        <!-- Facture -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title class="title">
              <mat-icon>receipt</mat-icon>
              Facture
            </mat-card-title>
          </mat-card-header>

          <mat-card-content>
            <app-facture-card [facture]="contrat?.facture || null"> </app-facture-card>
          </mat-card-content>
        </mat-card>

        <!-- Estimation -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title class="title">
              <mat-icon>trending_up</mat-icon>
              Estimation prochaine facture
            </mat-card-title>
          </mat-card-header>

          <mat-card-content class="estimation-content">
            <div class="estimation-value">
              <span class="amount"> {{ moyenneFactures | number: '1.2-2' }} $ </span>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Justificatif -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title class="title">
              <mat-icon>folder</mat-icon>
              Justificatif de domicile
            </mat-card-title>
          </mat-card-header>

          <mat-card-content class="justificatif-content">
            <mat-icon class="large-icon">description</mat-icon>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        min-height: 100vh;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .title {
        font-size: 24px;
        text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
      }

      .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .dashboard-card {
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      mat-card-header {
        padding: 16px;
      }

      mat-card-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 20px;
      }

      mat-card-content {
        padding: 20px;
        min-height: 220px;
      }

      .chart-content {
        height: 220px;
      }

      .estimation-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
      }

      .amount {
        font-size: 48px;
        font-weight: bold;
      }

      .estimation-label {
        color: #666;
        font-size: 14px;
      }

      .justificatif-content {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
      }

      .large-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        color: #333;
      }

      @media (max-width: 768px) {
        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class Dashboard implements OnInit {
  contrat: Contrat | null = null;
  moyenneFactures = 0;

  constructor(
    private authService: AuthService,
    private layoutService: LayoutService,
    private contratService: ContratService,
  ) {}

  ngOnInit() {
    this.loadContrat();
  }

  loadContrat() {
    const userId = this.contratService.getUserIdFromToken();

    if (!userId) {
      console.log('Aucun utilisateur connecté');
      return;
    }

    this.contratService.getContratsByUser(userId).subscribe({
      next: (contrats) => {
        if (contrats && contrats.length > 0) {
          this.contrat = contrats[0];

          this.calculateMoyenneFactures(contrats);
        }
      },

      error: (error) => {
        console.error('Erreur chargement contrats', error);
      },
    });
  }

  calculateMoyenneFactures(contrats: Contrat[]) {
    if (contrats.length === 0) {
      this.moyenneFactures = 0;
      return;
    }

    const total = contrats.reduce((sum, c) => sum + (c.facture?.montant || 0), 0);

    this.moyenneFactures = total / contrats.length;
  }

  logout() {
    this.layoutService.setLoggedIn(false);
    this.authService.logout();
  }
}
