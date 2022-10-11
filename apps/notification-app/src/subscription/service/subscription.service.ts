import { Injectable } from '@nestjs/common';
import {
  CreateSubscriberRequestDto,
  CreateSubscriberResponseDto,
  UpdateSubscriberStatusRequestDto,
  UpdateSubscriberStatusResponseDto,
} from '../dto';
import { SubscriptionRepository } from '../repository';
import { ISubscriptionService } from './subscription.service.interface';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  public async createSubscriber(
    data: CreateSubscriberRequestDto,
  ): Promise<CreateSubscriberResponseDto> {
    try {
      const subscriber = await this.subscriptionRepository.createSubscriber(
        data,
      );

      return subscriber;
    } catch (error) {
      throw new Error(
        `Error occurred while creating new subscriber: ${error.message}`,
      );
    }
  }

  public async updateSubscriberStatus(
    data: UpdateSubscriberStatusRequestDto,
  ): Promise<UpdateSubscriberStatusResponseDto> {
    try {
      const updatedSubscriber =
        await this.subscriptionRepository.updateSubscriberStatus(data);

      return updatedSubscriber;
    } catch (error) {
      throw new Error(
        `Error occurred while updating subscriber status: ${error.message}`,
      );
    }
  }
}
