/// <reference lib="dom" />
import { Spot } from '@binance/connector';

import { Service } from 'typedi';

import { StockExchanges } from '../constants';

@Service()
export class RatesService {
  private connections = new Map<StockExchanges, any>();

  private initBinanceConnection(): Spot {
    return new Spot(
      process.env.BINANCE_PUBLIC_KEY,
      process.env.BINANCE_SECRET_KEY,
      { timeout: parseInt(process.env.TIMEOUT) },
    );
  }

  public initConnections(): void {
    if (!this.connections.has(StockExchanges.Binance)) {
      this.connections.set(StockExchanges.Binance, this.initBinanceConnection());
    }
  }

  public async getRatesFromBinance(symbols: string[] | string): Promise<unknown> {
    const binanceSpot: Spot = this.connections.get(StockExchanges.Binance);
    const req: { symbol: string} | { symbols: string[] } = Array.isArray(symbols)
      ? { symbols }
      : { symbol: symbols };

    return await binanceSpot.exchangeInfo(req);
  }
}
