import 'reflect-metadata';
import { Container } from 'typedi';
import { AppService } from './services';

const App = Container.get(AppService);

(async function(){
  await App.run();
})();
