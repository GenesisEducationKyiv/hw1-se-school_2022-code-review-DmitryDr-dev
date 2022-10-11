import { Module } from '@nestjs/common';
import { CustomerModule } from '../customer/customer.module';
import { NotificationModule } from '../notification/notification.module';
import { OrchestratorController } from './controller';
import { OrchestratorService } from './service';
import { subscribeOrchestratorSteps } from './workflow-step/orchestrator-step';

@Module({
  imports: [NotificationModule, CustomerModule],
  controllers: [OrchestratorController],
  providers: [
    OrchestratorService,
    ...Object.values(subscribeOrchestratorSteps),
  ],
})
export class OrchestratorModule {}
