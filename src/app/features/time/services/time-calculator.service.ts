import { Injectable } from '@angular/core';

export type TimeOperation = 'add' | 'subtract';
export type TimeUnit = 'days' | 'weeks' | 'months' | 'years';

export interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimeCalculatorService {
  calculateDate(startDate: Date, operation: TimeOperation, amount: number, unit: TimeUnit): Date {
    const result = new Date(startDate);
    const multiplier = operation === 'add' ? 1 : -1;
    const value = amount * multiplier;

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

  calculateDifference(dateA: Date, dateB: Date): DateDifferenceResult {
    // Work with date-only values (no time component) to avoid hour-shift bugs
    const d1 = new Date(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
    const d2 = new Date(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());

    // Always work from the earlier date to the later date
    const start = d1 <= d2 ? d1 : d2;
    const end   = d1 <= d2 ? d2 : d1;

    // Total days: integer division of ms difference
    const msPerDay = 1000 * 60 * 60 * 24;
    const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay);

    // Iterative breakdown: years → months → remaining days
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    // Borrow from months if remaining days are negative
    if (days < 0) {
      months--;
      // Days in the month before end
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }

    // Borrow from years if months are negative
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days, totalDays };
  }
}
