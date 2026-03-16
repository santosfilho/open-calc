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
  calculateSimpleInterest(principal: number, rate: number, time: number): SimpleInterestResult {
    const interest = principal * (rate / 100) * time;
    return {
      totalInterest: interest,
      finalAmount: principal + interest
    };
  }

  calculateCompoundInterest(principal: number, monthlyContribution: number, rate: number, timeInMonths: number): CompoundInterestResult {
    const r = rate / 100;
    
    // Future value of initial principal
    const fvPrincipal = principal * Math.pow(1 + r, timeInMonths);
    
    // Future value of a series of monthly contributions
    let fvContributions = 0;
    if (monthlyContribution > 0) {
      fvContributions = monthlyContribution * ((Math.pow(1 + r, timeInMonths) - 1) / r);
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
