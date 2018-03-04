import Decimal from 'decimal.js';

import { AssetBalances } from '~/base';

export function extractBalances(data: any[]): AssetBalances {
    const balances: AssetBalances = {};
    console.log(data);
    data.forEach((balance: any) => {
        balances[balance.id] = new Decimal(balance.balance);
    });

    return balances;
}
