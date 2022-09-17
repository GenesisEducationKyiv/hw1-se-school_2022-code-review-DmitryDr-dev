import { IExchangeApiService } from '../service';
import { IExchangeApiCreator } from './exchange-api-creator.interface';

export abstract class ExchangeApiCreator implements IExchangeApiCreator {
  public abstract createExchangeApi(): IExchangeApiService;
}
