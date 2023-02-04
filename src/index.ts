import 'reflect-metadata';

import Client from '@immobiliarelabs/dats';

import { Container } from 'typedi';

import { TCPServer } from './constants';
import { AppService } from './services';

const IP = process.env.IP;
const PORT = process.env.PORT;

Container.set(TCPServer, new Client({
  host: `tcp://${IP}:${PORT}`,
  namespace: process.env.NS,
}));

const App = Container.get(AppService);

(async function() {
  await App.run();
})();
