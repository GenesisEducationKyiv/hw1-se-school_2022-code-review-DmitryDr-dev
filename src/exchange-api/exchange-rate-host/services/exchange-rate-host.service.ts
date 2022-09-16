import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  IExchangeApiRequest,
  IExchangeApiResponse,
} from '../../common/interfaces';
import { IExchangeApiService } from '../../common/service';
import { IExchangeRateHostResponse } from '../interfaces';

export class ExchangeRateHostService implements IExchangeApiService {
  constructor(private readonly httpService: HttpService) {}

  public async getExchangeRate(request: IExchangeApiRequest): Promise<number> {
    try {
      const response = await this.getCurrencyConversion(request);

      return response.result;
    } catch (error) {
      throw new Error(
        `Error on fetching data from exchangerate.host: ${error.message}`,
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
        targetAmount: response.result,
      };
    } catch (error) {
      throw new Error(
        `Error on fetching data from exchangerate.host: ${error.message}`,
      );
    }
  }

  private async getCurrencyConversion(
    request: IExchangeApiRequest,
  ): Promise<IExchangeRateHostResponse> {
    const { sourceCurrency: from, targetCurrency: to, amount } = request;

    const data = this.httpService
      .get(
        `https://api.exchangerate.host/convert?from=${from}&${to}=UAH&amount=${amount}`,
      )
      .pipe(map((response) => response.data));
    const result = await lastValueFrom(data);

    return result;
  }
}
