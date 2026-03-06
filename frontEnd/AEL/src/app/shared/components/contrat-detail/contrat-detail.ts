import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Contrat } from '../../models/contrat.model';
import { FactureCard } from '../facture-card/facture-card';
import { ConsommationChart } from '../consommation-chart/consommation-chart';

@Component({
  selector: 'app-contrat-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    FactureCard,
    ConsommationChart,
  ],
  template: `
    <mat-card class="contrat-detail-card">
      <mat-card-header>
        <mat-card-title>{{ contrat.information.contrat_name }}</mat-card-title>
        <mat-card-subtitle>
          Ref: {{ contrat.information.reference }} - {{ contrat.information.activite }}
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <mat-tab-group animationDuration="300ms">
          <!-- Onglet Informations -->
          <mat-tab label="INFORMATIONS">
            <div class="tab-content">
              <div class="info-row">
                <mat-icon class="info-icon">description</mat-icon>
                <div class="info-details">
                  <span class="info-label">Référence</span>
                  <span class="info-value">{{ contrat.information.reference }}</span>
                </div>
              </div>

              <div class="info-row">
                <mat-icon class="info-icon">business</mat-icon>
                <div class="info-details">
                  <span class="info-label">Activité</span>
                  <span class="info-value">{{ contrat.information.activite }}</span>
                </div>
              </div>

              <div class="info-row">
                <mat-icon class="info-icon">calendar_today</mat-icon>
                <div class="info-details">
                  <span class="info-label">Date de souscription</span>
                  <span class="info-value">{{ contrat.information.date_souscription }}</span>
                </div>
              </div>

              <div class="info-row">
                <mat-icon class="info-icon">location_on</mat-icon>
                <div class="info-details">
                  <span class="info-label">Adresse</span>
                  <span class="info-value">{{ contrat.information.adresse }}</span>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Onglet Consommation -->
          <mat-tab label="CONSOMMATION">
            <div class="tab-content consommation-tab">
              <app-consommation-chart
                [consommation]="contrat.consommation || null"
                [width]="700"
                [height]="400"
              >
              </app-consommation-chart>
            </div>
          </mat-tab>

          <!-- Onglet Factures -->
          <mat-tab label="FACTURES">
            <div class="tab-content">
              <app-facture-card [facture]="contrat.facture || null"></app-facture-card>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .contrat-detail-card {
      width: auto;
      height: auto;
      margin-top: 10px;
      margin-bottom: 16px;
      border-radius: 4px;
      opacity: 1;
      overflow: hidden;
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    .tab-content {
      padding: 24px 16px;
      overflow-y: auto;
      min-height: 300px;
    }

    .info-row {
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-icon {
      color: #1976d2;
      margin-right: 16px;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .info-details {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 13px;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 18px;
      color: #212121;
      margin-top: 4px;
      font-weight: 500;
    }

    .consommation-tab {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 450px;
    }
  `,
})
export class ContratDetail {
  @Input() contrat!: Contrat;
}
