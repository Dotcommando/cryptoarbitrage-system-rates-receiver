/// <reference lib="dom" />
import { Spot } from '@binance/connector';

import { Service } from 'typedi';

import { StockExchanges } from '../constants';

@Service()
export class RatesService {
  private connections = new Map<StockExchanges, any>();

  private initBinanceConnection(): Spot {
    return new Spot(process.env.BINANCE_PUBLIC_KEY, process.env.BINANCE_SECRET_KEY);
  }

  public initConnections(): void {
    if (!this.connections.has(StockExchanges.Binance)) {
      this.connections.set(StockExchanges.Binance, this.initBinanceConnection());
    }
  }

  public async getRatesFromBinance() {
    const binanceSpot: Spot = this.connections.get(StockExchanges.Binance);

    return await binanceSpot
      .exchangeInfo({ symbol: 'BNBBTC' })
      .then(res => console.dir(res.data));
  }
}
