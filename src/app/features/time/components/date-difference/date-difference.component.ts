import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeCalculatorService, DateDifferenceResult } from '../../services/time-calculator.service';
import { DynamicInputComponent } from '../../../../shared/components/dynamic-input/dynamic-input.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
  selector: 'app-date-difference',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicInputComponent, UiButtonComponent],
  providers: [DatePipe],
  templateUrl: './date-difference.component.html',
  styleUrl: './date-difference.component.scss'
})
export class DateDifferenceComponent {
  form: FormGroup;
  result: DateDifferenceResult | null = null;

  constructor(private fb: FormBuilder, private timeCalcService: TimeCalculatorService) {
    const localNow = new Date();
    const offset = new Date(localNow.getTime() - localNow.getTimezoneOffset() * 60000);
    const today = offset.toISOString().split('T')[0];

    this.form = this.fb.group({
      startDate: [today, Validators.required],
      endDate:   [today, Validators.required]
    });
  }

  private parseLocalDate(value: string): Date {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  calculate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { startDate, endDate } = this.form.value;
    this.result = this.timeCalcService.calculateDifference(
      this.parseLocalDate(startDate),
      this.parseLocalDate(endDate)
    );
  }
}
