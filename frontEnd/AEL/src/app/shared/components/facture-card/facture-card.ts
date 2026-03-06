import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Facture } from '../../models/contrat.model';

@Component({
  selector: 'app-facture-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <table class="facture-table">
      <thead>
        <tr>
          <th class="col-header">Référence</th>
          <th class="col-header">Montant</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="value">{{ facture?.reference || 'N/A' }}</td>
          <td class="value">{{ facture?.montant | number: '1.2-2' }} $</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: `
    .facture-table {
      width: 100%;
      border-collapse: collapse;
    }

    .facture-table thead tr {
      background-color: #f0f0f0;
    }

    .facture-table th {
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #1976d2;
    }

    .facture-table th:last-child {
      text-align: right;
    }

    .facture-table td {
      padding: 12px 8px;
      border-bottom: 1px solid #eee;
    }

    .facture-table td:first-child {
      text-align: left;
    }

    .facture-table td:last-child {
      text-align: right;
    }

    .facture-table .value {
      font-weight: bold;
      color: #333;
    }
  `,
})
export class FactureCard {
  @Input() facture: Facture | null = null;
}
