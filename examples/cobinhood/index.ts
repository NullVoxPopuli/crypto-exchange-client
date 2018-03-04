import Decimal from 'decimal.js';
import * as dotenv from 'dotenv';
import * as _ from 'lodash';
import {
  AbstractRestClient, AbstractWebSocketClient, AssetBalances, MarketPair,
  OrderBookEntry, OrderBookUpdateSummary, Ticker,
} from '~/base';

import { CobinhoodFeed, CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

const book: {
  [symbol: string]: {
    [side: string]: {
      [price: number]: Decimal },
  },
} = {};

Decimal.set({ precision: 8 }); // one more than max on exchange

const zero = new Decimal(0);
const small = new Decimal(0.0000001);

async function begin() {
  const client = new CobinhoodRestClient();
  const socket = new client.SOCKET_CLIENT();

  await client.getMarkets();

  const balances = await client.getBalances();

  await listen(socket, balances, client);
}

async function listen(socket: AbstractWebSocketClient, balances: AssetBalances, client: AbstractRestClient) {
  const markets = _.values(client.marketPairsBySymbol);
  const currencies = Object.keys(balances);

  const marketPairs = marketsFromCurrencies(currencies, markets);

  socket.onOpen(handleOpen(socket, client));

  socket.onReceiveTicker(handleReceivedTicker);
  socket.onReceiveOrderBookUpdate(handleReceivedOrderBookUpdate);

  socket.onSubscribe(handleSubscribe);
  socket.connect();
}

function marketsFromCurrencies(currencies: string[], markets: MarketPair[]): string[] {
  const result: string[] = [];

  currencies.forEach(currency => {
    const relevant = markets.filter(m => {
      return m.pair.includes(currency);
    });

    result.push(...relevant.map(r => r.pair));
  });

  return _.uniq(result);
}

const handleOpen = (socket: AbstractWebSocketClient, client: AbstractRestClient) => () => {
  const marketsBySymbol = client.marketPairsBySymbol;
  const symbols = Object.keys(marketsBySymbol);

  // symbols.forEach(symbol => {
  const symbol = 'ETH-BTC';
  const market = marketsBySymbol[symbol];
  const precision = 7; // market.precision - 1;

  socket.subscribeTo('ticker', { trading_pair_id: symbol });
  socket.subscribeTo('order-book', { trading_pair_id: symbol, precision: `1E-${precision}` });
  // });
};

// do something with ticker data
const handleReceivedTicker = (data: Ticker) => {
  console.log(`
    [Ticker Update] ${data.symbol}: ${data.price}
    `);
};

// do something with order book data
const handleReceivedOrderBookUpdate = (data: OrderBookUpdateSummary) => {
  const { bids, asks, symbol } = data;

  book[symbol] = book[symbol] || { bids: {}, asks: {} };

  asks.forEach((ask: OrderBookEntry) => {
    const { price, count } = ask;
    const oldCount = book[symbol].asks[ask.price];

    book[symbol].asks[ask.price] = (oldCount || zero).plus(new Decimal(count || 0));
  });

  bids.forEach((bid: OrderBookEntry) => {
    const { price, count } = bid;
    const oldCount = book[symbol].bids[bid.price];

    book[symbol].bids[bid.price] = (oldCount || zero).plus(new Decimal(count || 0));
  });

  printOrderBook();

};

// json here is a subscription response, which mostly contains
// the subscription request data
const handleSubscribe = (json: any) => {
  console.log(json);
};

function printOrderBook() {
  const markets = Object.keys(book);

  console.log('\n\n', markets[0]);
  const bids = book[markets[0]].bids;
  const asks = book[markets[0]].asks;

  console.log('asks');
  const outstandingAsks = _.pickBy(asks, (value, _price) => (
    value !== undefined &&
    value !== null &&
    !value.isZero()
  ));

  const outstandingBids = _.pickBy(bids, (value, _price) => (
    value !== undefined &&
    value !== null &&
    value.greaterThan(small)
  ));

  Object.keys(outstandingAsks).sort().slice(0, 10).reverse().forEach(price => {
    console.log(price, outstandingAsks[price].toNumber());
  });

  console.log('bids');
  Object.keys(outstandingBids).sort().reverse().slice(0, 10).forEach(price => {
    console.log(price, outstandingBids[price].toNumber());
  });

}

begin();
