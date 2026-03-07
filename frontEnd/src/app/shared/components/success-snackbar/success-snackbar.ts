import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-success-snackbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="snackbar-content success-snackbar">
      <mat-icon class="snackbar-icon">person</mat-icon>
      <span class="snackbar-message">{{ data.message }}</span>
      <button mat-icon-button class="close-btn" (click)="onClose.emit()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .snackbar-content {
        display: flex;
        align-items: center;
        gap: 12px;
        background-color: #4caf50 !important;
        color: white !important;
        padding: 8px 16px;
        border-radius: 4px;
        min-width: 280px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      }

      .snackbar-icon {
        color: white !important;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .snackbar-message {
        font-size: 16px;
        flex: 1;
      }

      .close-btn {
        color: white !important;
        width: 32px;
        height: 32px;
        line-height: 32px;
      }

      .close-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
      }
    `,
  ],
})
export class SuccessSnackbarComponent {
  @Input() data: any;
  @Output() onClose = new EventEmitter<void>();
}
