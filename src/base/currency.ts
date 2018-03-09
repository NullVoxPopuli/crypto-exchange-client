import Decimal from 'decimal.js';

export interface Currency {
  symbol: string;
  name: string;
  type: string;

  minUnit: Decimal;
  depositFee: Decimal;
  withdrawalFee: Decimal;
  minWithdrawal: Decimal;

  isActive: boolean;
  fundingFrozen: boolean;
}
