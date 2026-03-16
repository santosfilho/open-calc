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
});
