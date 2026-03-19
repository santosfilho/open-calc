import { TestBed } from '@angular/core/testing';
import { TimeCalculatorService } from './time-calculator.service';

describe('TimeCalculatorService', () => {
  let service: TimeCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateDate', () => {
    it('should add days correctly', () => {
      const start = new Date(2024, 0, 1); // Jan 1, 2024
      const result = service.calculateDate(start, 'add', 5, 'days');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(6);
    });

    it('should subtract days correctly (crossing months)', () => {
      const start = new Date(2024, 2, 2); // Mar 2, 2024
      const result = service.calculateDate(start, 'subtract', 3, 'days');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1); // Feb
      expect(result.getDate()).toBe(28); // 2024 is leap year
    });

    it('should add weeks correctly', () => {
      const start = new Date(2024, 0, 1);
      const result = service.calculateDate(start, 'add', 2, 'weeks');
      expect(result.getDate()).toBe(15);
    });

    it('should add months correctly', () => {
      const start = new Date(2024, 5, 15); // June 15
      const result = service.calculateDate(start, 'add', 2, 'months');
      expect(result.getMonth()).toBe(7); // Aug
      expect(result.getDate()).toBe(15);
    });

    it('should add years correctly', () => {
      const start = new Date(2020, 5, 15);
      const result = service.calculateDate(start, 'add', 10, 'years');
      expect(result.getFullYear()).toBe(2030);
    });
  });

  describe('calculateDifference', () => {
    it('should return 14 days within the same month', () => {
      const res = service.calculateDifference(new Date(2024, 0, 1), new Date(2024, 0, 15));
      expect(res.years).toBe(0);
      expect(res.months).toBe(0);
      expect(res.days).toBe(14);
      expect(res.totalDays).toBe(14);
    });

    it('should return 2 months when crossing months', () => {
      const res = service.calculateDifference(new Date(2024, 0, 15), new Date(2024, 2, 15));
      expect(res.years).toBe(0);
      expect(res.months).toBe(2);
      expect(res.days).toBe(0);
      expect(res.totalDays).toBe(60);
    });

    it('should return 5 years crossing years', () => {
      const res = service.calculateDifference(new Date(2020, 5, 1), new Date(2025, 5, 1));
      expect(res.years).toBe(5);
      expect(res.months).toBe(0);
      expect(res.days).toBe(0);
      expect(res.totalDays).toBe(1826); // 5×365 + 1 leap day (Feb 29 2024)
    });

    it('should handle leap year February correctly', () => {
      // 2024 is a leap year: Feb has 29 days
      const res = service.calculateDifference(new Date(2024, 1, 28), new Date(2024, 2, 1));
      expect(res.totalDays).toBe(2);
    });

    it('should return the same result regardless of date order (absolute)', () => {
      const forward  = service.calculateDifference(new Date(2024, 0, 15), new Date(2024, 2, 15));
      const backward = service.calculateDifference(new Date(2024, 2, 15), new Date(2024, 0, 15));
      expect(forward.years).toBe(backward.years);
      expect(forward.months).toBe(backward.months);
      expect(forward.days).toBe(backward.days);
      expect(forward.totalDays).toBe(backward.totalDays);
    });

    it('should return all zeros for the same date', () => {
      const res = service.calculateDifference(new Date(2024, 5, 15), new Date(2024, 5, 15));
      expect(res.years).toBe(0);
      expect(res.months).toBe(0);
      expect(res.days).toBe(0);
      expect(res.totalDays).toBe(0);
    });
  });
});

