import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Inscription } from './pages/inscription/inscription';
import { Dashboard } from './features/dashboard/dashboard';
import { Accueil } from './pages/accueil/accueil';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Connexion },
  { path: 'inscription', component: Inscription },
  {
    path: 'accueil',
    component: Accueil,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
