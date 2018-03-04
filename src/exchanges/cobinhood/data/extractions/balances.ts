import Decimal from 'decimal.js';

import { AssetBalances } from '~/base';

export function extractBalances(data: any[]): AssetBalances {
    const balances: AssetBalances = {};

    data.forEach((balance: any) => {
        balances[balance.currency] = new Decimal(balance.total);
    });

    return balances;
}
