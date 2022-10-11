import { Controller } from '@nestjs/common';
import { EventPattern, RpcException } from '@nestjs/microservices';
import {
  CreateSubscriberRequestDto,
  CreateSubscriberResponseDto,
  UpdateSubscriberStatusRequestDto,
  UpdateSubscriberStatusResponseDto,
} from '../dto';
import { SubscriberStatus } from '../model';
import { SubscriptionService } from '../service';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @EventPattern('create-subscriber')
  public async createSubscriber(
    dto: CreateSubscriberRequestDto,
  ): Promise<CreateSubscriberResponseDto> {
    try {
      const subscriber = await this.subscriptionService.createSubscriber(dto);

      return subscriber;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }

  @EventPattern('disable-subscriber')
  public async disableSubscriber(
    dto: UpdateSubscriberStatusRequestDto,
  ): Promise<UpdateSubscriberStatusResponseDto> {
    try {
      const data = { ...dto, status: SubscriberStatus.Disabled };

      const subscriber = await this.subscriptionService.updateSubscriberStatus(
        data,
      );

      return subscriber;
    } catch (error) {
      throw new RpcException(error.message);
    }
  }
}
