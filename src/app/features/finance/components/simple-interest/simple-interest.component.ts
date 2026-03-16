import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinanceCalculatorService, SimpleInterestResult } from '../../services/finance-calculator.service';
import { DynamicInputComponent } from '../../../../shared/components/dynamic-input/dynamic-input.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
  selector: 'app-simple-interest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicInputComponent, UiButtonComponent],
  providers: [CurrencyPipe],
  templateUrl: './simple-interest.component.html',
  styleUrl: './simple-interest.component.scss'
})
export class SimpleInterestComponent {
  form: FormGroup;
  result: SimpleInterestResult | null = null;
  
  constructor(private fb: FormBuilder, private financeService: FinanceCalculatorService) {
    this.form = this.fb.group({
      principal: [1000, [Validators.required, Validators.min(0)]],
      rate: [5, [Validators.required, Validators.min(0)]],
      time: [12, [Validators.required, Validators.min(1)]]
    });
  }

  calculate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { principal, rate, time } = this.form.value;
    this.result = this.financeService.calculateSimpleInterest(principal, rate, time);
  }
}
