import * as WebSocket from 'ws';

import { AbstractWebSocketClient, ExchangeWebSocketFeed } from '~/base';

import OrderBookUpdate from './data/messages/order-book-update';
import TickerUpdate from './data/messages/ticker-update';

const url = 'wss://feed.cobinhood.com/ws';

const PING_PONG_DELAY = 3000;
const { CONNECTING, OPEN, CLOSING, CLOSED } = WebSocket;

export default class CobinhoodFeed extends AbstractWebSocketClient implements ExchangeWebSocketFeed {
   public subscribeTo(type: string, options: object): void {
    this.send({
      action: 'subscribe',
      type,
      ...options,
    });
  }

  public connect() {
    return this.connectTo(url);
  }

  protected handleOnOpen = () => {
    this.didOpen && this.didOpen();

    // need to let the server know we're still here
    this.heartbeat = setInterval(this.ping, PING_PONG_DELAY);
  }

  protected onMessage = (payload: string) => {
    if (payload === undefined) {
      console.log('no payload...');
      return;
    }

    const json: any = JSON.parse(payload);
    const { event, ['channel_id']: channelId } = json;

    if (event) {
      if (event === 'subscribed') {
        this.didSubscribe(json);
      } else if (event === 'pong') {
        // idk
      } else {
        console.log(`
          ------------------------
          some event: `, payload);
      }
    } else if (channelId) {
      if (channelId.includes('ticker')) {
        this.didReceiveTicker(new TickerUpdate(json));
      } else if (channelId.includes('order-book')) {
        this.didReceiveOrderBookUpdate(new OrderBookUpdate(json));
      }
    } else {
      console.log('else? ', payload);
    }
  }
}
