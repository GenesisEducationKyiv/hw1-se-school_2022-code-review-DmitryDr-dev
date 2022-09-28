import { IExchangeApiService } from '../service';

export interface IExchangeApiCreator {
  createExchangeApi: () => IExchangeApiService;
}
