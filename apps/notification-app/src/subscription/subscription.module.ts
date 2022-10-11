import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriptionController } from './controller/subscription.controller';
import { Subscriber } from './model';
import { SubscriptionRepository } from './repository';
import { SubscriptionService } from './service/subscription.service';

@Module({
  imports: [SequelizeModule.forFeature([Subscriber])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
  exports: [SubscriptionRepository],
})
export class SubscriptionModule {}
