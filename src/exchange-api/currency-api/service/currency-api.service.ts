import { HttpService } from '@nestjs/axios';
import { Inject } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiName, Event } from '../../../common/constants';
import { IEventDispatcher } from '../../../event/event-dispatcher/interface';
import { EventDispatcherToken } from '../../../event/event.module';
import {
  IExchangeApiRequest,
  IExchangeApiResponse,
} from '../../common/interfaces';
import { ExchangeApiService } from '../../common/service';
import { CurrencyApiResponseType } from '../interfaces';

export class CurrencyApiService extends ExchangeApiService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(EventDispatcherToken)
    private readonly eventDispatcher: IEventDispatcher,
  ) {
    super();
  }

  public async getExchangeRate(request: IExchangeApiRequest): Promise<number> {
    try {
      const response: CurrencyApiResponseType =
        await this.getCurrencyConversion(request);
      const targetCurrency = request.targetCurrency.toLowerCase();

      this.eventDispatcher.notify({
        name: Event.ExchangeApiResponse,
        data: {
          source: ApiName.CurrencyApi,
          data: response,
        },
      });

      return response[targetCurrency];
    } catch (error) {
      return super.getExchangeRate(request);
    }
  }

  public async getExchangeRateData(
    request: IExchangeApiRequest,
  ): Promise<IExchangeApiResponse> {
    try {
      const { sourceCurrency, targetCurrency, amount } = request;
      const response: CurrencyApiResponseType =
        await this.getCurrencyConversion(request);
      const normalizedTargetCurrency = request.targetCurrency.toLowerCase();
      const targetAmount = response[normalizedTargetCurrency] * response.amount;

      this.eventDispatcher.notify({
        name: Event.ExchangeApiResponse,
        data: {
          source: ApiName.CurrencyApi,
          data: response,
        },
      });

      return {
        sourceCurrency,
        targetCurrency,
        sourceAmount: amount,
        targetAmount,
      };
    } catch (error) {
      return super.getExchangeRateData(request);
    }
  }

  protected async getCurrencyConversion<CurrencyApiResponseType>(
    request: IExchangeApiRequest,
  ): Promise<CurrencyApiResponseType> {
    const { sourceCurrency, targetCurrency } = request;
    const from = sourceCurrency.toLowerCase();
    const to = targetCurrency.toLowerCase();

    const data = this.httpService
      .get(
        `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from}/${to}.json`,
      )
      .pipe(map((response) => response.data));
    const result = await lastValueFrom(data);

    return result;
  }
}
