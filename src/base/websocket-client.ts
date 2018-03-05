import * as WebSocket from 'ws';

export interface ExchangeWebSocketFeed {
  didSubscribe: (json: any) => void;
  didOpen: () => void;
  didReceiveTicker: (tickerData: any) => void;
  didReceiveOrderBookUpdate: (orderBookData: any) => void;
  heartbeat: NodeJS.Timer;

  connect: () => void;
}

export interface SubscribeOptions  {
  tradingPair: string;
}

const PING_PONG_DELAY = 3000;
const { CONNECTING, OPEN, CLOSING, CLOSED } = WebSocket;

export default abstract class AbstractWebSocketClient implements ExchangeWebSocketFeed {
  public didSubscribe: (json: any) => void;
  public didOpen: () => void;
  public didReceiveTicker: (tickerData: any) => void;
  public didReceiveOrderBookUpdate: (orderBookData: any) => void;
  public heartbeat: NodeJS.Timer;
  public ws: WebSocket;

  // message handlers.
  protected handleOnOpen: () => void;
  protected onMessage: (payload: string) => void;

  // tslint:disable-next-line:variable-name
  public subscribeTo(_channel: string, _options: any): void {
    throw new Error('Not Implemented');
  }

  public connect(): void {
    throw new Error('Not Implemented');
  }

  public onReceiveTicker(didReceiveTicker: (tickerData: any) => void) {
    this.didReceiveTicker = didReceiveTicker;
  }

  public onReceiveOrderBookUpdate(didReceiveOrderBookUpdate: (orderBookData: any) => void) {
    this.didReceiveOrderBookUpdate = didReceiveOrderBookUpdate;
  }

  public onOpen(didOpen: () => void) {
    this.didOpen = didOpen;
  }

  public onSubscribe(didSubscribe: (json: any) => void) {
    if (this.didSubscribe) {
      this.didSubscribe = didSubscribe;
    }
  }

  public send = (payload: object): void => {
    this.ws.send(JSON.stringify(payload));
  }

  // sets ws, and hooks up event handlers
  protected connectTo(url: string, options: any = {}) {
    this.ws = new WebSocket(url, options);

    const { ws, onClose, onError, handleOnOpen, onMessage } = this;

    ws.on('close', (code: string, reason: string) => onClose(code, reason));
    ws.on('error', (payload: object) => onError(payload));
    ws.on('open', () => handleOnOpen());
    ws.on('message', (payload: string) => onMessage(payload));

    return ws;
  }

  protected onClose = (code: string, reason: string) => {
    const readyState = this.ws.readyState ;
    console.log('[Socket Closed]', code, reason, ' -- readyState: ', readyState, ' -- clearing heartbeat...');
    this.heartbeat && clearInterval(this.heartbeat);

    if (CONNECTING !== readyState && OPEN !== readyState) {
      console.log('Reconnecting...');
      this.connect();
    }
  }

  protected onError = (error: object) => {
    console.log('[Socket Errored]', error);
  }

  protected ping = () => {
    this.send({ action: 'ping' });
  }

}
