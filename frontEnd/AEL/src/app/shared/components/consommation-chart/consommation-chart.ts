import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonneesConsommation } from '../../models/contrat.model';

@Component({
  selector: 'app-consommation-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" *ngIf="chartUrl; else loadingChart">
      <img [src]="chartUrl" class="consumption-chart" [width]="width" [height]="height" />
    </div>

    <ng-template #loadingChart>
      <div class="loading">Chargement du graphique...</div>
    </ng-template>
  `,
  styles: [
    `
      .chart-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      }

      .consumption-chart {
        border-radius: 8px;
        max-width: 100%;
        height: auto;
      }

      .loading {
        text-align: center;
        color: #666;
        font-style: italic;
      }
    `,
  ],
})
export class ConsommationChart implements OnInit, OnChanges {
  @Input() consommation: DonneesConsommation | null = null;
  @Input() width: number = 400;
  @Input() height: number = 200;

  chartUrl: string | null = null;

  ngOnInit() {
    this.generateChartUrl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['consommation']) {
      this.generateChartUrl();
    }
  }

  generateChartUrl() {
    if (!this.consommation) {
      this.chartUrl = null;
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

    this.chartUrl =
      `https://quickchart.io/chart?c=${encodedChart}` +
      `&w=${this.width}` +
      `&h=${this.height}` +
      `&backgroundColor=%23ffffff` +
      `&devicePixelRatio=1`;
  }
}
