import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorCardComponent } from '../shared/components/calculator-card/calculator-card.component';
import { CALCULATORS_CONFIG } from '../shared/calculators.config';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CalculatorCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  calculatorCategories = CALCULATORS_CONFIG;
}
