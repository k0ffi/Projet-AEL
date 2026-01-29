import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-datepicker',
  template: `
    <mat-form-field>
      <mat-label>Date de naissance</mat-label>
      <input
        matInput
        [matDatepicker]="picker"
        (dateChange)="onDateChange($event)"
        [value]="value"
      />
      <mat-hint>JJ/MM/AAAA</mat-hint>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
  providers: [
    provideNativeDateAdapter(),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Datepicker),
      multi: true,
    },
  ],
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Datepicker implements ControlValueAccessor {
  value: Date | null = null;
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDateChange(event: any) {
    this.value = event.value;
    this.onChange(event.value);
    this.onTouched();
  }
}
