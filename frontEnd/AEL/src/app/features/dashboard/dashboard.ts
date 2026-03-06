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
      <!-- Grille 2x2 -->
      <div class="dashboard-grid">
        <!-- Card 1: Consommation -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>show_chart</mat-icon>
              Consommation
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="chart-content">
            <app-consommation-chart
              [consommation]="contrat?.consommation || null"
              [width]="350"
              [height]="180"
            >
            </app-consommation-chart>
          </mat-card-content>
        </mat-card>

        <!-- Card 2: Facture -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>receipt</mat-icon>
              Facture
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-facture-card [facture]="contrat?.facture || null"></app-facture-card>
          </mat-card-content>
        </mat-card>

        <!-- Card 3: Estimation prochaine facture -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>trending_up</mat-icon>
              Estimation prochaine facture
            </mat-card-title>
          </mat-card-header>
          <mat-card-content class="estimation-content">
            <div class="estimation-value">
              <span class="amount">{{ moyenneFactures | number: '1.2-2' }} $</span>
              <span class="currency"></span>
            </div>
            <p class="estimation-label">Valeur moyenne des factures</p>
          </mat-card-content>
        </mat-card>

        <!-- Card 4: Justificatif de domicile -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>
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
  styles: `
    .dashboard-container {
      min-height: 100vh;
      padding: 20px;
      background-color: #f5f5f5;
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
      border-radius: 12px 12px 0 0;
      padding: 16px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      margin: 0;
    }

    mat-card-title mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    mat-card-content {
      padding: 20px;
      min-height: 250px;
    }

    .chart-content {
      height: 220px;
    }

    /* Estimation styles */
    .estimation-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
    }

    .estimation-value {
      display: flex;
      align-items: baseline;
      gap: 5px;
      margin-bottom: 15px;
    }

    .estimation-value .amount {
      font-size: 48px;
      font-weight: bold;
      color: #333;
    }

    .estimation-value .currency {
      font-size: 24px;
      color: #333;
    }

    .estimation-label {
      color: #666;
      font-size: 14px;
    }

    /* Justificatif styles */
    .justificatif-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      height: 200px;
    }

    .large-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      color: #333;
      margin-bottom: 15px;
    }

    .justificatif-content p {
      color: #666;
      margin-bottom: 15px;
    }

    .download-btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Dashboard implements OnInit {
  contrat: Contrat | null = null;
  moyenneFactures: number = 0;

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

    console.log('Chargement des contrats pour userId:', userId);

    this.contratService.getContratsByUser(userId).subscribe({
      next: (contrats) => {
        console.log('Contrats reçus:', contrats);
        if (contrats && contrats.length > 0) {
          this.contrat = contrats[0];
          console.log('Contrat sélectionné:', this.contrat);
          this.calculateMoyenneFactures(contrats);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des contrats:', error);
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
