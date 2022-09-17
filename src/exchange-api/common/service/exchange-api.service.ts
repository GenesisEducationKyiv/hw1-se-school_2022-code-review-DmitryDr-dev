import { IExchangeApiRequest, IExchangeApiResponse } from '../interfaces';
import { IExchangeApiService } from './exchange-api.service.interface';

export abstract class ExchangeApiService implements IExchangeApiService {
  #nextHandler: IExchangeApiService;

  get nextHandler() {
    return this.#nextHandler;
  }

  public setNext(handler: IExchangeApiService): IExchangeApiService {
    this.#nextHandler = handler;

    return handler;
  }

  public async getExchangeRate(request: IExchangeApiRequest): Promise<number> {
    if (this.#nextHandler) {
      return this.#nextHandler.getExchangeRate(request);
    }
    throw new Error(
      `${this.constructor.name}: Error on fetching exchange rate`,
    );
  }

  public async getExchangeRateData(
    request: IExchangeApiRequest,
  ): Promise<IExchangeApiResponse> {
    if (this.#nextHandler) {
      return this.#nextHandler.getExchangeRateData(request);
    }

    throw new Error(
      `${this.constructor.name}: Error on fetching exchange rate`,
    );
  }

  protected abstract getCurrencyConversion<T>(
    request: IExchangeApiRequest,
  ): Promise<T>;
}
