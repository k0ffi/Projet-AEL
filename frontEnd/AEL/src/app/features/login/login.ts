import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    RouterLink,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-title><span class="title">Bienvenue</span></mat-card-title>

        <mat-card-content>
          <form [formGroup]="form">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Mot de passe</mat-label>
              <input matInput formControlName="password" type="password" />
            </mat-form-field>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <button mat-button class="btn-create" routerLink="/inscription">CRÉE UN COMPTE</button>
          <button mat-raised-button color="primary" class="btn-connect" (click)="connexion()">
            SE CONNECTER
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    .login-container {
      background-color: #cdcdcd;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 50px 10px;
    }
    .form-field {
      width: 100%;
    }

    mat-card {
      width: 402px;
    }

    .title {
      text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
    }

    mat-card-title {
      font-size: 20px;
      padding: 16px;
    }

    mat-card-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-left: 16px;
      padding-right: 16px;
      padding-bottom: 16px;
    }

    mat-card-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      padding: 8px;
    }

    .btn-primary {
      background-color: #3f51b5;
    }
  `,
})
export class Login {
  public form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false),
  });

  connexion() {}
}
