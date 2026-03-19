import { TestBed } from '@angular/core/testing';
import { FinanceCalculatorService } from './finance-calculator.service';

describe('FinanceCalculatorService', () => {
  let service: FinanceCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinanceCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateSimpleInterest', () => {
    it('should calculate simple interest correctly', () => {
      // Principal = 1000, Rate = 5%, Time = 12
      // Interest = 1000 * 0.05 * 12 = 600
      // Final = 1600
      const res = service.calculateSimpleInterest(1000, 5, 12);
      expect(res.totalInterest).toBe(600);
      expect(res.finalAmount).toBe(1600);
    });

    it('should convert yearly rate and monthly time correctly', () => {
      // Principal = 1000, Rate = 60% aa, Time = 12 meses
      // Interest = 1000 * (60/100) * (12/12) = 600
      const res = service.calculateSimpleInterest(1000, 60, 12, 'aa', 'meses');
      expect(res.totalInterest).toBe(600);
      expect(res.finalAmount).toBe(1600);
    });

    it('should convert monthly rate and yearly time correctly', () => {
      // Principal = 1000, Rate = 5% am, Time = 1 ano
      // Interest = 1000 * (5/100) * (1 * 12) = 600
      const res = service.calculateSimpleInterest(1000, 5, 1, 'am', 'anos');
      expect(res.totalInterest).toBe(600);
      expect(res.finalAmount).toBe(1600);
    });
  });

  describe('calculateCompoundInterest', () => {
    it('should calculate compound interest without monthly contributions', () => {
      // Principal = 1000, Rate = 1% (0.01), Time = 12 months
      // FinalAmount = 1000 * (1.01)^12 =~ 1126.82
      const res = service.calculateCompoundInterest(1000, 0, 1, 12);
      expect(res.totalInvested).toBe(1000);
      expect(res.finalAmount).toBeCloseTo(1126.82, 2);
      expect(res.totalInterest).toBeCloseTo(126.82, 2);
    });

    it('should calculate compound interest with monthly contributions', () => {
      // Principal = 1000, Contribution = 100, Rate = 1% (0.01), Time = 12
      // FV Principal = 1000 * (1.01)^12 =~ 1126.82
      // FV Contributions = 100 * [((1.01)^12 - 1) / 0.01] =~ 100 * 12.6825 = 1268.25
      // Total = 2395.07
      // Total Invested = 1000 + 1200 = 2200
      // Interest = 195.07
      const res = service.calculateCompoundInterest(1000, 100, 1, 12);
      expect(res.totalInvested).toBe(2200);
      expect(res.finalAmount).toBeCloseTo(2395.07, 2);
      expect(res.totalInterest).toBeCloseTo(195.07, 2);
    });

    it('should convert yearly time to months correctly', () => {
      // should match the 12 month calculation
      const res = service.calculateCompoundInterest(1000, 100, 1, 1, 'am', 'anos');
      expect(res.totalInvested).toBe(2200);
      expect(res.finalAmount).toBeCloseTo(2395.07, 2);
      expect(res.totalInterest).toBeCloseTo(195.07, 2);
    });

    it('should convert yearly rate to monthly equivalent correctly', () => {
      // 12.6825% aa is approx 1% am
      const res = service.calculateCompoundInterest(1000, 0, 12.682503, 12, 'aa', 'meses');
      expect(res.totalInvested).toBe(1000);
      expect(res.finalAmount).toBeCloseTo(1126.82, 2);
      expect(res.totalInterest).toBeCloseTo(126.82, 2);
    });
  });
});
