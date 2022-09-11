import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExchangeRatesService } from './exchange-rates/service';

export const IExchangeApiServiceToken = Symbol.for('IExchangeApiService');

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: IExchangeApiServiceToken,
      useClass: ExchangeRatesService,
    },
  ],
  exports: [IExchangeApiServiceToken],
})
export class ExchangeApiModule {}
