import { Component, inject, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutService } from '../../core/services/layout.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entete',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="entete">
      <ng-content></ng-content>
      @if (showLogout) {
        <button mat-icon-button class="logout-btn" (click)="logout()">
          <mat-icon>power_settings_new</mat-icon>
        </button>
      }
    </div>
  `,
  styles: `
    .entete {
      width: 100%;
      height: 43px;
      padding-top: 4px;
      padding-right: 16px;
      padding-bottom: 4px;
      padding-left: 16px;
      background-color: #3f51b5;
      font-family: Roboto;
      font-weight: 400;
      font-size: 20px;
      line-height: 32px;
      text-indent: 20px;
      letter-spacing: 0.25px;
      text-align: center;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logout-btn {
      color: white !important;
    }
  `,
})
export class Entete {
  @Input() showLogout = false;

  private layoutService = inject(LayoutService);
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.layoutService.setLoggedIn(false);
    this.authService.logout();
  }
}
