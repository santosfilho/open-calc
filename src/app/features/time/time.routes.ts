import { Routes } from '@angular/router';
import { DateManipulationComponent } from './components/date-manipulation/date-manipulation.component';
import { DateDifferenceComponent } from './components/date-difference/date-difference.component';

export const TIME_ROUTES: Routes = [
  { path: 'manipulacao', component: DateManipulationComponent },
  { path: 'diferenca', component: DateDifferenceComponent }
];
