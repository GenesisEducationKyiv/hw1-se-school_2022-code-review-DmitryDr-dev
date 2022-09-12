import { Inject, Injectable } from '@nestjs/common';
import { IExchangeApiServiceToken } from '../../exchange-api/exchange-api.module';
import { IExchangeApiService } from '../../exchange-api/common/service';
import { IRateService } from './rate.service.interface';

@Injectable()
export class RateService implements IRateService {
  constructor(
    @Inject(IExchangeApiServiceToken) private exchangeApi: IExchangeApiService,
  ) {}

  public async getBtcToUah(): Promise<number> {
    try {
      const result: number = await this.exchangeApi.getExchangeRate({
        sourceCurrency: 'BTC',
        targetCurrency: 'UAH',
        amount: 1,
      });

      return result;
    } catch (error) {
      throw new Error(`Error on fetching BTC to UAH: ${error.message}`);
    }
  }
}
