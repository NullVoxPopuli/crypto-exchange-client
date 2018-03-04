import { Order, OrderStatus, OrderType } from '~/base';
import Decimal from 'decimal.js';

export function transformOrder(json: any): Order {
    const {
        id,  trading_pair,
        state,
        side, type,
        price, size, filled,
        timestamp,
        eq_price,
    } = json;

    const order = new Order();

    order.id = id;
    order.symbol = trading_pair;

    order.status = cobinhoodStateToOrderStatus[state];
    order.type = cobinhoodTypeToOrderType[type];
    order.timestamp = new Date(timestamp);

    order.price = new Decimal(price);
    order.size = new Decimal(size);
    order.filled = new Decimal(filled);
    order.remaining = order.size.minus(order.filled);

    return order;
}

const cobinhoodStateToOrderStatus: {[key: string]: OrderStatus} = {
    open: OrderStatus.OPEN,
    new: OrderStatus.NEW,
    queued: OrderStatus.QUEUED,
    ['partially_filled']: OrderStatus.PARTIALLY_FILLED,
};

const cobinhoodTypeToOrderType: {[key: string]: OrderType} = {
    market: OrderType.MARKET,
    limit: OrderType.LIMIT,
    stop: OrderType.STOP,
    ['stop_limit']: OrderType.STOP_LIMIT,
    ['trailing_stop']: OrderType.TRAILING_STOP,
    ['fill_or_kill']: OrderType.FILL_OR_KILL,
};
