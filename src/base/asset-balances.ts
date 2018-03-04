import Decimal from 'decimal.js';

export interface AssetBalances {
    [asset: string]: Decimal;
}
