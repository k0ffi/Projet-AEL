import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { DonneesConsommation } from '../../models/contrat.model';

@Component({
  selector: 'app-consommation-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" *ngIf="safeChartUrl; else loadingChart">
      <iframe [src]="safeChartUrl" class="consumption-chart" frameborder="0"></iframe>
    </div>
    <ng-template #loadingChart>
      <div class="loading">Chargement du graphique...</div>
    </ng-template>
  `,
  styles: `
    .chart-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    .consumption-chart {
      width: 100%;
      height: 100%;
      border-radius: 8px;
      border: none;
    }

    .loading {
      text-align: center;
      color: #666;
      font-style: italic;
    }
  `,
})
export class ConsommationChart implements OnInit {
  @Input() consommation: DonneesConsommation | null = null;
  @Input() width: number = 400;
  @Input() height: number = 200;

  safeChartUrl: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.generateChartUrl();
  }

  generateChartUrl() {
    if (!this.consommation) {
      return;
    }

    const labels = this.consommation.labels;
    const data = this.consommation.datasets[0]?.data || [];
    const label = this.consommation.datasets[0]?.label || 'Consommation';

    const chartConfig = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'line',
            label: label,
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2,
            fill: false,
            data: data,
            tension: 0.4,
          },
          {
            type: 'bar',
            label: 'Montant (€)',
            backgroundColor: 'rgb(255, 99, 132)',
            data: data.map((x: number) => Math.round(x * 0.3 * 100) / 100),
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

    const encodedChart = encodeURIComponent(JSON.stringify(chartConfig));
    const chartUrl = `https://quickchart.io/chart?c=${encodedChart}&w=${this.width}&h=${this.height}&backgroundColor=%23ffffff`;

    this.safeChartUrl = this.sanitizer.bypassSecurityTrustResourceUrl(chartUrl);
  }
}
