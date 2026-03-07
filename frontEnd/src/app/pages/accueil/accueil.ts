import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ContratDetail } from '../../shared/components/contrat-detail/contrat-detail';
import { LayoutService } from '../../core/services/layout.service';
import { Dashboard } from '../../features/dashboard/dashboard';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, MatButtonModule, MatIconModule, ContratDetail, Dashboard],
  template: `
    <div class="accueil-container">
      @if (layoutService.selectedContract(); as contrat) {
        <!-- Vue Détail contrat quand un contrat est sélectionné -->
        <div class="detail-view">
          <app-contrat-detail [contrat]="contrat"></app-contrat-detail>
        </div>
      } @else {
        <!-- Vue Dashboard par défaut -->
        <app-dashboard></app-dashboard>
      }
    </div>
  `,
  styles: `
    .accueil-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .detail-view {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px;
    }

    .back-button {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      align-self: flex-start;
    }
  `,
})
export class Accueil implements OnInit {
  layoutService = inject(LayoutService);

  private router = inject(Router);

  ngOnInit() {}

  clearSelection() {
    this.layoutService.selectContract(null);
    this.router.navigate(['/dashboard']);
  }
}
