import { Routes } from '@angular/router';
import { Contenu } from './features/contenu/contenu';

export const routes: Routes = [
  {
    path: '',
    component: Contenu,
    loadChildren: () => import('./AEL.routes').then((m) => m.routes),
  },
];
