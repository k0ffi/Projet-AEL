import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
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
    MatListModule,
    FactureCard,
    ConsommationChart,
  ],
  template: `
    <mat-card class="contrat-detail-card">
      <mat-card-header>
        <mat-card-title class="title">{{ contrat.information.contrat_name }}</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <mat-tab-group animationDuration="300ms">
          <!-- Onglet Informations -->
          <mat-tab label="INFORMATIONS">
            <div class="tab-content">
              <mat-list>
                <mat-list-item>
                  <span matListItemTitle class="info-label">Référence</span>
                  <span matListItemLine class="info-value">{{
                    contrat.information.reference
                  }}</span>
                </mat-list-item>

                <mat-list-item>
                  <span matListItemTitle class="info-label">Nom du contrat</span>
                  <span matListItemLine class="info-value">{{
                    contrat.information.contrat_name
                  }}</span>
                </mat-list-item>

                <mat-list-item>
                  <span matListItemTitle class="info-label">Activité</span>
                  <span matListItemLine class="info-value">{{ contrat.information.activite }}</span>
                </mat-list-item>

                <mat-list-item>
                  <span matListItemTitle class="info-label">Date de souscription</span>
                  <span matListItemLine class="info-value">{{
                    contrat.information.date_souscription
                  }}</span>
                </mat-list-item>

                <mat-list-item>
                  <span matListItemTitle class="info-label">Adresse</span>
                  <span matListItemLine class="info-value">{{ contrat.information.adresse }}</span>
                </mat-list-item>
              </mat-list>
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
    .title {
      font-size: 32px;
      font-weight: 500;
      text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
    }
    mat-card-header {
      margin-bottom: 20px;
    }

    .tab-content {
      padding: 24px 16px;
      overflow-y: auto;
      min-height: 300px;
    }

    mat-list-item {
      height: auto !important;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    mat-list-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 14px;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      min-width: 180px;
    }

    .info-value {
      font-size: 16px;
      color: #212121;
      font-weight: 500;
      padding-left: 70%;
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
