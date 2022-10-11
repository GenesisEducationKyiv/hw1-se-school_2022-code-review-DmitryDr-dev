import { Module } from '@nestjs/common';
import { ExchangeApiModule } from '../exchange-api/exchange-api.module';
import { RateController } from './controller';
import { RateService } from './service';

@Module({
  imports: [ExchangeApiModule],
  providers: [RateService],
  controllers: [RateController],
})
export class RateModule {}
