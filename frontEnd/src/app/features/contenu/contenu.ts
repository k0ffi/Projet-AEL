import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-contenu',
  imports: [RouterOutlet],
  template: ` <router-outlet></router-outlet> `,
  styles: `
    :host {
      display: block;
      width: 100%;
      flex: 1;
      background-color: #cdcdcd;
      overflow-y: auto;
    }

    router-outlet {
      display: none;
    }
  `,
})
export class Contenu {}
