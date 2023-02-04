import Client from '@immobiliarelabs/dats';

import { Inject, Service } from 'typedi';

import { TCPServer } from '../constants';
import { IAppService } from '../models';

@Service()
export class AppService implements IAppService {
  constructor(
    @Inject(TCPServer) private tcpServer: Client,
  ) {
  }

  public async run(): Promise<void> {
    await this.tcpServer.connect();
  }
}
