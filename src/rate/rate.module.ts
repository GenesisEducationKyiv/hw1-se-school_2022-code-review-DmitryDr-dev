import { Module } from '@nestjs/common';
import { ExchangeApiModule } from 'src/exchange-api/exchange-api.module';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';

@Module({
  imports: [ExchangeApiModule],
  providers: [RateService],
  controllers: [RateController],
})
export class RateModule {}
