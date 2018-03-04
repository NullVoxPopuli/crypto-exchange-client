import Decimal from 'decimal.js';
import fetch from 'node-fetch';

import { AbstractRestClient, AssetBalances, MarketPair, Order, RestClient } from '~/base';
import {
  extractBalances,
  extractMarkets,
  extractOpenOrders, extractOrder,
} from './data/extractions';
import CobinhoodFeed from './websocket-client';

export default class CobinhoodRestClient extends AbstractRestClient implements RestClient {
    public static baseUrl = 'https://api.cobinhood.com/v1/';
    public SOCKET_CLIENT = CobinhoodFeed;

    public marketPairsBySymbol: { [symbol: string]: MarketPair } = {};

    public async createLimitOrder(market: string, amount: string, price: string, isBuySide: boolean): Promise<Order> {
      const payload = {
        ['trading_pair_id']: market,
        // bid: willing to buy the quote at the max price (buys)
        // ask: asking for someone to pay me for my offer (sells)
        ['side']: isBuySide ? 'bid' : 'ask',
        ['type']: 'limit',
        // quote price - quote/base == how many quotes make up a base
        ['price']: price,
        ['size']: amount,
      };

      const response = await this.post('trading/orders', payload);

      return extractOrder(response.result.order);
    }

    public async getMarkets(): Promise<MarketPair[]> {
        const response = await this.get('market/trading_pairs');
        const markets = extractMarkets(response.result.trading_pairs);

        this.populateMarketPairCache(markets);

        return markets;
    }

    public async getBalances(): Promise<AssetBalances> {
        const response = await this.get('wallet/balances');

        return extractBalances(response.result.balances);
    }

    public async getOpenOrders(): Promise<Order[]> {
        const response = await this.get('trading/orders');

        return extractOpenOrders(response.result.orders);
    }

    /***************************************************
     *  Helpers Functions
     **************************************************/

    public async makeRequest(path: string, options: any) {
        const url = `${CobinhoodRestClient.baseUrl}${path}`;

        const key = process.env.COBINHOOD_API_KEY || '';

        this.assertCredentials({ COBINHOOD_API_KEY: key });

        const fetchOptions = {
            headers: {
                ['authorization']: key || '',
            },
            ...options,
        };

        return await fetch(url, fetchOptions).then((response: any) => response.json());
    }

}
