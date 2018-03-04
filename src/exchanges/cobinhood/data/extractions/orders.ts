import { Order } from '~/base';
import { transformOrder } from '../transforms';

export function extractOrders(data: any[]): Order[] {
    return data.map(transformOrder);
}

export function extractOpenOrders(data: any[]): Order[] {
    const openOrders = data.filter(orderData => orderData.state === 'open');

    return extractOrders(openOrders);
}

export function extractOrder(data: any): Order {
  return transformOrder(data);
}
