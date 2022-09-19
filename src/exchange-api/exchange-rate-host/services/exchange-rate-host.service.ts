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
import { IExchangeRateHostResponse } from '../interfaces';

export class ExchangeRateHostService extends ExchangeApiService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(EventDispatcherToken)
    private readonly eventDispatcher: IEventDispatcher,
  ) {
    super();
  }

  public async getExchangeRate(request: IExchangeApiRequest): Promise<number> {
    try {
      const response: IExchangeRateHostResponse =
        await this.getCurrencyConversion(request);

      this.eventDispatcher.notify({
        name: Event.ExchangeApiResponse,
        data: {
          source: ApiName.ExchangeRateHost,
          data: response,
        },
      });

      return response.result;
    } catch (error) {
      return super.getExchangeRate(request);
    }
  }

  public async getExchangeRateData(
    request: IExchangeApiRequest,
  ): Promise<IExchangeApiResponse> {
    try {
      const response: IExchangeRateHostResponse =
        await this.getCurrencyConversion(request);

      this.eventDispatcher.notify({
        name: Event.ExchangeApiResponse,
        data: {
          source: ApiName.ExchangeRateHost,
          data: response,
        },
      });

      return {
        sourceCurrency: response.query.from,
        targetCurrency: response.query.to,
        sourceAmount: response.query.amount,
        targetAmount: response.result,
      };
    } catch (error) {
      return super.getExchangeRateData(request);
    }
  }

  protected async getCurrencyConversion<IExchangeRateHostResponse>(
    request: IExchangeApiRequest,
  ): Promise<IExchangeRateHostResponse> {
    const { sourceCurrency: from, targetCurrency: to, amount } = request;

    const data = this.httpService
      .get(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`,
      )
      .pipe(map((response) => response.data));
    const result = await lastValueFrom(data);

    return result;
  }
}
