import { Injectable } from '@angular/core';
import { HolidayProviderService } from './holiday-provider.service';
import { HolidaysData, HolidayEntry, Municipality, HolidayDetail } from '../models/holiday.model';
import holidaysJson from '../../../../assets/data/holidays.json';

@Injectable({
  providedIn: 'root'
})
export class LocalHolidayProviderService extends HolidayProviderService {
  private data: HolidaysData = holidaysJson as HolidaysData;

  getStates(): { uf: string; state: string }[] {
    return this.data.states.map(s => ({ uf: s.uf, state: s.state }));
  }

  getMunicipalities(uf: string): Municipality[] {
    const stateData = this.data.states.find(s => s.uf === uf);
    return stateData ? stateData.municipalities : [];
  }

  getHolidays(year: number, uf?: string, municipality?: string): Date[] {
    return this.getHolidaysDetailed(year, uf, municipality).map(h => h.date);
  }

  getHolidaysDetailed(year: number, uf?: string, municipality?: string): HolidayDetail[] {
    const holidays: HolidayDetail[] = [];
    const seen = new Set<string>();

    const addEntry = (entry: HolidayEntry, date: Date) => {
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!seen.has(key)) {
        seen.add(key);
        holidays.push({ date, name: entry.name, scope: entry.scope });
      }
    };

    // National holidays
    for (const entry of this.data.national) {
      const date = this.resolveDate(entry, year);
      if (date) addEntry(entry, date);
    }

    // State holidays
    if (uf) {
      const stateData = this.data.states.find(s => s.uf === uf);
      if (stateData) {
        for (const entry of stateData.holidays) {
          const date = this.resolveDate(entry, year);
          if (date) addEntry(entry, date);
        }

        // Municipal holidays
        if (municipality) {
          const muni = stateData.municipalities.find(m => m.name === municipality);
          if (muni) {
            for (const entry of muni.holidays) {
              const date = this.resolveDate(entry, year);
              if (date) addEntry(entry, date);
            }
          }
        }
      }
    }

    return holidays;
  }

  private resolveDate(entry: HolidayEntry, year: number): Date | null {
    if (entry.type === 'fixed') {
      // Format: "MM-DD"
      const [month, day] = entry.date.split('-').map(Number);
      return new Date(year, month - 1, day);
    } else {
      // Format: "YYYY-MM-DD"
      const [entryYear, month, day] = entry.date.split('-').map(Number);
      if (entryYear === year) {
        return new Date(year, month - 1, day);
      }
      return null;
    }
  }
}
