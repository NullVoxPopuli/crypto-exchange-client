import * as dotenv from 'dotenv';
import { CobinhoodRestClient } from '~/index';

dotenv.config({ path: '.env' });

async function begin() {
  const client = new CobinhoodRestClient();

  const ticker = await client.getTicker('ETH-BTC');

  console.log(ticker);
}

begin();
