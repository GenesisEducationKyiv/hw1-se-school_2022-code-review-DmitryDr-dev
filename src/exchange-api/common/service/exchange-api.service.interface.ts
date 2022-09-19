import { IExchangeApiRequest, IExchangeApiResponse } from '../interfaces';

export interface IExchangeApiService {
  getExchangeRate: (request: IExchangeApiRequest) => Promise<number>;

  getExchangeRateData: (
    request: IExchangeApiRequest,
  ) => Promise<IExchangeApiResponse>;
}
