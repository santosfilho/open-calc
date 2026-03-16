import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-calculator-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './calculator-card.component.html',
  styleUrl: './calculator-card.component.scss'
})
export class CalculatorCardComponent {
  @Input({ required: true }) categoryPath!: string;
  @Input({ required: true }) calc!: { name: string, route: string, icon: string };
}
