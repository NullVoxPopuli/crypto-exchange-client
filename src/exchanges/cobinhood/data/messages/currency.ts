export interface CobinhoodCurrency {
  currency: string;
  name: string;
  type: string;
  min_unit: string;
  deposit_fee: string;
  withdrawal_fee: string;
  min_withdrawal: string;
  is_active: boolean;
  funding_frozen: boolean;
}
