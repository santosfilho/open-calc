import { Injectable } from '@angular/core';
import { HolidaysData, Municipality } from '../models/holiday.model';

@Injectable({
  providedIn: 'root'
})
export abstract class HolidayProviderService {
  abstract getHolidays(year: number, uf?: string, municipality?: string): Date[];
  abstract getStates(): { uf: string, state: string }[];
  abstract getMunicipalities(uf: string): Municipality[];
}
