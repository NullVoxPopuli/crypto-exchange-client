import * as dotenv from 'dotenv';

import * as _base from './base';
import * as _exchanges from './exchanges';

// for dealing with multiple exchanges
export const base = _base;
export const exchanges = _exchanges;

// for importing specific exchanges
export { CobinhoodFeed, CobinhoodRestClient } from './exchanges/cobinhood';
export { GDAXFeed, GDAXRestClient } from './exchanges/gdax';

dotenv.config({ path: '.env' });
