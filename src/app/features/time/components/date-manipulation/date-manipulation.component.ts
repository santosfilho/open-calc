import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TimeCalculatorService, TimeOperation, TimeUnit } from '../../services/time-calculator.service';
import { DynamicInputComponent } from '../../../../shared/components/dynamic-input/dynamic-input.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
  selector: 'app-date-manipulation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicInputComponent, UiButtonComponent],
  providers: [DatePipe],
  templateUrl: './date-manipulation.component.html',
  styleUrl: './date-manipulation.component.scss'
})
export class DateManipulationComponent {
  form: FormGroup;
  resultDate: Date | null = null;
  
  operations: { value: TimeOperation, label: string }[] = [
    { value: 'add', label: 'Somar (+)' },
    { value: 'subtract', label: 'Subtrair (-)' }
  ];
  
  units: { value: TimeUnit, label: string }[] = [
    { value: 'days', label: 'Dias' },
    { value: 'weeks', label: 'Semanas' },
    { value: 'months', label: 'Meses' },
    { value: 'years', label: 'Anos' }
  ];

  constructor(
    private fb: FormBuilder,
    private timeCalcService: TimeCalculatorService
  ) {
    // Current date
    const localNow = new Date();
    const offsetDate = new Date(localNow.getTime() - (localNow.getTimezoneOffset() * 60000));
    const today = offsetDate.toISOString().split('T')[0];

    this.form = this.fb.group({
      startDate: [today, Validators.required],
      operation: ['add' as TimeOperation, Validators.required],
      amount: [1, [Validators.required, Validators.min(1)]],
      unit: ['days' as TimeUnit, Validators.required]
    });
  }

  calculate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const { startDate, operation, amount, unit } = this.form.value;
    
    // Parse to local date without time shift issues
    const dateParts = startDate.split('-');
    const dateInput = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));

    this.resultDate = this.timeCalcService.calculateDate(dateInput, operation, amount, unit);
  }
}
