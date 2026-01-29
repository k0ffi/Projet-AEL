import { Component } from '@angular/core';
import { Login } from '../../features/login/login';

@Component({
  selector: 'app-connexion',
  imports: [Login],
  template: ` <app-login></app-login> `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class Connexion {}
