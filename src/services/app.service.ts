import Client from '@immobiliarelabs/dats';

import { Inject, Service } from 'typedi';

import { RatesService } from './rates.service';

import { TCPServer } from '../constants';
import { IAppService } from '../models';

@Service()
export class AppService implements IAppService {
  private symbols: string[] = process.env.SYMBOLS
    ? process.env.SYMBOLS
      .split(' ')
      .filter((symbol: string) => symbol !== '')
    : [];

  constructor(
    @Inject(TCPServer) private tcpServer: Client,
    @Inject() private ratesService: RatesService,
  ) {
    this.fetchAllRates = this.fetchAllRates.bind(this);

    process.on('SIGINT', () => {
      process.exit();
    });
  }

  public async run(): Promise<void> {
    this.ratesService.initConnections();
    await this.tcpServer.connect();
    await this.fetchAllRates();
  }

  public async fetchAllRates() {
    const date = new Date();

    console.log('Time:', `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
    console.dir(this.symbols);

    await this.ratesService.getRatesFromBinance();
  }
}
