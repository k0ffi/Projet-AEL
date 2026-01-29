import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Entete } from './features/entete/entete';
import { Contenu } from './features/contenu/contenu';

@Component({
  selector: 'app-root',
  imports: [Entete, Contenu],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('AEL');
}
