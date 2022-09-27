import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiName } from '../common/constants';
import { EventModule } from '../event/event.module';
import { RedisModule } from '../redis/redis.module';
import { ExchangeApiListenerCreator } from './common/listener/creator';
import { CreatorPool } from './creator-pool';
import { CurrencyApiCreator } from './currency-api/creator';
import { ExchangeRateHostCreator } from './exchange-rate-host/creator';
import { ExchangeRatesCreator } from './exchange-rates/creator';
import { ExchangeRatesService } from './exchange-rates/service';

export const IExchangeApiServiceToken = Symbol.for('IExchangeApiService');
export const ICreatorPoolToken = Symbol.for('ICreatorPoolToken');

export const apiCreator = {
  [ApiName.ExchangeRates]: ExchangeRatesCreator,
  [ApiName.ExchangeRateHost]: ExchangeRateHostCreator,
  [ApiName.CurrencyApi]: CurrencyApiCreator,
};

@Module({
  imports: [HttpModule, ConfigModule, RedisModule, EventModule],
  providers: [
    {
      provide: ICreatorPoolToken,
      useClass: CreatorPool,
    },
    {
      provide: IExchangeApiServiceToken,
      useClass: ExchangeRatesService,
    },
    ...Object.values(apiCreator),
    ExchangeApiListenerCreator,
  ],
  exports: [ICreatorPoolToken, IExchangeApiServiceToken],
})
export class ExchangeApiModule {}
