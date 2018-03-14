import * as dotenv from 'dotenv';
import { GDAXRestClient } from '~/index';

dotenv.config({ path: '.env' });

async function begin() {
  const client = new GDAXRestClient();

  const markets = await client.getMarkets();

  console.log(markets);
}

begin();
