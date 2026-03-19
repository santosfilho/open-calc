import { Injectable } from '@angular/core';

export interface SimpleInterestResult {
  totalInterest: number;
  finalAmount: number;
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalInvested: number;
  totalInterest: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinanceCalculatorService {
  calculateSimpleInterest(principal: number, rate: number, time: number, ratePeriod: 'am' | 'aa' = 'am', timePeriod: 'meses' | 'anos' = 'meses'): SimpleInterestResult {
    let t = time;
    if (ratePeriod === 'am' && timePeriod === 'anos') {
      t = time * 12;
    } else if (ratePeriod === 'aa' && timePeriod === 'meses') {
      t = time / 12;
    }
    
    const interest = principal * (rate / 100) * t;
    return {
      totalInterest: interest,
      finalAmount: principal + interest
    };
  }

  calculateCompoundInterest(principal: number, monthlyContribution: number, rate: number, time: number, ratePeriod: 'am' | 'aa' = 'am', timePeriod: 'meses' | 'anos' = 'meses'): CompoundInterestResult {
    const timeInMonths = timePeriod === 'anos' ? time * 12 : time;
    
    let r = rate / 100;
    if (ratePeriod === 'aa') {
      r = Math.pow(1 + r, 1 / 12) - 1;
    }
    
    const fvPrincipal = principal * Math.pow(1 + r, timeInMonths);
    
    let fvContributions = 0;
    if (monthlyContribution > 0) {
      if (r === 0) {
        fvContributions = monthlyContribution * timeInMonths;
      } else {
        fvContributions = monthlyContribution * ((Math.pow(1 + r, timeInMonths) - 1) / r);
      }
    }
    
    const finalAmount = fvPrincipal + fvContributions;
    const totalInvested = principal + (monthlyContribution * timeInMonths);
    const totalInterest = finalAmount - totalInvested;

    return {
      finalAmount,
      totalInvested,
      totalInterest
    };
  }
}
