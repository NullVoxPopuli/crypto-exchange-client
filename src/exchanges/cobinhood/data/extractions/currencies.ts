import Decimal from 'decimal.js';

import { Currency } from '~/base';
import { CobinhoodCurrency } from '../messages/currency';
import { transformCurrency } from '../transforms';

export function extractCurrencies(data: CobinhoodCurrency[]): Currency[] {
  return data.map(transformCurrency);
}
