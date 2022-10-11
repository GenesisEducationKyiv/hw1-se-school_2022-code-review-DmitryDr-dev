import { IExchangeApiService } from '../common/service';

export interface ICreatorPool {
  getExchangeApi: () => IExchangeApiService;
}
