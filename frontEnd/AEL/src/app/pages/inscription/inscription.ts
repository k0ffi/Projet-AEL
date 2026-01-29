import { Component } from '@angular/core';
import { SignUp } from '../../features/sign-up/sign-up';

@Component({
  selector: 'app-inscription',
  imports: [SignUp],
  template: ` <app-sign-up></app-sign-up> `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class Inscription {}
