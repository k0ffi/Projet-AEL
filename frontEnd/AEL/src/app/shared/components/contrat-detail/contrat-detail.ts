import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

interface InformationContrat {
  reference: string;
  activite: string;
  date_souscription: string;
  adresse: string;
}

interface Consommation {
  periode: string;
  valeur: number;
  unite: string;
}

interface Facture {
  id: string;
  date: string;
  montant: number;
  statut: 'payee' | 'en_attente' | 'en_retard';
}

interface Contrat {
  id: string;
  userId: string;
  information: InformationContrat;
  consommation: Consommation[];
  facture: Facture[];
  date_creation: string;
  date_modification: string;
}

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
        <mat-card-title>{{ contrat.information.activite }}</mat-card-title>
        <mat-card-subtitle>Ref: {{ contrat.information.reference }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <mat-tab-group animationDuration="300ms">
          <!-- Onglet Informations -->
          <mat-tab label="Informations">
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
          <mat-tab label="Consommation">
            <div class="tab-content">
              @if (contrat.consommation && contrat.consommation.length > 0) {
                <table mat-table [dataSource]="contrat.consommation" class="consommation-table">
                  <ng-container matColumnDef="periode">
                    <th mat-header-cell *matHeaderCellDef>Période</th>
                    <td mat-cell *matCellDef="let element">{{ element.periode }}</td>
                  </ng-container>

                  <ng-container matColumnDef="valeur">
                    <th mat-header-cell *matHeaderCellDef>Valeur</th>
                    <td mat-cell *matCellDef="let element">{{ element.valeur }}</td>
                  </ng-container>

                  <ng-container matColumnDef="unite">
                    <th mat-header-cell *matHeaderCellDef>Unité</th>
                    <td mat-cell *matCellDef="let element">{{ element.unite }}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="consommationColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: consommationColumns"></tr>
                </table>
              } @else {
                <div class="empty-message">
                  <mat-icon>bar_chart</mat-icon>
                  <p>Aucune donnée de consommation disponible</p>
                </div>
              }
            </div>
          </mat-tab>

          <!-- Onglet Factures -->
          <mat-tab label="Factures">
            <div class="tab-content">
              @if (contrat.facture && contrat.facture.length > 0) {
                <table mat-table [dataSource]="contrat.facture" class="facture-table">
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let element">{{ element.date }}</td>
                  </ng-container>

                  <ng-container matColumnDef="montant">
                    <th mat-header-cell *matHeaderCellDef>Montant</th>
                    <td mat-cell *matCellDef="let element">
                      {{ element.montant | number: '1.2-2' }} €
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="statut">
                    <th mat-header-cell *matHeaderCellDef>Statut</th>
                    <td mat-cell *matCellDef="let element">
                      <span class="statut-badge" [class]="element.statut">
                        @switch (element.statut) {
                          @case ('payee') {
                            Payée
                          }
                          @case ('en_attente') {
                            En attente
                          }
                          @case ('en_retard') {
                            En retard
                          }
                        }
                      </span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let element">
                      <button mat-icon-button color="primary">
                        <mat-icon>download</mat-icon>
                      </button>
                      <button mat-icon-button>
                        <mat-icon>visibility</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="factureColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: factureColumns"></tr>
                </table>
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
      width: 600px;
      height: 463px;
      position: absolute;
      top: 10px;
      left: 16px;
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

    .consommation-table,
    .facture-table {
      width: 100%;
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

    .statut-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .statut-badge.payee {
      background-color: #e8f5e9;
      color: #2e7d32;
    }

    .statut-badge.en_attente {
      background-color: #fff3e0;
      color: #ef6c00;
    }

    .statut-badge.en_retard {
      background-color: #ffebee;
      color: #c62828;
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

  consommationColumns: string[] = ['periode', 'valeur', 'unite'];
  factureColumns: string[] = ['date', 'montant', 'statut', 'actions'];
}
