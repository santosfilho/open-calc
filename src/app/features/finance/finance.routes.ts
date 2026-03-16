import { Routes } from '@angular/router';
import { SimpleInterestComponent } from './components/simple-interest/simple-interest.component';
import { CompoundInterestComponent } from './components/compound-interest/compound-interest.component';

export const FINANCE_ROUTES: Routes = [
  { path: 'juros-simples', component: SimpleInterestComponent },
  { path: 'juros-compostos', component: CompoundInterestComponent }
];
