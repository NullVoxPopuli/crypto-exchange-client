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
    if (!this.didOpen) {
      throw new Error(`the socket's didOpen is required. Set with socket.onOpen.`);
    }

    this.didOpen();

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

    if (event) return this.onMessageEvent(json);
    else if (channelId) return this.onMessageChannel(json);

    console.error('unhandled payload: ', payload);
  }

  protected onMessageEvent(json: any): void {
    const { event } = json;

    if (event === 'subscribed' && this.didSubscribe) {
      return this.didSubscribe(json);
    }

    // do nothing, this is a response to our heartbeat
    if (event === 'pong') return;
  }

  protected onMessageChannel(json: any) {
    const { ['channel_id']: channelId } = json;

    if (channelId.includes('ticker')) {
      if (this.didReceiveTicker) {
        this.didReceiveTicker(new TickerUpdate(json));
      } else {
        console.error('didReceiveTicker not set. Set with socket.onReceiveTicker');
      }

      return;
    }

    if (channelId.includes('order-book')) {
      if (this.didReceiveOrderBookUpdate) {
        this.didReceiveOrderBookUpdate(new OrderBookUpdate(json));
      } else {
        console.error('didReceiveOrderBookUpdate not set. Set with socket.onReceiveOrderBookUpdate');
      }

      return;
    }
  }
}
