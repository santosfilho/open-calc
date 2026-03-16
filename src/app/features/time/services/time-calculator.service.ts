import { Injectable } from '@angular/core';

export type TimeOperation = 'add' | 'subtract';
export type TimeUnit = 'days' | 'weeks' | 'months' | 'years';

@Injectable({
  providedIn: 'root'
})
export class TimeCalculatorService {
  calculateDate(startDate: Date, operation: TimeOperation, amount: number, unit: TimeUnit): Date {
    const result = new Date(startDate);
    const multiplier = operation === 'add' ? 1 : -1;
    const value = amount * multiplier;

    // To prevent timezone offset issues modifying the specific date unpredictably
    // when just doing simple addition, we can just use the standard JS Date methods 
    // which adjust boundaries automatically.
    switch (unit) {
      case 'days':
        result.setDate(result.getDate() + value);
        break;
      case 'weeks':
        result.setDate(result.getDate() + (value * 7));
        break;
      case 'months':
        result.setMonth(result.getMonth() + value);
        break;
      case 'years':
        result.setFullYear(result.getFullYear() + value);
        break;
    }
    return result;
  }
}
