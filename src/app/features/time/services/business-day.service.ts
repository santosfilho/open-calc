import { Injectable } from '@angular/core';
import { LocalHolidayProviderService } from './local-holiday-provider.service';
import { BusinessDayResult, Municipality, HolidayDetail } from '../models/holiday.model';

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

    const from = start <= end ? start : end;
    const to = start <= end ? end : start;

    const holidayDetailMap = this.buildHolidayDetailMap(from, to, uf, municipality);

    let businessDays = 0;
    let holidaysInPeriod = 0;
    let saturdays = 0;
    let sundays = 0;
    const holidaysList: HolidayDetail[] = [];
    const current = new Date(from);

    const msPerDay = 1000 * 60 * 60 * 24;
    const calendarDays = Math.round((to.getTime() - from.getTime()) / msPerDay) + 1;

    while (current <= to) {
      const dayOfWeek = current.getDay();
      const dateKey = this.dateKey(current);
      const holidayDetail = holidayDetailMap.get(dateKey);

      if (dayOfWeek === 6) saturdays++;
      if (dayOfWeek === 0) sundays++;

      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (holidayDetail && !isWeekend) {
        holidaysInPeriod++;
        holidaysList.push(holidayDetail);
      }

      if (!isWeekend && !holidayDetail) {
        businessDays++;
      }

      current.setDate(current.getDate() + 1);
    }

    return { businessDays, holidaysInPeriod, saturdays, sundays, calendarDays, holidays: holidaysList };
  }

  addBusinessDays(startDate: Date, days: number, uf?: string, municipality?: string): BusinessDayResult {
    const start = new Date(this.normalizeDate(startDate));
    const current = new Date(start);
    let remaining = days;
    let holidaysSkipped = 0;
    let saturdays = 0;
    let sundays = 0;
    const holidaysList: HolidayDetail[] = [];

    let loadedYears = new Set<number>();
    let holidayDetailMap = new Map<string, HolidayDetail>();

    const ensureYear = (year: number) => {
      if (!loadedYears.has(year)) {
        loadedYears.add(year);
        const details = this.holidayProvider.getHolidaysDetailed(year, uf, municipality);
        for (const d of details) {
          holidayDetailMap.set(this.dateKey(d.date), d);
        }
      }
    };

    ensureYear(current.getFullYear());

    // Count start date as day 1 if it's a business day
    const startDow = current.getDay();
    const startIsWeekend = startDow === 0 || startDow === 6;
    const startHoliday = holidayDetailMap.get(this.dateKey(current));
    if (!startIsWeekend && !startHoliday) {
      remaining--;
    }

    while (remaining > 0) {
      current.setDate(current.getDate() + 1);
      ensureYear(current.getFullYear());

      const dayOfWeek = current.getDay();
      const dateKey = this.dateKey(current);
      const holidayDetail = holidayDetailMap.get(dateKey);
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (!isWeekend && !holidayDetail) {
        remaining--;
      }
      if (holidayDetail && !isWeekend) {
        holidaysSkipped++;
        holidaysList.push(holidayDetail);
      }
    }

    // Count weekends in the traversed range [start, current]
    const countFrom = new Date(start);
    while (countFrom <= current) {
      const dow = countFrom.getDay();
      if (dow === 6) saturdays++;
      if (dow === 0) sundays++;
      countFrom.setDate(countFrom.getDate() + 1);
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const calendarDays = Math.round((current.getTime() - start.getTime()) / msPerDay) + 1;

    return {
      businessDays: days,
      holidaysInPeriod: holidaysSkipped,
      saturdays,
      sundays,
      calendarDays,
      holidays: holidaysList,
      resultDate: new Date(current)
    };
  }

  private buildHolidayDetailMap(from: Date, to: Date, uf?: string, municipality?: string): Map<string, HolidayDetail> {
    const map = new Map<string, HolidayDetail>();
    for (let year = from.getFullYear(); year <= to.getFullYear(); year++) {
      const details = this.holidayProvider.getHolidaysDetailed(year, uf, municipality);
      for (const d of details) {
        map.set(this.dateKey(d.date), d);
      }
    }
    return map;
  }

  private normalizeDate(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private dateKey(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}

