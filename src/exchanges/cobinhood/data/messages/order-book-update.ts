import { OrderBookEntry } from '~/base/order-book-entry';

const PRICE = 0;
const SIZE = 1;
const COUNT = 2;

export default class OrderBookUpdate implements OrderBookEntry {
    // from OrderBook
    public info: any;
    public channelId: any;
    public symbol: string;
    public highestBid: number;
    public lowestAsk: number;

    // Note that negative numbers
    // mean that the specified amount
    // was removed from the book in some way.
    public sizeAtHighestBid: number;
    public sizeAtLowestAsk: number;

    constructor(json: any) {
        this.info = json;
        this.channelId = json.channel_id;

        const channelParts = this.channelId.split('.');

        this.symbol = channelParts[1];

        const data = json.update || json.snapshot;

        const { bids, asks } = data;

        const highestBid = bids[0];
        const lowestAsk = asks[0];

        if (lowestAsk) {
            this.lowestAsk = lowestAsk[PRICE];
            this.sizeAtLowestAsk = lowestAsk[COUNT];
        }

        if (highestBid) {
            this.highestBid = highestBid[PRICE];
            this.sizeAtHighestBid = highestBid[COUNT];
        }
    }
}
