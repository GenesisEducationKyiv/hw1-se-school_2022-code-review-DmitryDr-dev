import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { IExchangeRatesResponse } from '../interfaces';

@Injectable()
export class ExchangeRatesService extends ExchangeApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(EventDispatcherToken)
    private readonly eventDispatcher: IEventDispatcher,
  ) {
    super();
  }

  public async getExchangeRate(request: IExchangeApiRequest): Promise<number> {
    try {
      const response: IExchangeRatesResponse = await this.getCurrencyConversion(
        request,
      );

      this.eventDispatcher.notify({
        name: Event.ExchangeApiResponse,
        data: {
          source: ApiName.ExchangeRates,
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
      const response: IExchangeRatesResponse = await this.getCurrencyConversion(
        request,
      );

      this.eventDispatcher.notify({
        name: Event.ExchangeApiResponse,
        data: {
          source: ApiName.ExchangeRates,
          data: response,
        },
      });

      return {
        sourceCurrency: response.query.from,
        targetCurrency: response.query.to,
        sourceAmount: response.query.amount,
        targetAmount: response.info.rate,
      };
    } catch (error) {
      return super.getExchangeRateData(request);
    }
  }

  protected async getCurrencyConversion<IExchangeRatesResponse>(
    request: IExchangeApiRequest,
  ): Promise<IExchangeRatesResponse> {
    const { sourceCurrency: from, targetCurrency: to, amount } = request;
    const data = this.httpService
      .get(
        `https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount}`,
        {
          headers: {
            apiKey: `${this.configService.get<string>('EXCHANGE_API_KEY')}`,
          },
        },
      )
      .pipe(map((response) => response.data));
    const result = await lastValueFrom(data);

    return result;
  }
}
