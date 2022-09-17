import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreatorPool } from './creator-pool';
import { CurrencyApiCreator } from './currency-api/creator';
import { ExchangeRateHostCreator } from './exchange-rate-host/creator';
import { ExchangeRatesCreator } from './exchange-rates/creator';
import { ExchangeRatesService } from './exchange-rates/service';

export const IExchangeApiServiceToken = Symbol.for('IExchangeApiService');
export const ICreatorPoolToken = Symbol.for('ICreatorPoolToken');

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: ICreatorPoolToken,
      useClass: CreatorPool,
    },
    {
      provide: IExchangeApiServiceToken,
      useClass: ExchangeRatesService,
    },
    ExchangeRatesCreator,
    ExchangeRateHostCreator,
    CurrencyApiCreator,
  ],
  exports: [ICreatorPoolToken, IExchangeApiServiceToken],
})
export class ExchangeApiModule {}
