import { AssetBalances } from './asset-balances';

import * as _ from 'lodash';
import { MarketPair } from './market-pair';
import { Order } from './order';

import AbstractWebSocketClient, { ExchangeWebSocketFeed } from './websocket-client';

export interface RestClient {
    SocketClient: new() => AbstractWebSocketClient;

    marketPairsBySymbol: { [symbol: string]: MarketPair };

    getBalances(): Promise<AssetBalances>;
    getMarkets(): Promise<MarketPair[]>;
    getOpenOrders(): Promise<Order[]>;

    marketForSymbol(symbol: string): MarketPair;

    createLimitBuyOrder(market: string, amount: string, price: string): Promise<Order>;
    createLimitSellOrder(market: string, amount: string, price: string): Promise<Order>;
    createLimitOrder(market: string, amount: string, price: string, isBuySide: boolean): Promise<Order>;

    createMarketBuyOrder(market: string, amount: string): Promise<Order>;
    createMarketSellOrder(market: string, amount: string): Promise<Order>;
    createMarketOrder(market: string, amount: string, isBuySide: boolean): Promise<Order>;

    createOrder(market: string, amount: string, price: string, type: string, isBuySide: boolean): Promise<Order>;

    makeRequest(path: string, options: any): Promise<any>;
}

export class AbstractRestClient implements RestClient {
    public SocketClient: new() => AbstractWebSocketClient;

    public marketPairsBySymbol: { [symbol: string]: MarketPair } = {};

    public getBalances(): Promise<AssetBalances> {
        throw new Error('Not Implemented');
    }

    public getMarkets(): Promise<MarketPair[]> {
        throw new Error('Not Implemented');
    }

    public getOpenOrders(): Promise<Order[]> {
        throw new Error('Not Implemented');
    }

    public marketForSymbol(symbol: string): MarketPair {
      return this.marketPairsBySymbol[symbol];
    }

    public createLimitBuyOrder(market: string, amount: string, price: string): Promise<Order> {
      return this.createLimitOrder(market, amount, price, true);
    }
    public createLimitSellOrder(market: string, amount: string, price: string): Promise<Order> {
      return this.createLimitOrder(market, amount, price, false);
    }
    public createLimitOrder(market: string, amount: string, price: string, isBuySide: boolean): Promise<Order> {
      return this.createOrder(market, amount, price, 'limit', isBuySide);
    }

    public createMarketBuyOrder(market: string, amount: string): Promise<Order> {
      return this.createMarketOrder(market, amount, true);
    }
    public createMarketSellOrder(market: string, amount: string): Promise<Order> {
      return this.createMarketOrder(market, amount, false);
    }
    public createMarketOrder(market: string, amount: string, isBuySide: boolean): Promise<Order> {
      return this.createOrder(market, amount, null, 'market', isBuySide);
    }

    public makeRequest(_path: string, _options: any): Promise<any> {
        throw new Error('Not Implemented');
    }

    public createOrder(
      _market: string, _amount: string,
      _price: string | null, _type: string, _isBuySide: boolean): Promise<Order> {
      throw new Error('Not Implemented');
    }

    protected populateMarketPairCache(markets: MarketPair[]): void {
        markets.forEach((marketPair: MarketPair) => {
            this.marketPairsBySymbol[marketPair.pair] = marketPair;
        });
    }

    protected async get(path: string): Promise<any> {
        return await this.makeRequest(path, { method: 'GET' });
    }

    protected async destroy(path: string): Promise<any> {
        return await this.makeRequest(path, { method: 'DELETE' });
    }

    protected async post(path: string, params: any): Promise<any> {
      return await this.makeRequest(path, {
        method: 'POST',
        body: JSON.stringify(params),
      });
    }

    protected assertCredentials(credentials: any): void {
        const messages = Object.keys(credentials).map((name: string) => {
            const value: string = credentials[name];

            if (!value || value === '') {
                return `Missing ENV variable: ${name}`;
            }

            return;
        });

        const msgs = _.compact(messages).join();

        if (msgs.length > 0) {
            console.error(msgs);

            process.exit(1);
        }
    }
}
