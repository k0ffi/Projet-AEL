import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { Datepicker } from '../../shared/components/date-piker/date-piker';
import { SuccessSnackbarComponent } from '../../shared/components/success-snackbar/success-snackbar';
import { ErrorSnackbarComponent } from '../../shared/components/error-snackbar/error-snackbar';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatTableModule,
    Datepicker,
    SuccessSnackbarComponent,
    ErrorSnackbarComponent,
  ],
  template: `
    <div class="snackbar-container">
      <app-success-snackbar *ngIf="showSuccess" [data]="successData" (onClose)="closeSuccess()">
      </app-success-snackbar>
      <app-error-snackbar *ngIf="showError" [data]="errorData" (onClose)="closeError()">
      </app-error-snackbar>
    </div>
    <mat-card class="sign-up-card">
      <mat-card-title><span class="title">Création de Compte</span></mat-card-title>

      <mat-stepper [linear]="isLinear" #stepper>
        <mat-step [stepControl]="firstFormGroup" label="Informations personnelles">
          <form [formGroup]="firstFormGroup">
            <div class="field-box">
              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="nom" type="text" />
              </mat-form-field>

              <mat-form-field appearance="outline" class="form-field">
                <mat-label>Prenom</mat-label>
                <input matInput formControlName="prenom" type="text" />
              </mat-form-field>
              <app-datepicker class="form-field" formControlName="dateDeNaissance"></app-datepicker>
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
              <button mat-button color="primary" matStepperPrevious>PRECEDENT</button>
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

        <mat-step label="Done">
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
            <button mat-button color="primary" matStepperPrevious>PRECEDENT</button>
            <button
              mat-button
              class="custom-primary-btn"
              (click)="onSubmit()"
              [disabled]="!firstFormGroup.valid || !secondFormGroup.valid || isLoading"
            >
              {{ isLoading ? 'CRÉATION...' : 'CREER MON COMPTE' }}
            </button>
          </div>
        </mat-step>
      </mat-stepper>
    </mat-card>
  `,
  styles: `
    :host {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 50px 10px;
      position: relative;
    }

    .snackbar-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }

    mat-card-title {
      font-size: 20px;
      padding: 16px;
    }
    .sign-up-card {
      width: 716px;
      height: 443px;
      border-radius: 4px;
    }
    .button {
      padding: 8px;
    }
    .title {
      text-shadow: 4px 4px 4px rgba(0, 0, 0, 0.5);
    }
    .form-field {
      width: 100%;
      padding: 0px;
      gap: 8px;
    }
    mat-form-field {
      marging: 0px;
    }

    .field-box {
      padding-right: 16px;
      padding-left: 16px;
      gap: 0px;
      margin: 0px;
    }

    .mat-stepper-horizontal {
      margin-top: 8px;
    }
    .mat-mdc-form-field {
      margin-top: 16px;
    }

    .custom-primary-btn {
      background-color: #3f51b5 !important;
      color: white !important;
    }

    .recap-container {
      padding: 16px;
    }

    .recap-container h3 {
      margin-bottom: 16px;
      color: #3f51b5;
    }

    .recap-table {
      width: 100%;
      max-width: 400px;
      margin-bottom: 16px;
    }

    .recap-table td,
    .recap-table th {
      padding: 12px;
    }

    .recap-table tr:nth-child(even) {
      background-color: #f5f5f5;
    }
  `,
})
export class SignUp {
  private _formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  displayedColumns: string[] = ['label', 'value'];
  isLoading = false;

  // Snackbar states
  showSuccess = false;
  showError = false;
  successData: any;
  errorData: any;

  firstFormGroup = this._formBuilder.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    dateDeNaissance: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  isLinear = false;

  getRecapData(): any[] {
    const firstForm = this.firstFormGroup.value;
    const secondForm = this.secondFormGroup.value;
    const dateStr = firstForm.dateDeNaissance
      ? new Date(firstForm.dateDeNaissance).toLocaleDateString('fr-FR')
      : '';

    return [
      { label: 'Nom', value: firstForm.nom || '' },
      { label: 'Prénom', value: firstForm.prenom || '' },
      { label: 'Date de naissance', value: dateStr },
      { label: 'Email', value: secondForm.email || '' },
    ];
  }

  closeSuccess() {
    this.showSuccess = false;
  }

  closeError() {
    this.showError = false;
  }

  onSubmit() {
    if (!this.firstFormGroup.valid || !this.secondFormGroup.valid) {
      return;
    }

    this.isLoading = true;

    const userData = {
      nom: this.firstFormGroup.value.nom,
      prenom: this.firstFormGroup.value.prenom,
      date_naissance: this.firstFormGroup.value.dateDeNaissance,
      email: this.secondFormGroup.value.email,
      password: this.secondFormGroup.value.password,
    };

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.showSuccess = true;
        this.successData = { message: 'Compte créé avec succès !' };
        // Auto-hide after 3 seconds
        setTimeout(() => (this.showSuccess = false), 3000);
        // Rediriger vers la page de connexion
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        const errorMessage = error.error?.error || 'Erreur lors de la création du compte';
        this.showError = true;
        this.errorData = { message: errorMessage };
        // Auto-hide after 5 seconds
        setTimeout(() => (this.showError = false), 5000);
      },
    });
  }
}
