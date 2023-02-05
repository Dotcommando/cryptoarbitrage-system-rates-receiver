import 'reflect-metadata';

import Client from '@immobiliarelabs/dats';

import cluster from 'cluster';
import { Container } from 'typedi';

import { TCPServer } from './constants';
import { AppService } from './services';

Container.set(TCPServer, new Client({
  host: `tcp://${process.env.IP}:${process.env.PORT}`,
  namespace: process.env.NS,
}));

const App = Container.get(AppService);

(async function() {
  await App.run();
})();
