import { IExchangeApiRequest, IExchangeApiResponse } from '../interfaces';

export interface IExchangeApiService {
  nextHandler: IExchangeApiService;

  setNext: (handler: IExchangeApiService) => IExchangeApiService;

  getExchangeRate: (request: IExchangeApiRequest) => Promise<number>;

  getExchangeRateData: (
    request: IExchangeApiRequest,
  ) => Promise<IExchangeApiResponse>;
}
