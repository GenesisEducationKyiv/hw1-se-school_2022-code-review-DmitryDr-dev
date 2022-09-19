import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ExchangeRatesCreator,
    ExchangeRateHostCreator,
    CurrencyApiCreator,
    ExchangeApiListenerCreator,
  ],
  exports: [ICreatorPoolToken, IExchangeApiServiceToken],
})
export class ExchangeApiModule {}
