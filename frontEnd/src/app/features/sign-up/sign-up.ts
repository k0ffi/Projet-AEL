import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Datepicker } from '../../shared/components/date-piker/date-piker';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatTableModule,
    MatSnackBarModule,
    Datepicker,
  ],
  template: `
    <mat-card class="sign-up-card">
      <mat-card-title><span class="title">Création de Compte</span></mat-card-title>
      <mat-stepper [linear]="isLinear" #stepper>
        <!-- Step 1 -->
        <mat-step [stepControl]="firstFormGroup" label="Informations personnelles">
          <form [formGroup]="firstFormGroup">
            <div class="field-box">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="nom" type="text" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Prénom</mat-label>
                <input matInput formControlName="prenom" type="text" />
              </mat-form-field>

              <app-datepicker class="form-field" formControlName="dateDenaissance"></app-datepicker>
            </div>

            <div class="button">
              <button
                mat-button
                class="custom-primary-btn"
                matStepperNext
                [disabled]="!firstFormGroup.valid"
              >
                SUIVANT
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 2 -->
        <mat-step [stepControl]="secondFormGroup" label="Compte internet">
          <form [formGroup]="secondFormGroup">
            <div class="field-box">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Mot de passe</mat-label>
                <input matInput formControlName="password" type="password" />
              </mat-form-field>
            </div>

            <div class="button">
              <button mat-button color="primary" matStepperPrevious>PRÉCÉDENT</button>
              <button
                mat-button
                class="custom-primary-btn"
                matStepperNext
                [disabled]="!secondFormGroup.valid"
              >
                SUIVANT
              </button>
            </div>
          </form>
        </mat-step>

        <!-- Step 3 -->
        <mat-step label="Récapitulatif">
          <div class="recap-container">
            <h3>Vérifiez vos informations</h3>
            <table mat-table [dataSource]="getRecapData()" class="recap-table">
              <ng-container matColumnDef="label">
                <th mat-header-cell *matHeaderCellDef>Champ</th>
                <td mat-cell *matCellDef="let element">{{ element.label }}</td>
              </ng-container>

              <ng-container matColumnDef="value">
                <th mat-header-cell *matHeaderCellDef>Valeur</th>
                <td mat-cell *matCellDef="let element">{{ element.value }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>

          <div class="button">
            <button mat-button color="primary" matStepperPrevious>PRÉCÉDENT</button>
            <button
              mat-button
              class="custom-primary-btn"
              (click)="onSubmit()"
              [disabled]="!firstFormGroup.valid || !secondFormGroup.valid || isLoading"
            >
              {{ isLoading ? 'CRÉATION...' : 'CRÉER MON COMPTE' }}
            </button>
          </div>
        </mat-step>
      </mat-stepper>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        padding: 50px 10px;
        min-height: 100vh;
      }
      .sign-up-card {
        width: 716px;
        height: 443px;
        border-radius: 4px;
      }
      .custom-primary-btn {
        background-color: #3f51b5 !important;
        color: white !important;
      }
      .recap-table {
        width: 100%;
        max-width: 400px;
        margin-top: 16px;
      }
      mat-card-title {
        font-size: 20px;
        padding: 16px;
      }
      .title {
        text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
      }
      .form-field {
        width: 100%;
      }
      .field-box {
        padding: 0 16px;
      }
      .button {
        padding: 8px;
      }
      .recap-container {
        padding: 16px;
      }
      .recap-container h3 {
        margin-bottom: 16px;
        color: #3f51b5;
      }
    `,
  ],
})
export class SignUp {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['label', 'value'];
  isLinear = false;
  isLoading = false;

  firstFormGroup = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    dateDenaissance: ['', Validators.required],
  });

  secondFormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  getRecapData() {
    const first = this.firstFormGroup.value;
    const second = this.secondFormGroup.value;
    const dateStr = first.dateDenaissance
      ? new Date(first.dateDenaissance).toLocaleDateString('fr-FR')
      : '';

    return [
      { label: 'Nom', value: first.nom || '' },
      { label: 'Prénom', value: first.prenom || '' },
      { label: 'Date de naissance', value: dateStr },
      { label: 'Email', value: second.email || '' },
    ];
  }

  onSubmit() {
    if (!this.firstFormGroup.valid || !this.secondFormGroup.valid) return;

    this.isLoading = true;

    const userData = {
      nom: this.firstFormGroup.value.nom,
      prenom: this.firstFormGroup.value.prenom,
      date_naissance: this.firstFormGroup.value.dateDenaissance,
      email: this.secondFormGroup.value.email,
      password: this.secondFormGroup.value.password,
    };

    this.authService.register(userData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        // Avec observe: 'response', les données sont dans response.body
        this.snackBar.open('Compte créé avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log('Erreur inscription:', error);

        // Avec observe: 'response', l'erreur est dans error.error
        let errorMessage = 'Erreur lors de la création du compte';
        if (error.error) {
          if (typeof error.error === 'string') errorMessage = error.error;
          else if (error.error.message) errorMessage = error.error.message;
          else if (error.error.error) errorMessage = error.error.error;
        }

        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
