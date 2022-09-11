import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import {
  IExchangeApiRequest,
  IExchangeApiResponse,
} from '../../common/interfaces';
import { IExchangeRatesResponse } from '../interfaces';
import { IExchangeApiService } from '../../common/service';

@Injectable()
export class ExchangeRatesService implements IExchangeApiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  public async getExchangeRate(request: IExchangeApiRequest): Promise<number> {
    try {
      const response = await this.getCurrencyConversion(request);

      return response.result;
    } catch (error) {
      throw new Error(
        `Error on fetching data from exchangerates.com: ${error.message}`,
      );
    }
  }

  public async getExchangeRateData(
    request: IExchangeApiRequest,
  ): Promise<IExchangeApiResponse> {
    try {
      const response = await this.getCurrencyConversion(request);

      return {
        sourceCurrency: response.query.from,
        targetCurrency: response.query.to,
        sourceAmount: response.query.amount,
        targetAmount: response.info.rate,
      };
    } catch (error) {
      throw new Error(
        `Error on fetching data from exchangerates.com: ${error.message}`,
      );
    }
  }

  private async getCurrencyConversion(
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
