import { TestBed } from '@angular/core/testing';
import { BusinessDayService } from './business-day.service';
import { LocalHolidayProviderService } from './local-holiday-provider.service';

describe('BusinessDayService', () => {
  let service: BusinessDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessDayService, LocalHolidayProviderService]
    });
    service = TestBed.inject(BusinessDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('countBusinessDays', () => {
    it('should count 5 business days in a normal Mon-Fri week', () => {
      // Mon 2026-03-16 to Fri 2026-03-20
      const start = new Date(2026, 2, 16);
      const end = new Date(2026, 2, 20);
      const result = service.countBusinessDays(start, end);
      expect(result.businessDays).toBe(5);
    });

    it('should count 0 business days on a weekend', () => {
      // Sat 2026-03-21 to Sun 2026-03-22
      const start = new Date(2026, 2, 21);
      const end = new Date(2026, 2, 22);
      const result = service.countBusinessDays(start, end);
      expect(result.businessDays).toBe(0);
    });

    it('should exclude national holiday (Tiradentes 21/04)', () => {
      // Mon 2026-04-20 to Wed 2026-04-22
      const start = new Date(2026, 3, 20);
      const end = new Date(2026, 3, 22);
      const result = service.countBusinessDays(start, end);
      // 20 (Mon) + 21 (Tue - Tiradentes) + 22 (Wed) = 2 business days
      expect(result.businessDays).toBe(2);
      expect(result.holidaysInPeriod).toBe(1);
    });

    it('should exclude state holiday when UF is provided', () => {
      // São Paulo: 09/07 is Revolução Constitucionalista de 1932
      // Thu 2026-07-09 is the state holiday
      const start = new Date(2026, 6, 8); // Wed
      const end = new Date(2026, 6, 10);   // Fri
      const result = service.countBusinessDays(start, end, 'SP');
      // 8 (Wed) + 9 (Thu holiday) + 10 (Fri) = 2 business days
      expect(result.businessDays).toBe(2);
      expect(result.holidaysInPeriod).toBe(1);
    });

    it('should exclude municipal holiday when municipality is provided', () => {
      // SP capital: 25/01 is Aniversário de São Paulo
      // 2026-01-26 is Mon, 2026-01-25 is Sun (doesn't count anyway)
      // Let's use 2027 where 25/01 is Monday
      const start = new Date(2027, 0, 25); // Mon
      const end = new Date(2027, 0, 26);   // Tue
      const result = service.countBusinessDays(start, end, 'SP', 'São Paulo');
      // 25 (Mon - municipal holiday) + 26 (Tue) = 1 business day
      expect(result.businessDays).toBe(1);
      expect(result.holidaysInPeriod).toBe(1);
    });

    it('should handle Carnival (moveable holiday) 2026', () => {
      // Carnival 2026: 16 and 17 Feb (Mon and Tue)
      const start = new Date(2026, 1, 16); // Mon
      const end = new Date(2026, 1, 17);   // Tue
      const result = service.countBusinessDays(start, end);
      expect(result.businessDays).toBe(0);
      expect(result.holidaysInPeriod).toBe(2);
    });

    it('should work when start > end (reversed dates)', () => {
      const start = new Date(2026, 2, 20);
      const end = new Date(2026, 2, 16);
      const result = service.countBusinessDays(start, end);
      expect(result.businessDays).toBe(5);
    });
  });

  describe('addBusinessDays', () => {
    it('should add 5 business days starting from Monday (start=day 1)', () => {
      // Mon 2026-03-16 is day 1, so +5 = Fri 2026-03-20
      const start = new Date(2026, 2, 16);
      const result = service.addBusinessDays(start, 5);
      expect(result.resultDate?.getDate()).toBe(20);
      expect(result.resultDate?.getMonth()).toBe(2);
    });

    it('should return start date itself when adding 1 to a business day', () => {
      // Fri 2026-03-20 + 1 → Fri 2026-03-20 (start is day 1)
      const start = new Date(2026, 2, 20);
      const result = service.addBusinessDays(start, 1);
      expect(result.resultDate?.getDate()).toBe(20);
    });

    it('should skip to Monday when starting from Saturday', () => {
      // Sat 2026-03-21 + 1 → Mon 2026-03-23
      const start = new Date(2026, 2, 21);
      const result = service.addBusinessDays(start, 1);
      expect(result.resultDate?.getDate()).toBe(23);
    });

    it('should skip holidays when adding business days', () => {
      // Mon 2026-04-20 + 2 → 20(day1), skip 21(Tiradentes), 22(day2) → Wed 22
      const start = new Date(2026, 3, 20);
      const result = service.addBusinessDays(start, 2, undefined, undefined);
      expect(result.resultDate?.getDate()).toBe(22);
      expect(result.holidaysInPeriod).toBe(1);
    });

    it('should be consistent with countBusinessDays (add 13 from 20/03/2026)', () => {
      // Add 13 business days from 20/03/2026
      const start = new Date(2026, 2, 20);
      const addResult = service.addBusinessDays(start, 13);
      // Then count between 20/03 and the result should equal 13
      const countResult = service.countBusinessDays(start, addResult.resultDate!);
      expect(countResult.businessDays).toBe(13);
    });
  });

  describe('getStates', () => {
    it('should return 27 states', () => {
      const states = service.getStates();
      expect(states.length).toBe(27);
    });
  });

  describe('getMunicipalities', () => {
    it('should return capital for SP', () => {
      const munis = service.getMunicipalities('SP');
      expect(munis.length).toBeGreaterThanOrEqual(1);
      expect(munis.some(m => m.isCapital && m.name === 'São Paulo')).toBeTrue();
    });
  });
});
