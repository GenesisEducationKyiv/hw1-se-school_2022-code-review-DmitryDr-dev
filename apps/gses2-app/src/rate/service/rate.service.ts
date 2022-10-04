import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { IExchangeApiService } from '../../exchange-api/common/service';
import { ICreatorPool } from '../../exchange-api/creator-pool';
import { ICreatorPoolToken } from '../../exchange-api/exchange-api.module';
import { IRateService } from './rate.service.interface';

@Injectable()
export class RateService implements OnModuleInit, IRateService {
  private exchangeApi: IExchangeApiService;

  constructor(
    @Inject(ICreatorPoolToken) private readonly creatorTool: ICreatorPool,
  ) {}

  public async onModuleInit(): Promise<void> {
    this.exchangeApi = await this.creatorTool.getExchangeApi();
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
