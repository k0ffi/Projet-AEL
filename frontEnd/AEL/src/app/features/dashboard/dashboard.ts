import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { LayoutService } from '../../core/services/layout.service';
import { ContratService } from '../../core/services/contrat.service';
import { Contrat } from '../../shared/models/contrat.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
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
          <mat-card-content>
            <div class="chart-container" *ngIf="chartUrl; else loadingChart">
              <img [src]="chartUrl" alt="Graphique de consommation" class="consumption-chart" />
            </div>
            <ng-template #loadingChart>
              <div class="loading">Chargement du graphique...</div>
            </ng-template>
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
            <table class="facture-table">
              <tr>
                <td class="label">Référence</td>
                <td class="label">Montant</td>
              </tr>
              <tr>
                <td class="value">{{ contrat?.facture?.reference || 'N/A' }}</td>
                <td class="value">{{ contrat?.facture?.montant | number: '1.2-2' }} €</td>
              </tr>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Card 3: Estimation prochaine facture -->
        <mat-card class="dashboard-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>info</mat-icon>
              Estimation prochaine facture
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <!-- estimation basée sur la consommation actuelle ( moyenne )   -->
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
      background-color: #cdcdcd;
    }

    .dashboard-title {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
      font-size: 28px;
      font-weight: 500;
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
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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

    /* Chart styles */
    .chart-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 220px;
    }

    .consumption-chart {
      max-width: 100%;
      max-height: 200px;
      border-radius: 8px;
    }

    .loading {
      text-align: center;
      color: #666;
      font-style: italic;
    }

    /* Facture table styles */
    .facture-table {
      width: 100%;
      border-collapse: collapse;
    }

    .facture-table tr {
      border-bottom: 1px solid #eee;
    }

    .facture-table td {
      padding: 12px 8px;
    }

    .facture-table .label {
      font-weight: 500;
      color: #555;
    }

    .facture-table .value {
      text-align: right;
      font-weight: bold;
      color: #333;
    }

    .facture-table .value.highlight {
      color: #1976d2;
      font-size: 18px;
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
      color: #1976d2;
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

    /* Contrat info styles */
    .contrat-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }

    .info-label {
      font-weight: 500;
      color: #555;
    }

    .info-value {
      color: #333;
      font-weight: bold;
      text-align: right;
      max-width: 60%;
      word-wrap: break-word;
    }

    .no-contrat {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 40px;
    }

    /* Logout button */
    .logout-container {
      display: flex;
      justify-content: center;
      margin-top: 30px;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 30px;
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
  chartUrl: string = '';
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

    this.contratService.getContratsByUser(userId).subscribe({
      next: (contrats) => {
        if (contrats && contrats.length > 0) {
          // Prendre le premier contrat
          this.contrat = contrats[0];
          this.generateChartUrl();
          this.calculateMoyenneFactures(contrats);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des contrats:', error);
      },
    });
  }

  generateChartUrl() {
    if (!this.contrat?.consommation) return;

    const labels = this.contrat.consommation.labels;
    const data = this.contrat.consommation.datasets[0]?.data || [];
    const label = this.contrat.consommation.datasets[0]?.label || 'Consommation';
    const color = this.contrat.consommation.datasets[0]?.backgroundColor || 'rgb(54, 162, 235)';

    // Convertir la couleur rgb en format hex pour quickchart
    const colorHex = this.rgbToHex(color);

    // Générer l'URL du graphique avec quickchart.io
    const chartConfig = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: label,
            data: data,
            borderColor: colorHex,
            backgroundColor: colorHex + '50', // Semi-transparent
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    // Encoder la configuration en base64 pour quickchart
    const encodedConfig = btoa(JSON.stringify(chartConfig));
    this.chartUrl = `https://quickchart.io/chart?c=${encodedConfig}&w=400&h=200`;
  }

  rgbToHex(rgb: string): string {
    // Convertir "rgb(r, g, b)" en "#rrggbb"
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
      const r = parseInt(match[1]).toString(16).padStart(2, '0');
      const g = parseInt(match[2]).toString(16).padStart(2, '0');
      const b = parseInt(match[3]).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    }
    return rgb; // Retourner la couleur originale si impossible à convertir
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
