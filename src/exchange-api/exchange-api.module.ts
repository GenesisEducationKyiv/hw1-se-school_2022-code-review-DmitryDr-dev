import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExchangeApiService } from './exchange-api.service';

@Module({
  imports: [HttpModule],
  providers: [ExchangeApiService],
  exports: [ExchangeApiService],
})
export class ExchangeApiModule {}
