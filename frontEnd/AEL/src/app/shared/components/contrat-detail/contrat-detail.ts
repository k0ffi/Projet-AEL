import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Contrat } from '../../models/contrat.model';

@Component({
  selector: 'app-contrat-detail',
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  template: `
    <mat-card class="contrat-detail-card">
      <mat-card-header>
        <mat-card-title>{{ contrat.information.contrat_name }}</mat-card-title>
        <mat-card-subtitle
          >Ref: {{ contrat.information.reference }} -
          {{ contrat.information.activite }}</mat-card-subtitle
        >
      </mat-card-header>

      <mat-card-content>
        <mat-tab-group animationDuration="300ms">
          <!-- Onglet Informations -->
          <mat-tab label="INFORMATIONS">
            <div class="tab-content">
              <div class="info-row">
                <mat-icon class="info-icon">description</mat-icon>
                <div class="info-details">
                  <span class="info-label">Référence:</span>
                  <span class="info-value">{{ contrat.information.reference }}</span>
                </div>
              </div>

              <div class="info-row">
                <mat-icon class="info-icon">business</mat-icon>
                <div class="info-details">
                  <span class="info-label">Activité:</span>
                  <span class="info-value">{{ contrat.information.activite }}</span>
                </div>
              </div>

              <div class="info-row">
                <mat-icon class="info-icon">calendar_today</mat-icon>
                <div class="info-details">
                  <span class="info-label">Date de subscription:</span>
                  <span class="info-value">{{ contrat.information.date_souscription }}</span>
                </div>
              </div>

              <div class="info-row">
                <mat-icon class="info-icon">location_on</mat-icon>
                <div class="info-details">
                  <span class="info-label">Adresse:</span>
                  <span class="info-value">{{ contrat.information.adresse }}</span>
                </div>
              </div>

              <div class="info-row">
                <mat-icon class="info-icon">access_time</mat-icon>
                <div class="info-details">
                  <span class="info-label">Date de création:</span>
                  <span class="info-value">{{ contrat.date_creation }}</span>
                </div>
              </div>

              <div class="info-row">
                <mat-icon class="info-icon">update</mat-icon>
                <div class="info-details">
                  <span class="info-label">Dernière modification:</span>
                  <span class="info-value">{{ contrat.date_modification }}</span>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Onglet Consommation -->
          <mat-tab label="CONSOMMATION">
            <div class="tab-content">
              @if (
                contrat.consommation &&
                contrat.consommation.labels &&
                contrat.consommation.labels.length > 0
              ) {
                <div class="consommation-chart">
                  <h3>{{ contrat.consommation.datasets[0].label || 'Consommation' }}</h3>
                  <div class="consommation-data">
                    @for (label of contrat.consommation.labels; track label; let i = $index) {
                      <div class="consommation-row">
                        <span class="periode">{{ label }}</span>
                        <span class="valeur">{{
                          contrat.consommation.datasets[0].data[i] || 0
                        }}</span>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <div class="empty-message">
                  <mat-icon>bar_chart</mat-icon>
                  <p>Aucune donnée de consommation disponible</p>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Onglet Factures -->
          <mat-tab label="FACTURES">
            <div class="tab-content">
              @if (contrat.facture) {
                <div class="facture-list">
                  <div class="facture-row header">
                    <span>Référence</span>
                    <span>Montant</span>
                    <span>Date</span>
                  </div>
                  <div class="facture-row">
                    <span>{{ contrat.facture.reference }}</span>
                    <span class="montant">{{ contrat.facture.montant | number: '1.2-2' }} €</span>
                    <span>{{ contrat.facture.date_facture || '-' }}</span>
                  </div>
                </div>
              } @else {
                <div class="empty-message">
                  <mat-icon>receipt_long</mat-icon>
                  <p>Aucune facture disponible</p>
                </div>
              }
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card-content>

      <mat-card-actions>
        <button mat-button color="primary">MODIFIER</button>
        <button mat-button>TELECHARGER PDF</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .contrat-detail-card {
      width: auto;
      height: auto;
      margin-top: 10px !important;
      margin-bottom: 16px !important;
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
      max-height: 340px;
    }

    .info-row {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-icon {
      color: #3f51b5;
      margin-right: 16px;
    }

    .info-details {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 12px;
      color: #757575;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: 16px;
      color: #212121;
      margin-top: 4px;
    }

    /* Styles pour la consommation */
    .consommation-chart h3 {
      margin: 0 0 16px 0;
      color: #3f51b5;
      font-size: 16px;
    }

    .consommation-data {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .consommation-row {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .consommation-row .periode {
      font-weight: 500;
      color: #333;
    }

    .consommation-row .valeur {
      color: #3f51b5;
      font-weight: 600;
    }

    /* Styles pour les factures */
    .facture-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .facture-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      padding: 12px;
      background-color: #f5f5f5;
      border-radius: 4px;
      gap: 16px;
    }

    .facture-row.header {
      background-color: #3f51b5;
      color: white;
      font-weight: 500;
    }

    .facture-row .montant {
      font-weight: 600;
      color: #2e7d32;
    }

    .empty-message {
      text-align: center;
      padding: 40px;
      color: #9e9e9e;
    }

    .empty-message mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    mat-card-actions {
      padding: 16px;
      display: flex;
      gap: 8px;
    }
  `,
})
export class ContratDetail {
  @Input() contrat!: Contrat;
}
