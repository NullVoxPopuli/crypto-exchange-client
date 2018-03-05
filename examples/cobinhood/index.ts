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

  socket.onReceiveOrderBookUpdate(handleReceivedOrderBookUpdate(client));

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

// do something with order book data
const handleReceivedOrderBookUpdate = (client: AbstractRestClient) => (data: OrderBookUpdateSummary) => {
  const { bids, asks, symbol, isSnapshot } = data;
  const market = client.getMarket(symbol);

  market.updateOrderBook(bids, asks, isSnapshot);

  printOrderBook();
};

// json here is a subscription response, which mostly contains
// the subscription request data
const handleSubscribe = (json: any) => {
  console.log(json);
};

function printOrderBook() {
  const markets = Object.keys(book);

  markets.forEach(m => {
    m.print();
  });
}

begin();
