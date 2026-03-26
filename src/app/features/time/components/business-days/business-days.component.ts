import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BusinessDayService } from '../../services/business-day.service';
import { BusinessDayResult, Municipality } from '../../models/holiday.model';
import { DynamicInputComponent } from '../../../../shared/components/dynamic-input/dynamic-input.component';
import { UiButtonComponent } from '../../../../shared/components/ui-button/ui-button.component';

@Component({
  selector: 'app-business-days',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicInputComponent, UiButtonComponent],
  templateUrl: './business-days.component.html',
  styleUrl: './business-days.component.scss'
})
export class BusinessDaysComponent implements OnInit {
  form: FormGroup;
  result: BusinessDayResult | null = null;

  modes = [
    { value: 'count', label: 'Dias úteis entre datas' },
    { value: 'add', label: 'Adicionar dias úteis' }
  ];

  activeMode: 'count' | 'add' = 'count';

  states: { uf: string; state: string }[] = [];
  municipalities: Municipality[] = [];

  readonly minDate = '2025-01-01';
  readonly maxDate = '2030-12-31';

  constructor(
    private fb: FormBuilder,
    private businessDayService: BusinessDayService
  ) {
    const localNow = new Date();
    const offset = new Date(localNow.getTime() - localNow.getTimezoneOffset() * 60000);
    const today = offset.toISOString().split('T')[0];

    this.form = this.fb.group({
      startDate: [today, Validators.required],
      endDate: [today, Validators.required],
      daysToAdd: [1, [Validators.required, Validators.min(1)]],
      uf: [''],
      municipality: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.states = this.businessDayService.getStates();

    this.form.get('uf')?.valueChanges.subscribe(uf => {
      const muniControl = this.form.get('municipality');
      if (uf) {
        this.municipalities = this.businessDayService.getMunicipalities(uf);
        muniControl?.enable();
        // Auto-select capital
        const capital = this.municipalities.find(m => m.isCapital);
        muniControl?.setValue(capital ? capital.name : '');
      } else {
        this.municipalities = [];
        muniControl?.setValue('');
        muniControl?.disable();
      }
    });
  }

  setMode(mode: 'count' | 'add'): void {
    this.activeMode = mode;
    this.result = null;
  }

  calculate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const uf = this.form.get('uf')?.value || undefined;
    const municipality = this.form.get('municipality')?.value || undefined;

    if (this.activeMode === 'count') {
      const startStr = this.form.get('startDate')?.value;
      const endStr = this.form.get('endDate')?.value;
      const start = this.parseLocalDate(startStr);
      const end = this.parseLocalDate(endStr);
      this.result = this.businessDayService.countBusinessDays(start, end, uf, municipality);
    } else {
      const startStr = this.form.get('startDate')?.value;
      const days = Number(this.form.get('daysToAdd')?.value) || 1;
      const start = this.parseLocalDate(startStr);
      this.result = this.businessDayService.addBusinessDays(start, days, uf, municipality);
    }
  }

  private parseLocalDate(value: string): Date {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
}
