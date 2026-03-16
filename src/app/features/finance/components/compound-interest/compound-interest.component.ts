import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinanceCalculatorService, CompoundInterestResult } from '../../services/finance-calculator.service';
import { DynamicInputComponent } from '../../../../shared/components/dynamic-input/dynamic-input.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
  selector: 'app-compound-interest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicInputComponent, UiButtonComponent],
  providers: [CurrencyPipe],
  templateUrl: './compound-interest.component.html',
  styleUrl: './compound-interest.component.scss'
})
export class CompoundInterestComponent {
  form: FormGroup;
  result: CompoundInterestResult | null = null;
  
  constructor(private fb: FormBuilder, private financeService: FinanceCalculatorService) {
    this.form = this.fb.group({
      principal: [1000, [Validators.required, Validators.min(0)]],
      monthlyContribution: [100, [Validators.min(0)]],
      rate: [1, [Validators.required, Validators.min(0)]],
      timeInMonths: [12, [Validators.required, Validators.min(1)]]
    });
  }

  calculate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { principal, monthlyContribution, rate, timeInMonths } = this.form.value;
    const contribution = monthlyContribution || 0;
    this.result = this.financeService.calculateCompoundInterest(principal, contribution, rate, timeInMonths);
  }
}
