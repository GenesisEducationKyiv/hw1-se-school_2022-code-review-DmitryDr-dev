import { Module } from '@nestjs/common';
import { LocalDbModule } from 'src/database/local-db/local-db.module';
import { ExchangeApiModule } from 'src/exchange-api/exchange-api.module';
import { MailModule } from 'src/mail/mail.module';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [LocalDbModule, MailModule, ExchangeApiModule],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
