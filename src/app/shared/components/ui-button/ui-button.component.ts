import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      [ngClass]="[
        'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200',
        variantClasses
      ]">
      <span *ngIf="icon" class="material-icons text-sm mr-2">{{ icon }}</span>
      <ng-content></ng-content>
    </button>
  `
})
export class UiButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() disabled = false;
  @Input() icon?: string;
  @Output() onClick = new EventEmitter<Event>();

  get variantClasses(): string {
    if (this.disabled) {
      return 'bg-slate-300 text-slate-500 cursor-not-allowed';
    }
    switch (this.variant) {
      case 'primary': return 'text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 hover:shadow-md';
      case 'secondary': return 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:ring-emerald-500 border-emerald-200 border';
      case 'danger': return 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 hover:shadow-md';
      case 'ghost': return 'text-slate-600 bg-transparent hover:bg-slate-100 shadow-none border-transparent';
      default: return 'text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 hover:shadow-md';
    }
  }
}
