import { IExchangeApiService } from '../common/service';

export interface ICreatorPool {
  primaryApi: IExchangeApiService;

  getExchangeApi(): IExchangeApiService;
}
