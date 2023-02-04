import { Service } from 'typedi';
import { IAppService } from '../models';

@Service()
export class AppService implements IAppService {
  public async run(): Promise<void> {
    console.log();
  }
}
