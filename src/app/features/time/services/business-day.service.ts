import { Injectable } from '@angular/core';
import { LocalHolidayProviderService } from './local-holiday-provider.service';
import { BusinessDayResult, Municipality } from '../models/holiday.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessDayService {
  static readonly MIN_DATE = new Date(2025, 0, 1);
  static readonly MAX_DATE = new Date(2030, 11, 31);

  constructor(private holidayProvider: LocalHolidayProviderService) {}

  getStates(): { uf: string; state: string }[] {
    return this.holidayProvider.getStates();
  }

  getMunicipalities(uf: string): Municipality[] {
    return this.holidayProvider.getMunicipalities(uf);
  }

  countBusinessDays(startDate: Date, endDate: Date, uf?: string, municipality?: string): BusinessDayResult {
    const start = this.normalizeDate(startDate);
    const end = this.normalizeDate(endDate);

    // Always work from earlier to later
    const from = start <= end ? start : end;
    const to = start <= end ? end : start;

    // Collect holidays for all years in the range
    const holidaySet = this.buildHolidaySet(from, to, uf, municipality);

    let businessDays = 0;
    let holidaysInPeriod = 0;
    const current = new Date(from);

    // Count from day AFTER start to end (exclusive of start, inclusive of end — banking convention)
    // We'll use inclusive of both start and end for simplicity and count working days
    while (current <= to) {
      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateKey = this.dateKey(current);
      const isHoliday = holidaySet.has(dateKey);

      if (!isWeekend && !isHoliday) {
        businessDays++;
      }
      if (isHoliday && !isWeekend) {
        holidaysInPeriod++;
      }

      current.setDate(current.getDate() + 1);
    }

    return { businessDays, holidaysInPeriod };
  }

  addBusinessDays(startDate: Date, days: number, uf?: string, municipality?: string): BusinessDayResult {
    const current = new Date(this.normalizeDate(startDate));
    let remaining = days;
    let holidaysSkipped = 0;

    // We need holidays potentially spanning multiple years
    // Pre-load the starting year, expand as we go
    let loadedYears = new Set<number>();
    let holidaySet = new Set<string>();

    const ensureYear = (year: number) => {
      if (!loadedYears.has(year)) {
        loadedYears.add(year);
        const holidays = this.holidayProvider.getHolidays(year, uf, municipality);
        for (const h of holidays) {
          holidaySet.add(this.dateKey(h));
        }
      }
    };

    ensureYear(current.getFullYear());

    // Count start date as day 1 if it's a business day (standard convention)
    const startDow = current.getDay();
    const startIsWeekend = startDow === 0 || startDow === 6;
    const startIsHoliday = holidaySet.has(this.dateKey(current));
    if (!startIsWeekend && !startIsHoliday) {
      remaining--;
    }

    while (remaining > 0) {
      current.setDate(current.getDate() + 1);
      ensureYear(current.getFullYear());

      const dayOfWeek = current.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = holidaySet.has(this.dateKey(current));

      if (!isWeekend && !isHoliday) {
        remaining--;
      }
      if (isHoliday && !isWeekend) {
        holidaysSkipped++;
      }
    }

    return {
      businessDays: days,
      holidaysInPeriod: holidaysSkipped,
      resultDate: new Date(current)
    };
  }

  private buildHolidaySet(from: Date, to: Date, uf?: string, municipality?: string): Set<string> {
    const set = new Set<string>();
    for (let year = from.getFullYear(); year <= to.getFullYear(); year++) {
      const holidays = this.holidayProvider.getHolidays(year, uf, municipality);
      for (const h of holidays) {
        set.add(this.dateKey(h));
      }
    }
    return set;
  }

  private normalizeDate(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private dateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
