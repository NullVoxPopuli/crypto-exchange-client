import * as _ from 'lodash';
import { AbstractRestClient, AbstractWebSocketClient, AssetBalances, MarketPair, OrderBookEntry, Ticker } from '~/base';
import { CobinhoodFeed, CobinhoodRestClient } from '~/index';

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

  symbols.forEach(symbol => {
    const market = marketsBySymbol[symbol];
    const precision = market.precision;

    socket.subscribeTo('ticker', { trading_pair_id: symbol });
    socket.subscribeTo('order-book', { trading_pair_id: symbol, precision: `1E-${precision - 1}` });
  });
};

// do something with ticker data
const handleReceivedTicker = (data: Ticker) => {
  console.log(`
    [Ticker Update] ${data.symbol}: ${data.price}
    `);
};

// do something with order book data
const handleReceivedOrderBookUpdate = (data: OrderBookEntry) => {
  console.log(`
    [Order Book Update] ${data.symbol}:
      highest bid: ${data.sizeAtHighestBid} @ ${data.highestBid}
      lowest ask:  ${data.sizeAtLowestAsk} @ ${data.lowestAsk}
      `);
};

// json here is a subscription response, which mostly contains
// the subscription request data
const handleSubscribe = (json: any) => {
  console.log(json);
};

begin();
