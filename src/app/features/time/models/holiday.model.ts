export interface HolidayEntry {
  date: string;       // "MM-DD" for fixed, "YYYY-MM-DD" for yearly
  name: string;
  type: 'fixed' | 'yearly';
  scope: 'national' | 'state' | 'municipal';
}

export interface Municipality {
  name: string;
  isCapital: boolean;
  holidays: HolidayEntry[];
}

export interface StateHolidays {
  uf: string;
  state: string;
  holidays: HolidayEntry[];
  municipalities: Municipality[];
}

export interface HolidaysData {
  national: HolidayEntry[];
  states: StateHolidays[];
}

export interface HolidayDetail {
  date: Date;
  name: string;
  scope: 'national' | 'state' | 'municipal';
}

export interface BusinessDayResult {
  businessDays: number;
  holidaysInPeriod: number;
  saturdays: number;
  sundays: number;
  calendarDays: number;
  holidays: HolidayDetail[];
  resultDate?: Date;
}
