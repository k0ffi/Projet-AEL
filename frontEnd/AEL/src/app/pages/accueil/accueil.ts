import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { ContratDetail } from '../../shared/components/contrat-detail/contrat-detail';

const API_URL = 'http://localhost:3000';

interface InformationContrat {
  reference: string;
  activite: string;
  date_souscription: string;
  adresse: string;
}

interface contrat {
  id: string;
  userId: string;
  information: InformationContrat;
  consommation: any;
  facture: any;
  date_creation: string;
  date_modification: string;
}

@Component({
  selector: 'app-accueil',
  imports: [
    CommonModule,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ContratDetail,
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-header">
          <h2>Tableau de bord</h2>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/accueil" class="nav-item active">
            <mat-icon matListItemIcon>description</mat-icon>
            <span matListItemTitle>MesContrats</span>
          </a>
          <a mat-list-item routerLink="/dashboard" class="nav-item">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Tableau de bord</span>
          </a>
          <a mat-list-item (click)="logout()" class="nav-item logout">
            <mat-icon matListItemIcon>logout</mat-icon>
            <span matListItemTitle>Déconnexion</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content class="main-content">
        <!-- En-tête avec lien Tableau de bord -->
        <mat-toolbar color="primary" class="header">
          <span>Mes Contrats</span>
          <span class="spacer"></span>
          <a mat-button routerLink="/dashboard" class="header-link">
            <mat-icon>dashboard</mat-icon>
            Tableau de bord
          </a>
        </mat-toolbar>

        <!-- Contenu principal - Liste des contrats -->
        <div class="content">
          @if (selectedContrat) {
            <button mat-button (click)="selectedContrat = null" class="back-button">
              <mat-icon>arrow_back</mat-icon>
              Retour à la liste
            </button>
            <app-contrat-detail [contrat]="selectedContrat"></app-contrat-detail>
          } @else {
            <h1 class="page-title">Bienvenue sur votre espace</h1>
            <p class="page-subtitle">Voici la liste de vos contrats</p>

            @if (loading) {
              <div class="loading">Chargement des contrats...</div>
            }

            @if (error) {
              <div class="error">{{ error }}</div>
            }

            @if (!loading && contrats.length === 0) {
              <mat-card class="empty-card">
                <mat-card-content>
                  <mat-icon class="empty-icon">folder_open</mat-icon>
                  <p>Vous n'avez aucun contrat pour le moment.</p>
                </mat-card-content>
              </mat-card>
            }

            <div class="contrats-grid">
              @for (contrat of contrats; track contrat.id) {
                <mat-card class="contrat-card" (click)="selectContrat(contrat)">
                  <mat-card-header>
                    <mat-card-title>{{ contrat.information.activite }}</mat-card-title>
                    <mat-card-subtitle>Ref: {{ contrat.information.reference }}</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <p><strong>Adresse:</strong> {{ contrat.information.adresse }}</p>
                    <p>
                      <strong>Date de subscription:</strong>
                      {{ contrat.information.date_souscription }}
                    </p>
                    @if (contrat.facture) {
                      <p><strong>Montant:</strong> {{ contrat.facture.montant }} €</p>
                    }
                  </mat-card-content>
                  <mat-card-actions>
                    <button mat-button color="primary">VOIR DÉTAILS</button>
                  </mat-card-actions>
                </mat-card>
              }
            </div>
          }
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .sidenav-container {
      height: 100vh;
      overflow-x: hidden;
    }

    .sidenav {
      width: 250px;
      height: 100%;
      top: 14px;
      background-color: #ffffff;
      color: black;
      border-bottom: 1px solid #cacaca;
      padding: 10px;
      opacity: 1;
      overflow-x: hidden;
    }

    .sidenav-header {
      padding: 20px;
      text-align: center;
      border-bottom: 1px solid #cacaca;
    }

    .sidenav-header h2 {
      margin: 0;
      font-size: 20px;
      color: black;
    }

    .nav-item {
      color: black !important;
      margin: 4px 8px;
      border-radius: 4px;
      gap: 10px;
    }

    .nav-item:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .nav-item.active {
      background-color: #3f51b5;
      color: white !important;
    }

    .nav-item.logout {
      margin-top: 20px;
      color: #ff6b6b !important;
    }

    .main-content {
      background-color: #f5f5f5;
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .header-link {
      color: white;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .content {
      padding: 24px;
      position: relative;
    }

    .back-button {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .page-title {
      margin: 0;
      font-size: 28px;
      color: #333;
    }

    .page-subtitle {
      margin: 8px 0 24px;
      color: #666;
    }

    .loading {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .error {
      text-align: center;
      padding: 20px;
      color: #f44336;
      background-color: #ffebee;
      border-radius: 4px;
      margin-bottom: 20px;
    }

    .empty-card {
      text-align: center;
      padding: 40px;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .contrats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .contrat-card {
      transition:
        transform 0.2s,
        box-shadow 0.2s;
    }

    .contrat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    mat-card-content p {
      margin: 8px 0;
      color: #555;
    }

    mat-card-actions {
      padding: 8px 16px;
    }
  `,
})
export class Accueil implements OnInit {
  contrats: contrat[] = [];
  selectedContrat: contrat | null = null;
  loading = true;
  error = '';
  userId: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit() {
    // Récupérer l'ID utilisateur depuis le localStorage ou le token
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Decoder le token pour récupérer l'ID utilisateur
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userId = payload.id;
        this.loadContrats();
      } catch (e) {
        this.error = 'Erreur lors de la récupération des données utilisateur';
        this.loading = false;
      }
    } else {
      this.error = 'Utilisateur non connecté';
      this.loading = false;
    }
  }

  loadContrats() {
    if (!this.userId) return;

    this.http.get<contrat[]>(`${API_URL}/api/contrats/user/${this.userId}`).subscribe({
      next: (data) => {
        this.contrats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des contrats:', err);
        this.error = 'Impossible de charger les contrats';
        this.loading = false;
      },
    });
  }

  selectContrat(contrat: contrat) {
    this.selectedContrat = contrat;
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['/']);
  }
}
