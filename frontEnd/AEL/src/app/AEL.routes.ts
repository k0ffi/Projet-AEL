import { Routes } from '@angular/router';
import { Connexion } from './pages/connexion/connexion';
import { Inscription } from './pages/inscription/inscription';

export const routes: Routes = [
  { path: '', component: Connexion },
  { path: 'inscription', component: Inscription },
  { path: '**', redirectTo: '' },
];
