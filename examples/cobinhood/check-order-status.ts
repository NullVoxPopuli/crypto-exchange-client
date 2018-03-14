import * as dotenv from 'dotenv';
import { CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

async function begin() {
  const client = new CobinhoodRestClient();

  const orders = await client.getOrders();

  // const orderId = '6abbf9a3-3b3f-400c-9152-5c0ae560a8eb';
  const orderId = '7444b1fd-f9a2-4249-949c-d77a2e355d40';
  const order = await client.getOrder(orderId);

  const response = await client.makeRequest(`trading/orders/${orderId}/trades`, { method: 'GET' });

  console.log(orders);
  console.log([order], response.result);
}

begin();
