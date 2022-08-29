import { Injectable, Logger } from '@nestjs/common';
import { ExchangeApiService } from 'src/exchange-api/exchange-api.service';

@Injectable()
export class RateService {
  private readonly logger = new Logger(RateService.name);

  constructor(private exchangeApiService: ExchangeApiService) {}

  public async getBtcToUah() {
    try {
      const data = await this.exchangeApiService.getCurrencyConversion(
        'BTC',
        'UAH',
      );

      return data ? data?.info?.rate : null;
    } catch (error) {
      this.logger.error('Error occurred while fetching data');
      return null;
    }
  }
}
