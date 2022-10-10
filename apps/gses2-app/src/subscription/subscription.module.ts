import { Module } from '@nestjs/common';

import { LocalDbModule } from '../database/local-db/local-db.module';
import { ExchangeApiModule } from '../exchange-api/exchange-api.module';
import { MailModule } from '../mail/mail.module';
import { OrchestratorModule } from '../orchestrator/orchestrator.module';
import { SubscriptionController } from './controller';
import { SubscriptionRepository } from './repository';
import { SubscriptionService } from './service';

@Module({
  imports: [LocalDbModule, MailModule, ExchangeApiModule, OrchestratorModule],
  providers: [SubscriptionService, SubscriptionRepository],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
