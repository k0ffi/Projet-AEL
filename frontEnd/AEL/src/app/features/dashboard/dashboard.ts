import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <mat-card class="dashboard-card">
        <mat-card-title>Dashboard</mat-card-title>
        <mat-card-content>
          <p>Bienvenue sur votre espace personnel !</p>
          <p>Vous êtes maintenant connecté.</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="warn" (click)="logout()">DÉCONNEXION</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    .dashboard-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #cdcdcd;
      padding: 20px;
    }

    .dashboard-card {
      width: 400px;
      padding: 20px;
    }

    mat-card-title {
      margin-bottom: 20px;
      font-size: 24px;
    }

    mat-card-content p {
      margin-bottom: 10px;
      font-size: 16px;
    }

    mat-card-actions {
      margin-top: 20px;
    }
  `,
})
export class Dashboard {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  logout() {
    this.authService.logout();
  }
}
