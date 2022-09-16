import { Module } from '@nestjs/common';
import { LocalDbModule } from '../database/local-db/local-db.module';
import { ExchangeApiModule } from '../exchange-api/exchange-api.module';
import { MailModule } from '../mail/mail.module';
import { SubscriptionController } from './controller';
import { SubscriptionService } from './service';

@Module({
  imports: [LocalDbModule, MailModule, ExchangeApiModule],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
