import { AbstractWebSocketClient, ExchangeWebSocketFeed } from '~/base';
import * as WebSocket from 'ws';
import TickerUpdate from './data/messages/ticker-update';

const url = 'wss://ws-feed.gdax.com';

const PING_PONG_DELAY = 3000;
const { CONNECTING, OPEN, CLOSING, CLOSED } = WebSocket;

export default class GDaxFeed extends AbstractWebSocketClient implements ExchangeWebSocketFeed {

  public subscribeTo(_type: string, options: any): void {
    this.send({
      type: 'subscribe',
      channels: [{
        name: 'ticker',
        product_ids: [options.trading_pair_id],
      }],
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

  protected onMessage = (payload: any) => {
    const json: any = JSON.parse(payload);
    const { type } = json;

    if (type === 'ticker') {
      return this.didReceiveTicker(new TickerUpdate(json));
    } else if (type === 'subscribe' || type === 'subscriptions') {
      return this.didSubscribe(json);
    // tslint:disable-next-line:no-empty
    } else if (type === 'heartbeat') {

    // tslint:disable-next-line:no-empty
    } else if (type === 'l2update') {

    } else if (type === 'received') {
      // part of full channel
    } else if (type === 'open') {
      // part of full channel
    } else if  (type === 'done') {
      // part of full channel
    } else if (type === 'match') {
      // part of full channel
    } else if (type === 'change') {
      // part of full channel
    } else if (type === 'activate') {
      // part of full channel
    }

    console.log(payload);
  }
}
