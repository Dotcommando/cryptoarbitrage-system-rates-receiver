import Client from '@immobiliarelabs/dats';

import { catchError, concatMap, expand, from, map, of, take, tap } from 'rxjs';

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

  private pairs: string[] = [];

  constructor(
    @Inject(TCPServer) private tcpServer: Client,
    @Inject() private ratesService: RatesService,
  ) {
    this.fetchAllRates = this.fetchAllRates.bind(this);
  }

  private createPairs(): void {
    for (let i = 0; i < this.symbols.length; i++) {
      for (let j = 0; j < this.symbols.length; j++) {
        if (i === j) { continue; }

        this.pairs.push(this.symbols[i] + this.symbols[j]);
      }
    }
  }

  public async run(): Promise<void> {
    this.ratesService.initConnections();
    await this.tcpServer.connect();
    this.createPairs();
    await this.fetchAllRates();
  }

  public async fetchAllRates() {
    const date = new Date();

    console.log(' ');
    console.log(' ');
    console.log('Time:', `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);

    const source = of(0);
    const example = source.pipe(
      expand((i) => from(this.ratesService.getRatesFromBinance(this.pairs[i]))
        .pipe(
          tap((data) => console.log(' ')),
          tap((data) => console.log(`${i}, coin: ${this.pairs[i]}`)),
          tap((data) => console.log(data)),
          map(() => i + 1),
          catchError((e) => of(i)
            .pipe(
              tap(() => console.error(' ')),
              tap(() => console.error(`${i}, coin: ${this.pairs[i]}`)),
              tap(() => console.error(e)),
              map(() => i + 1),
            ),
          ),
        ),
      ),
      take(this.pairs.length),
    )
      .subscribe();

    // const result = await this.ratesService.getRatesFromBinance(this.pairs.slice(0, 10));

    // console.dir(result);
  }
}
