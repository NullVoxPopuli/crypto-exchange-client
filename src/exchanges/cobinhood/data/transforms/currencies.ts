import Decimal from 'decimal.js';
import { Currency } from '~/base';
import { CobinhoodCurrency } from '../messages';

export function transformCurrency(json: CobinhoodCurrency): Currency {
  const {
    currency,
    name, type, min_unit,
    deposit_fee, withdrawal_fee,
    min_withdrawal, is_active,
    funding_frozen,
  } = json;

  return {
    symbol: currency,
    name,
    type,

    minUnit: new Decimal(min_unit),
    depositFee: new Decimal(deposit_fee),
    withdrawalFee: new Decimal(withdrawal_fee),
    minWithdrawal: new Decimal(min_withdrawal),

    isActive: is_active,
    fundingFrozen: funding_frozen,
  };
}
