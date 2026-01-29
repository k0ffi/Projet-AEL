import { Component } from '@angular/core';

@Component({
  selector: 'app-entete',
  imports: [],
  template: `
    <div class="entete">
      <ng-content></ng-content>
    </div>
  `,
  styles: `
    .entete {
      width: 100%;
      height: 43px;
      padding-top: 4px;
      padding-right: 16px;
      padding-bottom: 4px;
      padding-left: 16px;
      background-color: #3f51b5;
      font-family: Roboto;
      font-weight: 400;
      font-size: 20px;
      line-height: 32px;
      text-indent: 20px;
      letter-spacing: 0.25px;
      text-align: center;
      color: white;
    }
  `,
})
export class Entete {}
