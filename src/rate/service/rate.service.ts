import { Inject, Injectable } from '@nestjs/common';
import { ICreatorPool } from 'src/exchange-api/creator-pool';
import { IExchangeApiService } from '../../exchange-api/common/service';
import { ICreatorPoolToken } from '../../exchange-api/exchange-api.module';
import { IRateService } from './rate.service.interface';

@Injectable()
export class RateService implements IRateService {
  private exchangeApi: IExchangeApiService;

  constructor(
    @Inject(ICreatorPoolToken) private readonly creatorTool: ICreatorPool,
  ) {
    this.exchangeApi = this.creatorTool.getExchangeApi();
  }

  public async getBtcToUah(): Promise<number> {
    try {
      const result = await this.exchangeApi.getExchangeRate({
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
