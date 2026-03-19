import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-dynamic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-1 w-full">
      <label *ngIf="label" class="block text-sm font-medium text-slate-700 dark:text-slate-300">{{ label }}</label>
      <div class="relative">
        <span *ngIf="prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
          {{ prefix }}
        </span>
        <input
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onTouched()"
          [disabled]="disabled"
          class="block w-full rounded-md border-0 py-2.5 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-all duration-200 outline-none"
          [ngClass]="{
             'pl-9': prefix,
             'pl-3': !prefix,
             'pr-9': suffix && !suffixOptions,
             'pr-24': suffixOptions,
             'pr-3': !suffix && !suffixOptions,
             'ring-slate-300 dark:ring-slate-600 focus:ring-emerald-500 dark:focus:ring-emerald-400': !hasError,
             'ring-red-300 dark:ring-red-500 focus:ring-red-500 text-red-900 dark:text-red-400': hasError,
             'bg-slate-50 dark:bg-slate-900/50 cursor-not-allowed text-slate-500 dark:text-slate-500': disabled,
             'bg-white dark:bg-slate-800 hover:ring-slate-400 dark:hover:ring-slate-500': !disabled && !hasError
          }">
        <span *ngIf="!suffixOptions && suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400">
          {{ suffix }}
        </span>
        <div *ngIf="suffixOptions && suffixControl" class="absolute inset-y-0 right-0 flex items-center">
          <label class="sr-only">Opção</label>
          <select [formControl]="$any(suffixControl)" class="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-slate-500 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm outline-none dark:text-slate-400 cursor-pointer">
            <option *ngFor="let opt of suffixOptions" [value]="opt.value">{{ opt.label }}</option>
          </select>
        </div>
      </div>
      <p *ngIf="hasError && errorMessage" class="mt-1 text-sm text-red-600 flex items-center">
        <span class="material-icons text-sm mr-1">error_outline</span>{{ errorMessage }}
      </p>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicInputComponent),
      multi: true
    }
  ]
})
export class DynamicInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() suffixOptions?: {label: string, value: string}[];
  @Input() suffixControl?: AbstractControl | null;
  @Input() errorMessage?: string;
  @Input() control?: AbstractControl | null;

  value: any = '';
  disabled = false;
  
  onChange: any = () => {}
  onTouched: any = () => {}

  get hasError(): boolean {
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched));
  }

  writeValue(value: any): void {
    this.value = value !== undefined ? value : '';
  }

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(this.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
